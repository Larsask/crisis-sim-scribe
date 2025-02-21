
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info, UserCircle } from 'lucide-react';

interface CrisisNode {
  id: string;
  type: 'event' | 'decision' | 'consequence';
  content: string;
  parentId?: string;
  timestamp: number;
  status: 'active' | 'resolved' | 'escalated';
}

interface CrisisHierarchyChartProps {
  nodes: CrisisNode[];
}

export const CrisisHierarchyChart = ({ nodes }: CrisisHierarchyChartProps) => {
  const [organizedNodes, setOrganizedNodes] = useState<{[key: string]: CrisisNode[]}>({});

  useEffect(() => {
    const nodesByParent: {[key: string]: CrisisNode[]} = {};
    
    // Group nodes by their parent
    nodes.forEach(node => {
      const parentId = node.parentId || 'root';
      if (!nodesByParent[parentId]) {
        nodesByParent[parentId] = [];
      }
      nodesByParent[parentId].push(node);
    });

    setOrganizedNodes(nodesByParent);
  }, [nodes]);

  const getNodeIcon = (type: string, status: string) => {
    if (status === 'resolved') return <CheckCircle className="h-5 w-5 text-green-500" />;
    
    switch (type) {
      case 'event':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'decision':
        return <UserCircle className="h-5 w-5 text-purple-500" />;
      case 'consequence':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderNodeTree = (parentId: string = 'root', level: number = 0) => {
    const children = organizedNodes[parentId] || [];
    
    return children.map((node, index) => (
      <div key={node.id} className="relative">
        <div className={`
          ml-${level * 6} p-4 rounded-lg shadow-sm
          ${node.status === 'resolved' ? 'bg-green-50 dark:bg-green-900/20' :
            node.status === 'escalated' ? 'bg-red-50 dark:bg-red-900/20' :
            'bg-blue-50 dark:bg-blue-900/20'}
          ${level > 0 ? 'border-l-2 border-gray-200 dark:border-gray-700' : ''}
        `}>
          <div className="flex items-center gap-2">
            {getNodeIcon(node.type, node.status)}
            <span className="font-medium">{node.content}</span>
          </div>
        </div>
        {organizedNodes[node.id] && renderNodeTree(node.id, level + 1)}
      </div>
    ));
  };

  return (
    <Card className="p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <h2 className="font-semibold text-lg mb-4">Crisis Progression</h2>
      <div className="space-y-4">
        {renderNodeTree()}
      </div>
    </Card>
  );
};
