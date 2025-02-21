
import { useExerciseContext } from './ExerciseContext';
import { CrisisResponseFlow } from './CrisisResponseFlow';
import { CurrentSituation } from './CurrentSituation';
import { StakeholderMessages } from './StakeholderMessages';
import { JournalistCall } from './JournalistCall';
import { FollowUpBox } from './FollowUpBox';
import { ExerciseConfigPanel } from './ExerciseConfig';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/scenario-setup')}
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Setup
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-lg">
              {formatTimeRemaining(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Crisis Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-4">
              <CrisisResponseFlow 
                events={events}
                timeRemaining={timeRemaining}
              />
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
