
import { useExerciseContext } from './ExerciseContext';
import { CrisisResponseFlow } from './CrisisResponseFlow';
import { CurrentSituation } from './CurrentSituation';
import { StakeholderMessages } from './StakeholderMessages';
import { JournalistCall } from './JournalistCall';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CrisisContainer = () => {
  const navigate = useNavigate();
  const {
    events,
    messages,
    currentStepId,
    isTimeSkipping,
    availableOptions,
    onDecision,
    onTimeSkip
  } = useExerciseContext();

  return (
    <div className="min-h-screen bg-background p-6">
      <Button 
        variant="outline" 
        onClick={() => navigate('/scenario-setup')}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Setup
      </Button>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <CrisisResponseFlow 
              events={events}
              timeRemaining={timeRemaining}
            />
          </div>

          <div className="space-y-6">
            <CurrentSituation
              currentStepId={currentStepId}
              onDecision={onDecision}
              isTimeSkipping={isTimeSkipping}
              onTimeSkip={onTimeSkip}
              scenarioBrief={scenarioBrief}
              availableOptions={availableOptions}
            />
          </div>
        </div>

        <StakeholderMessages
          messages={messages}
          onRespond={handleStakeholderResponse}
          onDismiss={handleMessageDismiss}
        />

        {showJournalistCall && (
          <JournalistCall
            onClose={() => setShowJournalistCall(false)}
            onResponse={handleJournalistResponse}
          />
        )}
      </div>
    </div>
  );
};
