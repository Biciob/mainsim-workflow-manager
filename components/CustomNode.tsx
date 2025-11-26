import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { PHASE_COLORS } from '../types';

const CustomNode = ({ data, selected }: NodeProps) => {
  // Determine color based on label if it matches a known phase, otherwise default to gray
  const colorClass = Object.entries(PHASE_COLORS).find(([phase]) => 
    data.label === phase
  )?.[1] || 'bg-white border-slate-300 text-slate-800';

  return (
    <div
      className={`relative px-4 py-3 shadow-md rounded-lg border-2 w-64 transition-all duration-200 ${colorClass} ${
        selected ? 'ring-2 ring-indigo-500 shadow-xl scale-105 z-10' : ''
      }`}
    >
      {/* Sequence Number Badge */}
      {typeof data.sequenceNumber === 'number' && (
        <div className="absolute -top-3 -left-2 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm border-2 border-white">
          #{data.sequenceNumber}
        </div>
      )}

      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-slate-400" />
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
            <span className="font-bold text-sm tracking-wide uppercase truncate pr-2">
                {data.label}
            </span>
            {selected && (
                <span className="text-[10px] bg-black/10 px-1 rounded text-black/60">
                    EDIT
                </span>
            )}
        </div>
        
        {data.description ? (
             <div className="text-xs opacity-90 leading-relaxed font-medium">
                {data.description}
             </div>
        ) : (
            <div className="text-xs opacity-50 italic">
                Nessuna descrizione
            </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-slate-400" />
    </div>
  );
};

export default memo(CustomNode);