
import { useCallback, useState } from 'react';
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
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, Info, UserCircle } from 'lucide-react';

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
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'system':
        return <Info className="h-5 w-5 text-gray-600" />;
      case 'decision':
        return <UserCircle className="h-5 w-5 text-blue-600" />;
      case 'followup':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'consequence':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  // Convert messages to nodes
  const initialNodes: Node[] = messages.map((msg, index) => ({
    id: msg.id,
    type: 'default',
    data: { 
      label: (
        <div 
          className={`p-4 rounded-lg w-[300px] transition-all ${
            msg.type === 'system' ? 'bg-muted' :
            msg.type === 'decision' ? 'bg-blue-50 dark:bg-blue-900/20' :
            msg.type === 'followup' ? 'bg-green-50 dark:bg-green-900/20' :
            'bg-yellow-50 dark:bg-yellow-900/20'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {getNodeIcon(msg.type)}
              <span className="font-medium">
                {msg.type === 'system' ? 'System Update' :
                 msg.type === 'decision' ? 'Your Decision' :
                 msg.type === 'followup' ? 'Follow-up Information' :
                 'Consequence'}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => toggleNode(msg.id)}
              className="h-6 w-6"
            >
              {expandedNodes.has(msg.id) ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <div className={`overflow-hidden transition-all ${
            expandedNodes.has(msg.id) ? 'max-h-96' : 'max-h-8'
          }`}>
            <p className="text-sm text-muted-foreground">{msg.content}</p>
          </div>
        </div>
      )
    },
    position: { x: 250, y: index * 150 },
    className: `crisis-node-${msg.type} ${
      expandedNodes.has(msg.id) ? 'expanded' : 'collapsed'
    }`
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
        animated: msg.type === 'consequence',
        style: {
          stroke: msg.type === 'consequence' ? '#f97316' : 
                 msg.type === 'decision' ? '#2563eb' :
                 msg.type === 'followup' ? '#16a34a' : '#64748b'
        }
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
    style: { stroke: '#2563eb' }
  })) : [];

  const [nodes, setNodes, onNodesChange] = useNodesState([...initialNodes, ...optionNodes]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([...initialEdges, ...optionEdges]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="h-[600px] w-full border rounded-lg bg-background/50 backdrop-blur-sm">
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
        <Background color="#94a3b8" />
        <MiniMap 
          nodeColor={(node) => {
            const type = node.className?.split(' ')[0].split('-')[2];
            switch (type) {
              case 'system': return '#64748b';
              case 'decision': return '#2563eb';
              case 'followup': return '#16a34a';
              case 'consequence': return '#f97316';
              default: return '#94a3b8';
            }
          }}
          maskColor="#ffffff50"
        />
      </ReactFlow>
    </div>
  );
};
