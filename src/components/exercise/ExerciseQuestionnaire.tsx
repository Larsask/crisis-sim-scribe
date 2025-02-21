
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface ExerciseQuestionnaireProps {
  onComplete: (responses: {
    situationHandling: string;
    lessonsLearned: string;
    keyTakeaways: string[];
  }) => void;
}

export const ExerciseQuestionnaire = ({ onComplete }: ExerciseQuestionnaireProps) => {
  const [situationHandling, setSituationHandling] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [keyTakeaways, setKeyTakeaways] = useState(['', '', '']);

  const handleSubmit = () => {
    onComplete({
      situationHandling,
      lessonsLearned,
      keyTakeaways: keyTakeaways.filter(t => t.trim() !== '')
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Exercise Reflection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="font-medium">How do you feel you handled the situation?</label>
          <Textarea
            value={situationHandling}
            onChange={(e) => setSituationHandling(e.target.value)}
            placeholder="Reflect on your decision-making process and actions taken..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">What lessons did you learn from this exercise?</label>
          <Textarea
            value={lessonsLearned}
            onChange={(e) => setLessonsLearned(e.target.value)}
            placeholder="Describe the key lessons and insights gained..."
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium">Your 3 key takeaway points:</label>
          {keyTakeaways.map((takeaway, index) => (
            <Textarea
              key={index}
              value={takeaway}
              onChange={(e) => {
                const newTakeaways = [...keyTakeaways];
                newTakeaways[index] = e.target.value;
                setKeyTakeaways(newTakeaways);
              }}
              placeholder={`Key takeaway ${index + 1}`}
              className="min-h-[60px] mb-2"
            />
          ))}
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full"
          disabled={!situationHandling.trim() || !lessonsLearned.trim() || !keyTakeaways[0].trim()}
        >
          Complete Exercise
        </Button>
      </CardContent>
    </Card>
  );
};
