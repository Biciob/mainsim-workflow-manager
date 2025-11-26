import React, { useState } from 'react';
import { generateWorkflow } from '../services/geminiService';
import { GeneratedNode, GeneratedEdge } from '../types';

interface AIAssistantProps {
  onWorkflowGenerated: (nodes: GeneratedNode[], edges: GeneratedEdge[]) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onWorkflowGenerated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await generateWorkflow(prompt);
      if (result) {
        onWorkflowGenerated(result.nodes, result.edges);
        setIsOpen(false);
        setPrompt('');
      } else {
        setError('Impossibile generare il workflow. Riprova.');
      }
    } catch (e) {
      setError('Errore nella connessione API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div className={`bg-white rounded-xl shadow-2xl border border-slate-200 w-80 mb-4 transition-all duration-300 origin-bottom-right pointer-events-auto overflow-hidden ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 mb-0'}`}>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4">
            <h3 className="text-white font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                AI Architect
            </h3>
            <p className="text-indigo-100 text-xs mt-1">Descrivi il tuo processo di lavoro ideale.</p>
        </div>
        <div className="p-4 bg-white">
            <textarea
                className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none text-slate-700"
                rows={4}
                placeholder="Es. Un workflow per manutenzione correttiva urgente che richiede doppia approvazione..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
                {loading ? (
                    <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generazione...
                    </>
                ) : 'Genera Workflow'}
            </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center group"
        title="Assistente AI"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  );
};

export default AIAssistant;
