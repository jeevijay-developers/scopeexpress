import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Clock, Flag, ChevronLeft, ChevronRight, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  question_number: number;
}

interface MockTestPlayerProps {
  testId: string;
  testName: string;
  durationMinutes: number;
  totalQuestions: number;
  sessionId: string;
  onFinish: () => void;
}

const MockTestPlayer = ({ testId, testName, durationMinutes, totalQuestions, sessionId, onFinish }: MockTestPlayerProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [marked, setMarked] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from('mock_test_questions')
        .select('*')
        .eq('mock_test_id', testId)
        .order('question_number');
      if (data) {
        setQuestions(data.map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options as string[] : [],
        })));
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [testId]);

  const submitTest = useCallback(async () => {
    if (submitted) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correct_answer) correct++;
    });
    const totalAttempted = Object.keys(answers).length;
    setScore(correct);
    setSubmitted(true);

    await supabase.from('mock_test_sessions').update({
      answers,
      score: correct,
      total_attempted: totalAttempted,
      completed: true,
      completed_at: new Date().toISOString(),
    }).eq('id', sessionId);

    toast.success('Test submitted!');
  }, [submitted, questions, answers, sessionId]);

  useEffect(() => {
    if (submitted || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [submitted, loading, submitTest]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading questions...</div>;

  if (questions.length === 0) return (
    <div className="text-center py-20 space-y-4">
      <p className="text-muted-foreground text-lg">No questions added to this test yet.</p>
      <Button variant="outline" onClick={onFinish}>Go Back</Button>
    </div>
  );

  if (submitted) {
    const attempted = Object.keys(answers).length;
    const incorrect = attempted - score;
    const unanswered = questions.length - attempted;
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-fade-in">
        <Card className="p-8 text-center space-y-6">
          <CheckCircle2 className="h-16 w-16 mx-auto text-primary" />
          <h2 className="text-2xl font-bold">Test Complete!</h2>
          <p className="text-muted-foreground">{testName}</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <Card className="p-4 bg-primary/10"><p className="text-sm text-muted-foreground">Score</p><p className="text-2xl font-bold text-primary">{score}/{questions.length}</p></Card>
            <Card className="p-4 bg-primary/10"><p className="text-sm text-muted-foreground">Correct</p><p className="text-2xl font-bold text-primary">{score}</p></Card>
            <Card className="p-4 bg-destructive/10"><p className="text-sm text-muted-foreground">Incorrect</p><p className="text-2xl font-bold text-destructive">{incorrect}</p></Card>
            <Card className="p-4 bg-muted"><p className="text-sm text-muted-foreground">Unanswered</p><p className="text-2xl font-bold">{unanswered}</p></Card>
          </div>
          <Button onClick={onFinish} className="w-full" size="lg">
            <RotateCcw className="h-4 w-4 mr-2" /> Try Another Test
          </Button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="space-y-4">
      {/* Timer Bar */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border p-3 flex items-center justify-between rounded-xl">
        <h3 className="font-semibold text-sm truncate">{testName}</h3>
        <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-destructive animate-pulse' : 'text-primary'}`}>
          <Clock className="h-4 w-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
        {/* Question Area */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Badge>Q {currentIndex + 1} / {questions.length}</Badge>
            <Button
              variant={marked.has(currentIndex) ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                const next = new Set(marked);
                marked.has(currentIndex) ? next.delete(currentIndex) : next.add(currentIndex);
                setMarked(next);
              }}
            >
              <Flag className="h-3 w-3 mr-1" /> {marked.has(currentIndex) ? 'Marked' : 'Mark'}
            </Button>
          </div>

          <p className="text-lg font-medium leading-relaxed">{currentQ.question}</p>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setAnswers(prev => ({ ...prev, [currentIndex]: i }))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  answers[currentIndex] === i
                    ? 'border-primary bg-primary/10 font-medium'
                    : 'border-border hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="outline" disabled={currentIndex === 0} onClick={() => setCurrentIndex(i => i - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            {currentIndex < questions.length - 1 ? (
              <Button onClick={() => setCurrentIndex(i => i + 1)}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">Submit Test</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have answered {Object.keys(answers).length} of {questions.length} questions.
                      {questions.length - Object.keys(answers).length > 0 && ` ${questions.length - Object.keys(answers).length} questions are unanswered.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={submitTest}>Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </Card>

        {/* Question Navigation */}
        <Card className="p-4 space-y-3 h-fit">
          <h4 className="font-semibold text-sm">Questions</h4>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, i) => {
              const isAnswered = answers[i] !== undefined;
              const isMarked = marked.has(i);
              const isCurrent = i === currentIndex;
              return (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-medium transition-all border-2 ${
                    isCurrent ? 'border-primary bg-primary text-primary-foreground' :
                    isMarked ? 'border-secondary bg-secondary/20 text-secondary' :
                    isAnswered ? 'border-primary bg-primary/20 text-primary' :
                    'border-border hover:border-primary/50'
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div className="space-y-1 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-primary/20 border border-primary" /> Answered</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-secondary/20 border border-secondary" /> Marked</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded border border-border" /> Not Visited</div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full mt-4" size="sm">Submit Test</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Test?</AlertDialogTitle>
                <AlertDialogDescription>
                  Answered: {Object.keys(answers).length}/{questions.length}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={submitTest}>Submit</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </div>
    </div>
  );
};

export default MockTestPlayer;
