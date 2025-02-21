
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Settings, Volume2, Volume1, VolumeX } from 'lucide-react';
import { ExerciseConfig } from '@/types/crisis-enhanced';

interface ExerciseConfigPanelProps {
  config: ExerciseConfig;
  onConfigChange: (config: ExerciseConfig) => void;
}

export const ExerciseConfigPanel = ({ config, onConfigChange }: ExerciseConfigPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateConfig = (updates: Partial<ExerciseConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4"
        onClick={() => setIsOpen(true)}
      >
        <Settings className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Exercise Settings</h3>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
          ×
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Event Frequency</Label>
          <RadioGroup
            value={config.timeBasedEvents.frequency}
            onValueChange={(value: 'low' | 'medium' | 'high') =>
              updateConfig({
                timeBasedEvents: { ...config.timeBasedEvents, frequency: value }
              })
            }
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="freq-low" />
              <Label htmlFor="freq-low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="freq-med" />
              <Label htmlFor="freq-med">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="freq-high" />
              <Label htmlFor="freq-high">High</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>AI Response Style</Label>
          <RadioGroup
            value={config.aiResponses.style}
            onValueChange={(value: 'concise' | 'detailed' | 'analytical') =>
              updateConfig({
                aiResponses: { ...config.aiResponses, style: value }
              })
            }
            className="flex gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="concise" id="style-concise" />
              <Label htmlFor="style-concise">Concise</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="style-detailed" />
              <Label htmlFor="style-detailed">Detailed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="analytical" id="style-analytical" />
              <Label htmlFor="style-analytical">Analytical</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Voice Settings</Label>
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.voiceSettings.enabled}
              onCheckedChange={(checked) =>
                updateConfig({
                  voiceSettings: { ...config.voiceSettings, enabled: checked }
                })
              }
            />
            <Label>Enable Voice Calls</Label>
          </div>
          {config.voiceSettings.enabled && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.voiceSettings.autoPlayAudio}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      voiceSettings: { ...config.voiceSettings, autoPlayAudio: checked }
                    })
                  }
                />
                <Label>Auto-play Audio</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.voiceSettings.transcribeResponses}
                  onCheckedChange={(checked) =>
                    updateConfig({
                      voiceSettings: { ...config.voiceSettings, transcribeResponses: checked }
                    })
                  }
                />
                <Label>Transcribe Responses</Label>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
