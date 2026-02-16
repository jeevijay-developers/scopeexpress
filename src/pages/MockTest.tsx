import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, UserCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import ExamSelector from '@/components/mocktest/ExamSelector';
import MockTestCard from '@/components/mocktest/MockTestCard';
import MockTestPlayer from '@/components/mocktest/MockTestPlayer';

type View = 'exams' | 'register' | 'tests' | 'playing';

const educationLevels = [
  '8th', '9th', '10th', '11th', '12th',
  '1st Year', '2nd Year', '3rd Year', '4th Year',
  'Graduate', 'Post Graduate', 'Dropper', 'Other',
];

const MockTest = () => {
  const [view, setView] = useState<View>('exams');
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [selectedTest, setSelectedTest] = useState<any>(null);
  const [sessionId, setSessionId] = useState('');
  const [registered, setRegistered] = useState(false);

  // Registration fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('');
  const [educationLevel, setEducationLevel] = useState('');

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
    enabled: !!selectedExam && (view === 'tests' || view === 'register'),
  });

  const handleSelectExam = (exam: string) => {
    setSelectedExam(exam);
    if (registered) {
      setView('tests');
    } else {
      setView('register');
    }
  };

  const handleRegister = async () => {
    if (!name.trim()) { toast.error('Please enter your name'); return; }
    if (!/^\d{10}$/.test(mobile)) { toast.error('Please enter a valid 10-digit mobile number'); return; }
    if (!city.trim()) { toast.error('Please enter your city'); return; }
    if (!educationLevel) { toast.error('Please select your education level'); return; }

    // Save lead to admin
    await supabase.from('leads').insert({
      id: crypto.randomUUID(),
      name,
      mobile,
      city,
      class: educationLevel,
      source_page: 'Mock Test',
      interest_type: `Mock Test - ${selectedExam}`,
    });

    setRegistered(true);
    setView('tests');
    toast.success('Registration successful! Choose your test.');
  };

  const handleStartTest = async (testId: string) => {
    const test = tests?.find(t => t.id === testId);
    setSelectedTestId(testId);
    setSelectedTest(test);

    const id = crypto.randomUUID();
    const { error } = await supabase.from('mock_test_sessions').insert({
      id,
      mock_test_id: testId,
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
                {view === 'register' && 'Enter Your Details'}
                {view === 'tests' && selectedExam}
              </h1>
              {view === 'exams' && (
                <p className="text-muted-foreground max-w-md mx-auto">
                  Practice with full-length mock tests for all competitive exams
                </p>
              )}
              {view === 'register' && (
                <p className="text-muted-foreground max-w-md mx-auto">
                  Fill in your details to access {selectedExam} mock tests
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
                if (view === 'register') { setView('exams'); setSelectedExam(''); }
                else if (view === 'tests') { setView('exams'); setSelectedExam(''); }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          )}

          {/* Exam Selection */}
          {view === 'exams' && <ExamSelector onSelectExam={handleSelectExam} />}

          {/* Registration Form - shown before accessing tests */}
          {view === 'register' && (
            <Card className="max-w-md mx-auto p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary mb-2">
                <UserCheck className="h-5 w-5" />
                <h3 className="font-semibold">Student Registration</h3>
              </div>

              <div className="space-y-2">
                <Label>Name *</Label>
                <Input placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input placeholder="10-digit mobile number" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} maxLength={10} />
              </div>

              <div className="space-y-2">
                <Label>City *</Label>
                <Input placeholder="Enter your city" value={city} onChange={e => setCity(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Class / Education Level *</Label>
                <Select value={educationLevel} onValueChange={setEducationLevel}>
                  <SelectTrigger><SelectValue placeholder="Select your level" /></SelectTrigger>
                  <SelectContent>
                    {educationLevels.map(level => (
                      <SelectItem key={level} value={level}>{level}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleRegister} className="w-full" size="lg">
                Continue to Mock Tests
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your information helps us provide better guidance
              </p>
            </Card>
          )}

          {/* Test List */}
          {view === 'tests' && (
            <div className="max-w-2xl mx-auto">
              {registered && (
                <div className="mb-4 p-3 bg-primary/5 rounded-xl flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4 text-primary" />
                  <span>Welcome, <strong>{name}</strong>! Select a test to begin.</span>
                </div>
              )}
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
