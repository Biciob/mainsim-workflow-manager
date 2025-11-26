import React, { useState, useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { PHASE_COLORS } from '../types';

interface NodeInspectorProps {
  selectedNode: Node | null;
  nodes: Node[];
  edges: Edge[];
  onUpdateNode: (id: string, data: any) => void;
  onUpdateEdge: (id: string, label: string) => void;
  onDeleteEdge: (id: string) => void;
  onAddEdge: (source: string, target: string, label: string) => void;
  onClose: () => void;
}

const NodeInspector: React.FC<NodeInspectorProps> = ({
  selectedNode,
  nodes,
  edges,
  onUpdateNode,
  onUpdateEdge,
  onDeleteEdge,
  onAddEdge,
  onClose
}) => {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState<number>(0);
  const [newTargetId, setNewTargetId] = useState('');
  const [newEdgeLabel, setNewEdgeLabel] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label || '');
      setDescription(selectedNode.data.description || '');
      setSequenceNumber(selectedNode.data.sequenceNumber || 0);
      setNewTargetId('');
      setNewEdgeLabel('');
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleSave = () => {
    onUpdateNode(selectedNode.id, {
      ...selectedNode.data,
      label,
      description,
      sequenceNumber
    });
  };

  const incomingEdges = edges.filter(e => e.target === selectedNode.id);
  const outgoingEdges = edges.filter(e => e.source === selectedNode.id);

  const availableTargets = nodes.filter(n => n.id !== selectedNode.id && !outgoingEdges.find(e => e.target === n.id));

  const handleAddEdge = () => {
    if (newTargetId) {
        onAddEdge(selectedNode.id, newTargetId, newEdgeLabel);
        setNewTargetId('');
        setNewEdgeLabel('');
    }
  };

  return (
    <div className="absolute top-4 right-4 z-50 w-96 bg-white shadow-2xl rounded-xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-fade-in-right">
      {/* Header */}
      <div className={`p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50`}>
        <h2 className="font-bold text-slate-800 flex items-center gap-2">
            <span className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">
                #{sequenceNumber}
            </span>
            Modifica Fase
        </h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="overflow-y-auto p-5 space-y-6 bg-slate-50/50">
        
        {/* Properties Section */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proprietà Fase</h3>
            
            <div className="grid grid-cols-4 gap-2">
                <div className="col-span-3">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Nome Fase</label>
                    <input 
                        type="text" 
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        onBlur={handleSave}
                        className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <div className="col-span-1">
                     <label className="block text-xs font-medium text-slate-500 mb-1">N°</label>
                     <input 
                        type="number" 
                        value={sequenceNumber}
                        onChange={(e) => setSequenceNumber(parseInt(e.target.value) || 0)}
                        onBlur={handleSave}
                        className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-center"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Descrizione</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onBlur={handleSave}
                    rows={3}
                    className="w-full border border-slate-200 rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
            </div>
        </section>

        {/* Incoming Connections */}
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                Entrate (Da dove arrivo)
                <span className="bg-slate-200 text-slate-600 rounded px-2 py-0.5 text-[10px]">{incomingEdges.length}</span>
            </h3>
            <div className="space-y-2">
                {incomingEdges.length === 0 && <p className="text-xs text-slate-400 italic">Nessuna entrata (Fase iniziale)</p>}
                {incomingEdges.map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    return (
                        <div key={edge.id} className="bg-white border border-slate-200 rounded-md p-2 flex items-center justify-between text-sm shadow-sm group">
                             <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                <span className="font-medium text-slate-700">{sourceNode?.data.label || edge.source}</span>
                             </div>
                             {/* Label is usually controlled by the source node's output, but we can display it */}
                             {edge.label && <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{edge.label}</span>}
                             <button onClick={() => onDeleteEdge(edge.id)} className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                             </button>
                        </div>
                    );
                })}
            </div>
        </section>

        {/* Outgoing Connections */}
        <section className="space-y-3">
             <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
                Uscite (Dove vado)
                <span className="bg-slate-200 text-slate-600 rounded px-2 py-0.5 text-[10px]">{outgoingEdges.length}</span>
            </h3>
            <div className="space-y-2">
                {outgoingEdges.length === 0 && <p className="text-xs text-slate-400 italic">Nessuna uscita (Fase finale)</p>}
                {outgoingEdges.map(edge => {
                     const targetNode = nodes.find(n => n.id === edge.target);
                     return (
                         <div key={edge.id} className="bg-white border border-slate-200 rounded-md p-3 space-y-2 shadow-sm">
                             <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-2">
                                     <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                     <span className="font-medium text-slate-700">{targetNode?.data.label || edge.target}</span>
                                 </div>
                                 <button onClick={() => onDeleteEdge(edge.id)} className="text-slate-400 hover:text-red-500">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                         <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                     </svg>
                                 </button>
                             </div>
                             <div className="flex items-center gap-2 bg-slate-50 p-1 rounded border border-slate-100">
                                 <span className="text-[10px] text-slate-400 font-mono uppercase">COND:</span>
                                 <input 
                                     type="text" 
                                     placeholder="Es. Se approvato..."
                                     className="bg-transparent text-xs w-full outline-none text-slate-600"
                                     value={edge.label || ''}
                                     onChange={(e) => onUpdateEdge(edge.id, e.target.value)}
                                 />
                             </div>
                         </div>
                     );
                })}
            </div>

            {/* Add New Connection */}
            <div className="bg-slate-100 p-3 rounded-md border border-slate-200 mt-2">
                <div className="text-xs font-semibold text-slate-500 mb-2">Aggiungi Collegamento</div>
                <div className="flex flex-col gap-2">
                    <select 
                        value={newTargetId} 
                        onChange={(e) => setNewTargetId(e.target.value)}
                        className="text-xs p-2 rounded border border-slate-300 w-full"
                    >
                        <option value="">Seleziona destinazione...</option>
                        {availableTargets.map(t => (
                            <option key={t.id} value={t.id}>{t.data.label}</option>
                        ))}
                    </select>
                    <input 
                        type="text"
                        placeholder="Condizione (opzionale)"
                        value={newEdgeLabel}
                        onChange={(e) => setNewEdgeLabel(e.target.value)}
                        className="text-xs p-2 rounded border border-slate-300 w-full"
                    />
                    <button 
                        disabled={!newTargetId}
                        onClick={handleAddEdge}
                        className="bg-indigo-600 text-white text-xs py-2 rounded font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Collega
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default NodeInspector;