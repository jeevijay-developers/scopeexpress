import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, HelpCircle } from 'lucide-react';

interface MockTestCardProps {
  id: string;
  testName: string;
  durationMinutes: number;
  totalQuestions: number;
  onStart: (id: string) => void;
}

const MockTestCard = ({ id, testName, durationMinutes, totalQuestions, onStart }: MockTestCardProps) => {
  return (
    <Card className="p-5 card-hover space-y-4">
      <h3 className="font-bold text-lg">{testName}</h3>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" /> {totalQuestions} Questions
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" /> {durationMinutes} min
        </span>
      </div>
      <Button onClick={() => onStart(id)} className="w-full">
        Start Test
      </Button>
    </Card>
  );
};

export default MockTestCard;
