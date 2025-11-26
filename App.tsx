import React, { useCallback, useRef, useState, useMemo } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Panel,
  MarkerType,
  useReactFlow,
} from 'reactflow';
import Sidebar from './components/Sidebar';
import CustomNode from './components/CustomNode';
import AIAssistant from './components/AIAssistant';
import NodeInspector from './components/NodeInspector';
import { GeneratedNode, GeneratedEdge } from './types';
import { getLayoutedElements } from './utils/layout';

// Initial dummy data
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Creazione', description: 'Inizio del processo di ordine', sequenceNumber: 1 },
    position: { x: 250, y: 5 },
  },
];

let id = 0;
const getId = () => `dndnode_${id++}`;

const Flow = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  // Helper to find selected node object
  const selectedNode = useMemo(() => 
    nodes.find(n => n.id === selectedNodeId) || null, 
  [nodes, selectedNodeId]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ 
        ...params, 
        type: 'smoothstep', 
        animated: true,
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: { strokeWidth: 2 }
    }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const label = event.dataTransfer.getData('application/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: label, sequenceNumber: nodes.length + 1 },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, nodes.length]
  );

  const handleAIGeneratedWorkflow = useCallback((newNodes: GeneratedNode[], newEdges: GeneratedEdge[]) => {
      const formattedNodes: Node[] = newNodes.map((n, idx) => ({
          id: n.id,
          type: 'custom',
          position: n.position,
          data: { ...n.data, sequenceNumber: idx + 1 }
      }));

      const formattedEdges: Edge[] = newEdges.map(e => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'smoothstep',
          animated: true,
          label: e.label,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          style: { strokeWidth: 2 }
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
      
      setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.2 });
      }, 100);
  }, [setNodes, setEdges, reactFlowInstance]);

  // Node Inspector Handlers
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
      setSelectedNodeId(null);
  }, []);

  const handleUpdateNode = useCallback((id: string, data: any) => {
      setNodes((nds) => nds.map((node) => {
          if (node.id === id) {
              return { ...node, data: { ...node.data, ...data } };
          }
          return node;
      }));
  }, [setNodes]);

  const handleUpdateEdge = useCallback((id: string, label: string) => {
      setEdges((eds) => eds.map((edge) => {
          if (edge.id === id) {
              return { ...edge, label };
          }
          return edge;
      }));
  }, [setEdges]);

  const handleDeleteEdge = useCallback((id: string) => {
      setEdges((eds) => eds.filter(e => e.id !== id));
  }, [setEdges]);

  const handleAddEdge = useCallback((source: string, target: string, label: string) => {
      const newEdge: Edge = {
          id: `e${source}-${target}-${Date.now()}`,
          source,
          target,
          label,
          type: 'smoothstep',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 }
      };
      setEdges((eds) => [...eds, newEdge]);
  }, [setEdges]);

  const handleAutoLayout = useCallback(() => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges
      );
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
      
      setTimeout(() => {
          reactFlowInstance?.fitView({ padding: 0.2, duration: 800 });
      }, 10);
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  return (
    <div className="flex h-screen w-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls className="bg-white border border-slate-200 shadow-sm" />
          <MiniMap 
            nodeColor={(n) => {
                if (n.data.label === 'Risolto' || n.data.label === 'Completato') return '#dcfce7'; 
                if (n.data.label === 'Cancellato') return '#e2e8f0'; 
                return '#f1f5f9'; 
            }}
            nodeStrokeColor="#94a3b8"
            nodeBorderRadius={4}
            className="border border-slate-200 shadow-lg bg-white" 
            zoomable 
            pannable 
          />
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#cbd5e1" />
          
          <Panel position="top-right" className="m-4 flex gap-2">
             <button 
                onClick={handleAutoLayout}
                className="bg-white hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg border border-slate-200 shadow-sm text-xs font-medium flex items-center gap-2 transition-colors"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
                Auto Layout
             </button>
             <div className="bg-white/80 backdrop-blur p-2 rounded-lg border border-slate-200 text-xs text-slate-500 shadow-sm">
                Navigazione Mappa
             </div>
          </Panel>
        </ReactFlow>

        <NodeInspector 
            selectedNode={selectedNode}
            nodes={nodes}
            edges={edges}
            onUpdateNode={handleUpdateNode}
            onUpdateEdge={handleUpdateEdge}
            onDeleteEdge={handleDeleteEdge}
            onAddEdge={handleAddEdge}
            onClose={() => setSelectedNodeId(null)}
        />

        <AIAssistant onWorkflowGenerated={handleAIGeneratedWorkflow} />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}