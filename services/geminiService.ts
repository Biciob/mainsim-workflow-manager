import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorkflowGenerationResponse } from "../types";

const apiKey = import.meta.env.VITE_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const workflowSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    nodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, description: "Use 'custom' for all nodes" },
          position: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER }
            }
          },
          data: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING, description: "The name of the workflow stage (e.g. Approval, Completed)" },
              description: { type: Type.STRING, description: "Short description of what happens in this stage" }
            }
          }
        }
      }
    },
    edges: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          source: { type: Type.STRING, description: "ID of the source node" },
          target: { type: Type.STRING, description: "ID of the target node" },
          label: { type: Type.STRING, description: "Optional condition for the transition (e.g. 'If approved')" }
        }
      }
    },
    summary: { type: Type.STRING, description: "A brief summary of the generated workflow logic." }
  }
};

export const generateWorkflow = async (prompt: string): Promise<WorkflowGenerationResponse | null> => {
  if (!apiKey) {
    console.warn("API Key is missing.");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert Work Order Workflow architect. 
      Create a React Flow compatible JSON structure for a maintenance workflow based on the following user request: "${prompt}".
      
      Available Standard Phases (use these labels if applicable, but you can create others):
      Creazione, Approvazione, Richiesta Preventivo, In Esecuzione, Sospensione, Pianificato, Schedulato, In Attesa, Risolto, Completato, Cancellato, Clonato.
      
      Layout the nodes logically on an infinite canvas starting around x:0, y:0 and flowing generally downwards or rightwards. Spread them out (at least 200px gap) so they don't overlap.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: workflowSchema,
        systemInstruction: "You represent a technical workflow engine. Output strictly valid JSON matching the schema.",
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as WorkflowGenerationResponse;
  } catch (error) {
    console.error("Gemini generation error:", error);
    return null;
  }
};