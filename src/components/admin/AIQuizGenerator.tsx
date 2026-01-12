import { useState } from 'react';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TOPICS = [
  { value: 'maths', label: 'Mathematics', labelHi: 'गणित' },
  { value: 'science', label: 'Science', labelHi: 'विज्ञान' },
  { value: 'gk', label: 'General Knowledge', labelHi: 'सामान्य ज्ञान' },
  { value: 'reasoning', label: 'Logical Reasoning', labelHi: 'तार्किक तर्क' },
  { value: 'history', label: 'History', labelHi: 'इतिहास' },
];

const CLASS_LEVELS = ['6', '7', '8', '9', '10', '11', '12'];

const AIQuizGenerator = () => {
  const [topic, setTopic] = useState('maths');
  const [classLevel, setClassLevel] = useState('6');
  const [language, setLanguage] = useState('en');
  const [count, setCount] = useState([5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedCount(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: {
          topic,
          classLevel,
          language,
          count: count[0],
        },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedCount(data.count);
      toast.success(`Successfully generated ${data.count} questions!`);
    } catch (error: any) {
      console.error('Error generating quiz:', error);
      toast.error(error.message || 'Failed to generate questions');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Quiz Generator
        </CardTitle>
        <CardDescription>
          Generate quiz questions automatically using AI. Questions will be saved to the question bank.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Topic</Label>
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Class Level</Label>
            <Select value={classLevel} onValueChange={setClassLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CLASS_LEVELS.map(c => (
                  <SelectItem key={c} value={c}>Class {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of Questions: {count[0]}</Label>
            <Slider
              value={count}
              onValueChange={setCount}
              min={1}
              max={15}
              step={1}
              className="mt-3"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-primary"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Questions
              </>
            )}
          </Button>

          {generatedCount !== null && (
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              <span>{generatedCount} questions generated and saved!</span>
            </div>
          )}
        </div>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              AI-generated questions are saved directly to your question bank. 
              Review them in the Questions tab and edit/delete as needed.
              Generation uses Lovable AI credits.
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIQuizGenerator;
