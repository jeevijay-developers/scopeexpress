import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import ExamSelector from '@/components/mocktest/ExamSelector';
import MockTestCard from '@/components/mocktest/MockTestCard';
import MockTestPlayer from '@/components/mocktest/MockTestPlayer';

type View = 'exams' | 'tests' | 'register' | 'playing';

const MockTest = () => {
  const [view, setView] = useState<View>('exams');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [sessionId, setSessionId] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');

  const { data: tests, isLoading } = useQuery({
    queryKey: ['mock-tests', selectedExam],
    queryFn: async () => {
      const { data } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('exam_name', selectedExam)
        .order('created_at');
      return data || [];
    },
    enabled: !!selectedExam && view === 'tests',
  });

  const handleSelectExam = (exam: string) => {
    setSelectedExam(exam);
    setView('tests');
  };

  const handleStartTest = (testId: string) => {
    const test = tests?.find(t => t.id === testId);
    setSelectedTestId(testId);
    setSelectedTest(test);
    setView('register');
  };

  const handleBeginTest = async () => {
    if (!name.trim() || !mobile.trim()) {
      toast.error('Please enter your name and mobile number');
      return;
    }
    if (!/^\d{10}$/.test(mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    const id = crypto.randomUUID();

    // Create lead
    const { data: leadData } = await supabase.from('leads').insert({
      id: crypto.randomUUID(),
      name,
      mobile,
      source_page: 'Mock Test',
      interest_type: `Mock Test - ${selectedExam}`,
    });

    // Create session
    const { error } = await supabase.from('mock_test_sessions').insert({
      id,
      mock_test_id: selectedTestId,
      name,
      mobile,
      started_at: new Date().toISOString(),
    });

    if (error) {
      toast.error('Failed to start test');
      return;
    }

    setSessionId(id);
    setView('playing');
  };

  const handleFinish = () => {
    setView('exams');
    setSelectedExam('');
    setSelectedTestId('');
    setName('');
    setMobile('');
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          {view !== 'playing' && (
            <div className="text-center mb-8 space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <FileText className="h-4 w-4" /> Mock Tests
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {view === 'exams' && 'Select Your Exam'}
                {view === 'tests' && selectedExam}
                {view === 'register' && 'Enter Your Details'}
              </h1>
              {view === 'exams' && (
                <p className="text-muted-foreground max-w-md mx-auto">
                  Practice with full-length mock tests for all competitive exams
                </p>
              )}
            </div>
          )}

          {/* Back Button */}
          {view !== 'exams' && view !== 'playing' && (
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => {
                if (view === 'register') setView('tests');
                else if (view === 'tests') { setView('exams'); setSelectedExam(''); }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}

          {/* Exam Selection */}
          {view === 'exams' && <ExamSelector onSelectExam={handleSelectExam} />}

          {/* Test List */}
          {view === 'tests' && (
            <div className="max-w-2xl mx-auto">
              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading tests...</p>
              ) : tests && tests.length > 0 ? (
                <div className="grid gap-4">
                  {tests.map(t => (
                    <MockTestCard
                      key={t.id}
                      id={t.id}
                      testName={t.test_name}
                      durationMinutes={t.duration_minutes}
                      totalQuestions={t.total_questions}
                      onStart={handleStartTest}
                    />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No mock tests available for {selectedExam} yet. Check back soon!</p>
                </Card>
              )}
            </div>
          )}

          {/* Registration Form */}
          {view === 'register' && (
            <Card className="max-w-md mx-auto p-6 space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input placeholder="10-digit mobile number" value={mobile} onChange={e => setMobile(e.target.value)} maxLength={10} />
              </div>
              <Button onClick={handleBeginTest} className="w-full" size="lg">
                Begin Test
              </Button>
            </Card>
          )}

          {/* Test Player */}
          {view === 'playing' && selectedTest && (
            <MockTestPlayer
              testId={selectedTestId}
              testName={selectedTest.test_name}
              durationMinutes={selectedTest.duration_minutes}
              totalQuestions={selectedTest.total_questions}
              sessionId={sessionId}
              onFinish={handleFinish}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MockTest;
