
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  messages = [],
  currentOptions = [],
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

  const renderMessage = (msg: typeof messages[0], index: number) => {
    const isExpanded = expandedNodes.has(msg.id);
    const hasFollowingMessage = index < messages.length - 1;

    return (
      <div key={msg.id} className="relative">
        <div className={`
          p-4 rounded-lg shadow-lg ring-1 
          ${msg.type === 'system' ? 'bg-muted ring-black/5' :
            msg.type === 'decision' ? 'bg-blue-50 dark:bg-blue-900/20 ring-blue-500/20' :
            msg.type === 'followup' ? 'bg-green-50 dark:bg-green-900/20 ring-green-500/20' :
            'bg-yellow-50 dark:bg-yellow-900/20 ring-yellow-500/20'}
        `}>
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
              {isExpanded ? 
                <ChevronUp className="h-4 w-4" /> : 
                <ChevronDown className="h-4 w-4" />
              }
            </Button>
          </div>
          <div className={`overflow-hidden transition-all duration-200 ${
            isExpanded ? 'max-h-96' : 'max-h-8'
          }`}>
            <p className="text-sm text-muted-foreground">{msg.content}</p>
          </div>
        </div>
        {hasFollowingMessage && (
          <div className="absolute left-6 bottom-0 w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
    );
  };

  const renderOptions = () => {
    if (currentOptions.length === 0) return null;

    return (
      <div className="mt-8 space-y-2">
        <h3 className="font-medium text-sm text-muted-foreground mb-4">Available Actions:</h3>
        {currentOptions.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full text-left justify-start h-auto py-3 px-4"
            onClick={() => onDecision(option.text, option.impact, option.nextStepId, option.consequence)}
          >
            <div>
              <div className="font-medium">{option.text}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Impact: {option.impact.charAt(0).toUpperCase() + option.impact.slice(1)}
              </div>
            </div>
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-[600px] w-full bg-background/50 backdrop-blur-sm rounded-lg p-6">
      <div className="space-y-6">
        {messages.map((msg, index) => renderMessage(msg, index))}
        {renderOptions()}
      </div>
    </div>
  );
};
