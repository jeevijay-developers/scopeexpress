import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const examNames = [
  'SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD Constable',
  'Army GD', 'Army Clerk', 'Navy AA/SSR', 'Air Force X/Y Group',
  'MPPSC', 'UPPSC', 'Railway Group D', 'Railway NTPC',
  'Patwari', 'Police Constable', 'Bank PO/Clerk', 'CTET/TET',
];

const MockTestManager = () => {
  const [tab, setTab] = useState('tests');
  const [tests, setTests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [examName, setExamName] = useState('');
  const [testName, setTestName] = useState('');
  const [duration, setDuration] = useState('60');
  const [totalQ, setTotalQ] = useState('100');

  // Question form
  const [qText, setQText] = useState('');
  const [qOptions, setQOptions] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState('0');
  const [qNumber, setQNumber] = useState('1');

  useEffect(() => {
    fetchTests();
    fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedTestId) fetchQuestions(selectedTestId);
  }, [selectedTestId]);

  const fetchTests = async () => {
    const { data } = await supabase.from('mock_tests').select('*').order('created_at', { ascending: false });
    setTests(data || []);
  };

  const fetchSessions = async () => {
    const { data } = await supabase.from('mock_test_sessions').select('*').order('created_at', { ascending: false });
    setSessions(data || []);
  };

  const fetchQuestions = async (testId: string) => {
    const { data } = await supabase.from('mock_test_questions').select('*').eq('mock_test_id', testId).order('question_number');
    setQuestions(data || []);
  };

  const addTest = async () => {
    if (!examName || !testName) { toast.error('Fill all fields'); return; }
    setLoading(true);
    const { error } = await supabase.from('mock_tests').insert({
      exam_name: examName,
      test_name: testName,
      duration_minutes: parseInt(duration),
      total_questions: parseInt(totalQ),
    });
    if (error) toast.error('Failed to add test');
    else { toast.success('Test added!'); setTestName(''); fetchTests(); }
    setLoading(false);
  };

  const deleteTest = async (id: string) => {
    await supabase.from('mock_tests').delete().eq('id', id);
    toast.success('Deleted');
    fetchTests();
  };

  const addQuestion = async () => {
    if (!selectedTestId || !qText || qOptions.some(o => !o.trim())) { toast.error('Fill all fields'); return; }
    setLoading(true);
    const { error } = await supabase.from('mock_test_questions').insert({
      mock_test_id: selectedTestId,
      question: qText,
      options: qOptions,
      correct_answer: parseInt(qCorrect),
      question_number: parseInt(qNumber),
    });
    if (error) toast.error('Failed');
    else {
      toast.success('Question added!');
      setQText('');
      setQOptions(['', '', '', '']);
      setQNumber(String(parseInt(qNumber) + 1));
      fetchQuestions(selectedTestId);
    }
    setLoading(false);
  };

  const deleteQuestion = async (id: string) => {
    await supabase.from('mock_test_questions').delete().eq('id', id);
    toast.success('Deleted');
    fetchQuestions(selectedTestId);
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="tests">Manage Tests</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Add Mock Test</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Exam</Label>
                <Select value={examName} onValueChange={setExamName}>
                  <SelectTrigger><SelectValue placeholder="Select Exam" /></SelectTrigger>
                  <SelectContent>{examNames.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Test Name</Label><Input value={testName} onChange={e => setTestName(e.target.value)} placeholder="Mock Test 1" /></div>
              <div><Label>Duration (min)</Label><Input type="number" value={duration} onChange={e => setDuration(e.target.value)} /></div>
              <div><Label>Total Questions</Label><Input type="number" value={totalQ} onChange={e => setTotalQ(e.target.value)} /></div>
            </div>
            <Button onClick={addTest} disabled={loading}><Plus className="h-4 w-4 mr-1" /> Add Test</Button>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.map(t => (
                <TableRow key={t.id}>
                  <TableCell><Badge variant="secondary">{t.exam_name}</Badge></TableCell>
                  <TableCell>{t.test_name}</TableCell>
                  <TableCell>{t.duration_minutes} min</TableCell>
                  <TableCell>{t.total_questions}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setSelectedTestId(t.id); setTab('questions'); }}>
                      <Edit className="h-3 w-3 mr-1" /> Questions
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => deleteTest(t.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Label>Select Test:</Label>
            <Select value={selectedTestId} onValueChange={setSelectedTestId}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Choose a test" /></SelectTrigger>
              <SelectContent>{tests.map(t => <SelectItem key={t.id} value={t.id}>{t.exam_name} - {t.test_name}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {selectedTestId && (
            <>
              <Card className="p-4 space-y-3">
                <h3 className="font-semibold">Add Question</h3>
                <div><Label>Question #{qNumber}</Label><Textarea value={qText} onChange={e => setQText(e.target.value)} placeholder="Enter question" /></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {qOptions.map((opt, i) => (
                    <div key={i}>
                      <Label>Option {String.fromCharCode(65 + i)}</Label>
                      <Input value={opt} onChange={e => { const n = [...qOptions]; n[i] = e.target.value; setQOptions(n); }} />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <div>
                    <Label>Correct Answer</Label>
                    <Select value={qCorrect} onValueChange={setQCorrect}>
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">A</SelectItem>
                        <SelectItem value="1">B</SelectItem>
                        <SelectItem value="2">C</SelectItem>
                        <SelectItem value="3">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addQuestion} disabled={loading}><Plus className="h-4 w-4 mr-1" /> Add Question</Button>
              </Card>

              <p className="text-sm text-muted-foreground">{questions.length} questions added</p>
              <Table>
                <TableHeader><TableRow><TableHead>#</TableHead><TableHead>Question</TableHead><TableHead>Answer</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {questions.map(q => (
                    <TableRow key={q.id}>
                      <TableCell>{q.question_number}</TableCell>
                      <TableCell className="max-w-xs truncate">{q.question}</TableCell>
                      <TableCell>{String.fromCharCode(65 + q.correct_answer)}</TableCell>
                      <TableCell><Button size="sm" variant="destructive" onClick={() => deleteQuestion(q.id)}><Trash2 className="h-3 w-3" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </TabsContent>

        <TabsContent value="results">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Attempted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.mobile}</TableCell>
                  <TableCell>{s.score}</TableCell>
                  <TableCell>{s.total_attempted}</TableCell>
                  <TableCell><Badge variant={s.completed ? 'default' : 'secondary'}>{s.completed ? 'Completed' : 'In Progress'}</Badge></TableCell>
                  <TableCell>{new Date(s.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MockTestManager;
