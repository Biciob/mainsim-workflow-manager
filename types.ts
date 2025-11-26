export interface WorkflowNodeData {
  label: string;
  description?: string;
  status?: string;
  isTerminal?: boolean;
  sequenceNumber?: number;
}

export enum WorkOrderPhase {
  CREATION = 'Creazione',
  APPROVAL = 'Approvazione',
  QUOTE_REQUEST = 'Richiesta Preventivo',
  IN_PROGRESS = 'In Esecuzione',
  SUSPENDED = 'Sospensione',
  PLANNED = 'Pianificato',
  SCHEDULED = 'Schedulato',
  ON_HOLD = 'In Attesa',
  RESOLVED = 'Risolto',
  COMPLETED = 'Completato',
  CANCELLED = 'Cancellato',
  CLONED = 'Clonato'
}

export const PHASE_COLORS: Record<WorkOrderPhase, string> = {
  [WorkOrderPhase.CREATION]: 'bg-blue-100 border-blue-300 text-blue-900',
  [WorkOrderPhase.APPROVAL]: 'bg-purple-100 border-purple-300 text-purple-900',
  [WorkOrderPhase.QUOTE_REQUEST]: 'bg-yellow-100 border-yellow-300 text-yellow-900',
  [WorkOrderPhase.IN_PROGRESS]: 'bg-orange-100 border-orange-300 text-orange-900',
  [WorkOrderPhase.SUSPENDED]: 'bg-red-100 border-red-300 text-red-900',
  [WorkOrderPhase.PLANNED]: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  [WorkOrderPhase.SCHEDULED]: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  [WorkOrderPhase.ON_HOLD]: 'bg-gray-200 border-gray-400 text-gray-800',
  [WorkOrderPhase.RESOLVED]: 'bg-teal-100 border-teal-300 text-teal-900',
  [WorkOrderPhase.COMPLETED]: 'bg-green-100 border-green-300 text-green-900',
  [WorkOrderPhase.CANCELLED]: 'bg-slate-200 border-slate-400 text-slate-500',
  [WorkOrderPhase.CLONED]: 'bg-pink-100 border-pink-300 text-pink-900',
};

// Types for Gemini Generation
export interface GeneratedNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string; description: string };
}

export interface GeneratedEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowGenerationResponse {
  nodes: GeneratedNode[];
  edges: GeneratedEdge[];
  summary: string;
}