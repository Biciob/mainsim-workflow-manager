import React from 'react';
import { WorkOrderPhase, PHASE_COLORS } from '../types';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shadow-lg z-10 relative">
      <div className="p-5 border-b border-slate-100 bg-slate-50">
        <h1 className="text-xl font-bold text-slate-800">Libreria Fasi</h1>
        <p className="text-xs text-slate-500 mt-1">Trascina le fasi nella lavagna</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Object.values(WorkOrderPhase).map((phase) => (
          <div
            key={phase}
            className={`p-3 rounded-md cursor-grab border hover:shadow-md transition-all active:cursor-grabbing select-none text-sm font-medium ${PHASE_COLORS[phase]}`}
            onDragStart={(event) => onDragStart(event, 'custom', phase)}
            draggable
          >
            <div className="flex items-center justify-between">
                <span>{phase}</span>
                <span className="text-[10px] opacity-60">:::</span>
            </div>
          </div>
        ))}
        
        <div className="mt-6 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Custom</h3>
            <div
                className="p-3 rounded-md cursor-grab border border-dashed border-slate-300 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:border-slate-400 transition-all text-sm"
                onDragStart={(event) => onDragStart(event, 'custom', 'Nuovo Step')}
                draggable
            >
                + Fase Personalizzata
            </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 text-center">
        FlowMaint v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
