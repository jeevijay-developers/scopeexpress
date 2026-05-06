import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const MockTestManager = () => {
  const [tab, setTab] = useState('tests');
  const [tests, setTests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [newExamName, setNewExamName] = useState('');
  const [selectedTestId, setSelectedTestId] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);
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
    fetchExams();
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

  const fetchExams = async () => {
    const { data } = await supabase.from('exams').select('*').order('name');
    setExams(data || []);
  };

  const addExam = async () => {
    const name = newExamName.trim();
    if (!name) { toast.error('Enter exam name'); return; }
    const { error } = await supabase.from('exams').insert({ name });
    if (error) toast.error(error.message.includes('duplicate') ? 'Exam already exists' : 'Failed to add exam');
    else { toast.success('Exam added!'); setNewExamName(''); fetchExams(); }
  };

  const deleteExam = async (id: string) => {
    const { error } = await supabase.from('exams').delete().eq('id', id);
    if (error) toast.error('Failed to delete');
    else { toast.success('Deleted'); fetchExams(); }
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

  const downloadCsvTemplate = () => {
    const header = 'question_number,question,option_a,option_b,option_c,option_d,correct_answer';
    const sample1 = '1,What is the capital of India?,Mumbai,Delhi,Kolkata,Chennai,B';
    const sample2 = '2,"भारत का राष्ट्रीय पक्षी कौन सा है?","मोर","तोता","कबूतर","बाज",A';
    const csv = [header, sample1, sample2].join('\n');
    // Add UTF-8 BOM so Excel opens Hindi text correctly
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock_test_questions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTestId) return;
    
    setCsvUploading(true);
    try {
      // Read file as UTF-8 explicitly to preserve Hindi/Unicode text
      const buffer = await file.arrayBuffer();
      const decoder = new TextDecoder('utf-8');
      let text = decoder.decode(buffer);
      // Strip BOM if present
      if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      
      if (lines.length < 2) { toast.error('CSV file is empty or has no data rows'); return; }
      
      const header = lines[0].toLowerCase();
      if (!header.includes('question') || !header.includes('correct_answer')) {
        toast.error('Invalid CSV format. Please use the provided template.');
        return;
      }

      const answerMap: Record<string, number> = { 'A': 0, 'B': 1, 'C': 2, 'D': 3, '0': 0, '1': 1, '2': 2, '3': 3 };
      const questionsToInsert: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        // Parse CSV respecting quoted fields
        const cols = lines[i].match(/(".*?"|[^,]+)/g)?.map(c => c.replace(/^"|"$/g, '').trim()) || [];
        if (cols.length < 7) continue;

        const [qNum, question, optA, optB, optC, optD, correct] = cols;
        const correctIdx = answerMap[correct.toUpperCase()];
        
        if (correctIdx === undefined || !question) continue;

        questionsToInsert.push({
          mock_test_id: selectedTestId,
          question_number: parseInt(qNum) || (i),
          question,
          options: [optA, optB, optC, optD],
          correct_answer: correctIdx,
        });
      }

      if (questionsToInsert.length === 0) { toast.error('No valid questions found in CSV'); return; }

      // Insert in batches of 50
      for (let i = 0; i < questionsToInsert.length; i += 50) {
        const batch = questionsToInsert.slice(i, i + 50);
        const { error } = await supabase.from('mock_test_questions').insert(batch);
        if (error) throw error;
      }

      toast.success(`${questionsToInsert.length} questions uploaded successfully!`);
      fetchQuestions(selectedTestId);
    } catch (err: any) {
      toast.error('Upload failed: ' + (err.message || 'Unknown error'));
    } finally {
      setCsvUploading(false);
      if (csvInputRef.current) csvInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="tests">Manage Tests</TabsTrigger>
          <TabsTrigger value="exams">Exams</TabsTrigger>
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
                  <SelectContent>{exams.map(e => <SelectItem key={e.id} value={e.name}>{e.name}</SelectItem>)}</SelectContent>
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

        <TabsContent value="exams" className="space-y-4">
          <Card className="p-4 space-y-3">
            <h3 className="font-semibold">Add New Exam</h3>
            <div className="flex gap-2">
              <Input
                value={newExamName}
                onChange={e => setNewExamName(e.target.value)}
                placeholder="e.g. UPSC CSE"
                onKeyDown={e => { if (e.key === 'Enter') addExam(); }}
              />
              <Button onClick={addExam}><Plus className="h-4 w-4 mr-1" /> Add</Button>
            </div>
            <p className="text-xs text-muted-foreground">Newly added exams appear in the "Exam" dropdown when creating mock tests.</p>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map(e => (
                <TableRow key={e.id}>
                  <TableCell>{e.name}</TableCell>
                  <TableCell><Badge variant={e.is_active ? 'default' : 'secondary'}>{e.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="destructive" onClick={() => deleteExam(e.id)}>
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
              {/* CSV Bulk Upload */}
              <Card className="p-4 space-y-3 border-dashed border-2">
                <h3 className="font-semibold flex items-center gap-2"><Upload className="h-4 w-4" /> Bulk Upload via CSV</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a CSV file with columns: <code className="bg-muted px-1 rounded text-xs">question_number, question, option_a, option_b, option_c, option_d, correct_answer</code>. 
                  Correct answer should be A, B, C, or D.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" size="sm" onClick={downloadCsvTemplate}>
                    <Download className="h-4 w-4 mr-1" /> Download Template
                  </Button>
                  <div>
                    <input
                      ref={csvInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <Button size="sm" disabled={csvUploading} onClick={() => csvInputRef.current?.click()}>
                      <Upload className="h-4 w-4 mr-1" /> {csvUploading ? 'Uploading...' : 'Upload CSV'}
                    </Button>
                  </div>
                </div>
              </Card>

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
