
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface PublicStatementProps {
  onSubmit: (statement: string) => void;
  onPostpone: () => void;
}

export const PublicStatement = ({ onSubmit, onPostpone }: PublicStatementProps) => {
  const [statement, setStatement] = useState('');
  const { toast } = useToast();
  
  const handleSubmit = () => {
    if (statement.length > 100) {
      toast({
        title: "Statement Too Long",
        description: "Please limit your statement to 100 words.",
        variant: "destructive"
      });
      return;
    }
    
    if (statement.length < 20) {
      toast({
        title: "Statement Too Short",
        description: "Please provide a more detailed statement.",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(statement);
  };

  return (
    <Card className="animate-in slide-in-from-bottom">
      <CardHeader>
        <CardTitle>Official Public Statement Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Prepare a clear, concise statement (100 words max) addressing the current situation.
          This will be your official position and will be referenced by media.
        </p>
        <Textarea
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          placeholder="Enter your public statement..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button onClick={handleSubmit}>
            Submit Statement
          </Button>
          <Button variant="outline" onClick={onPostpone}>
            Postpone
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {statement.length}/100 words
        </div>
      </CardContent>
    </Card>
  );
};
