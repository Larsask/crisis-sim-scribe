
import { useExerciseContext } from './ExerciseContext';
import { CrisisResponseFlow } from './CrisisResponseFlow';
import { CurrentSituation } from './CurrentSituation';
import { StakeholderMessages } from './StakeholderMessages';
import { JournalistCall } from './JournalistCall';
import { FollowUpBox } from './FollowUpBox';
import { ExerciseConfigPanel } from './ExerciseConfig';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Clock, AlertTriangle, Mail, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const getStakeholderIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />;
    case 'call':
      return <Phone className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'critical':
      return 'text-red-500';
    case 'urgent':
      return 'text-yellow-500';
    default:
      return 'text-blue-500';
  }
};

export const CrisisContainer = () => {
  const navigate = useNavigate();
  const {
    events,
    messages,
    currentStepId,
    isTimeSkipping,
    availableOptions,
    timeRemaining,
    scenarioBrief,
    showJournalistCall,
    followUpMessage,
    config,
    setConfig,
    onDecision,
    onTimeSkip,
    onStakeholderResponse,
    onMessageDismiss,
    onJournalistResponse,
    onFollowUpResponse,
    setShowJournalistCall
  } = useExerciseContext();

  const formatTimeRemaining = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Group stakeholder interactions by sender
  const stakeholderInteractions = messages.reduce((acc, message) => {
    if (!acc[message.sender]) {
      acc[message.sender] = [];
    }
    acc[message.sender].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/scenario-setup')}
            size="sm"
            className="mr-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Setup
          </Button>
          <div className="flex items-center gap-2 ml-auto">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg">
              {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-screen-2xl pt-16 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Crisis Timeline & Stakeholder Table */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-4">
              <CrisisResponseFlow 
                events={events}
                timeRemaining={timeRemaining}
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4">Stakeholder Tracking</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stakeholder</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Priority</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(stakeholderInteractions).map(([stakeholder, interactions]) => {
                    const latestInteraction = interactions[interactions.length - 1];
                    return (
                      <TableRow key={stakeholder}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {getStakeholderIcon(latestInteraction.type)}
                            {stakeholder}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={getStatusColor(latestInteraction.urgency)}>
                            {latestInteraction.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {new Date(latestInteraction.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          {latestInteraction.urgency === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </div>

          {/* Right Column - Current Situation & Actions */}
          <div className="lg:col-span-5 space-y-6">
            <CurrentSituation
              currentStepId={currentStepId}
              onDecision={onDecision}
              isTimeSkipping={isTimeSkipping}
              onTimeSkip={onTimeSkip}
              scenarioBrief={scenarioBrief}
              availableOptions={availableOptions}
            />

            {followUpMessage && (
              <FollowUpBox
                message={followUpMessage}
                onResponse={onFollowUpResponse}
                onDismiss={() => onFollowUpResponse("")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Messages Container - Fixed Position */}
      <div className="fixed bottom-4 right-4 w-96 max-w-[calc(100vw-2rem)] z-50">
        <StakeholderMessages
          messages={messages}
          onRespond={onStakeholderResponse}
          onDismiss={onMessageDismiss}
        />
      </div>

      {/* Journalist Call - Centered Modal */}
      {showJournalistCall && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
          <div className="w-full max-w-lg mx-4">
            <JournalistCall
              onClose={() => setShowJournalistCall(false)}
              onResponse={onJournalistResponse}
            />
          </div>
        </div>
      )}

      {/* Config Panel - Always accessible */}
      <ExerciseConfigPanel
        config={config}
        onConfigChange={setConfig}
      />
    </div>
  );
};
