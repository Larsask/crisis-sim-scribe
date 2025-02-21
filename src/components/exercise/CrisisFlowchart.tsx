
import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from "@/components/ui/button";

interface CrisisFlowchartProps {
  messages: Array<{
    id: string;
    type: 'system' | 'decision' | 'followup' | 'consequence';
    content: string;
    timestamp: number;
    groupId?: string;
  }>;
  currentOptions?: Array<{
    text: string;
    impact: 'low' | 'medium' | 'high';
    nextStepId: string;
    consequence: string;
    groupId?: string;
  }>;
  onDecision: (text: string, impact: 'low' | 'medium' | 'high', nextStepId: string, consequence: string) => void;
}

export const CrisisFlowchart = ({
  messages = [], // Provide default empty array
  currentOptions = [], // Provide default empty array
  onDecision
}: CrisisFlowchartProps) => {
  // Convert messages to nodes
  const initialNodes: Node[] = messages.map((msg, index) => ({
    id: msg.id,
    type: 'default',
    data: { 
      label: (
        <div className={`p-4 rounded-lg w-[300px] ${
          msg.type === 'system' ? 'bg-muted' :
          msg.type === 'decision' ? 'bg-blue-50 dark:bg-blue-900/20' :
          msg.type === 'followup' ? 'bg-green-50 dark:bg-green-900/20' :
          'bg-yellow-50 dark:bg-yellow-900/20'
        }`}>
          <div className="font-medium mb-2">
            {msg.type === 'system' ? 'System Update' :
             msg.type === 'decision' ? 'Your Decision' :
             msg.type === 'followup' ? 'Follow-up Information' :
             'Consequence'}
          </div>
          <p className="text-sm text-muted-foreground">{msg.content}</p>
        </div>
      )
    },
    position: { x: 250, y: index * 150 },
    className: `crisis-node-${msg.type}`
  }));

  // Add option nodes if there are current options
  const optionNodes: Node[] = currentOptions.map((opt, index) => ({
    id: `option-${index}`,
    type: 'default',
    data: {
      label: (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onDecision(opt.text, opt.impact, opt.nextStepId, opt.consequence)}
        >
          {opt.text}
        </Button>
      )
    },
    position: { x: 600, y: (messages.length + index) * 150 },
    className: 'crisis-node-option'
  }));

  // Create edges between related nodes, only if we have messages
  const initialEdges: Edge[] = messages.length > 1 ? messages.reduce((edges: Edge[], msg, index) => {
    if (index > 0 && messages[index - 1]) { // Check if previous message exists
      edges.push({
        id: `e${index}`,
        source: messages[index - 1].id,
        target: msg.id,
        type: 'smoothstep',
      });
    }
    return edges;
  }, []) : [];

  // Add edges for options, only if we have messages and options
  const optionEdges: Edge[] = messages.length > 0 ? currentOptions.map((_, index) => ({
    id: `eo${index}`,
    source: messages[messages.length - 1].id,
    target: `option-${index}`,
    type: 'smoothstep',
  })) : [];

  const [nodes, setNodes, onNodesChange] = useNodesState([...initialNodes, ...optionNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...initialEdges, ...optionEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="h-[600px] w-full border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};
