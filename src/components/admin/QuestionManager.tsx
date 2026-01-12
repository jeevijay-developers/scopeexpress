import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Save, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  topic: string;
  class_level: string;
  language: string;
  created_at: string;
}

const TOPICS = ['maths', 'science', 'gk', 'reasoning', 'history'];
const CLASS_LEVELS = ['6', '7', '8', '9', '10', '11', '12'];
const LANGUAGES = ['en', 'hi'];

const QuestionManager = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [languageFilter, setLanguageFilter] = useState('all');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);
  
  // Form state
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptions, setFormOptions] = useState(['', '', '', '']);
  const [formCorrectAnswer, setFormCorrectAnswer] = useState(0);
  const [formTopic, setFormTopic] = useState('maths');
  const [formClassLevel, setFormClassLevel] = useState('6');
  const [formLanguage, setFormLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setQuestions(
        (data || []).map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options as string[] : [],
        }))
      );
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuestions = useMemo(() => {
    let filtered = [...questions];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(query)
      );
    }

    if (topicFilter !== 'all') {
      filtered = filtered.filter(q => q.topic === topicFilter);
    }

    if (classFilter !== 'all') {
      filtered = filtered.filter(q => q.class_level === classFilter);
    }

    if (languageFilter !== 'all') {
      filtered = filtered.filter(q => q.language === languageFilter);
    }

    return filtered;
  }, [questions, searchQuery, topicFilter, classFilter, languageFilter]);

  const resetForm = () => {
    setFormQuestion('');
    setFormOptions(['', '', '', '']);
    setFormCorrectAnswer(0);
    setFormTopic('maths');
    setFormClassLevel('6');
    setFormLanguage('en');
    setEditingQuestion(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (question: QuizQuestion) => {
    setEditingQuestion(question);
    setFormQuestion(question.question);
    setFormOptions([...question.options]);
    setFormCorrectAnswer(question.correct_answer);
    setFormTopic(question.topic);
    setFormClassLevel(question.class_level);
    setFormLanguage(question.language);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formQuestion.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (formOptions.some(o => !o.trim())) {
      toast.error('Please fill all 4 options');
      return;
    }

    setIsSaving(true);

    try {
      const questionData = {
        question: formQuestion.trim(),
        options: formOptions.map(o => o.trim()) as unknown as Json,
        correct_answer: formCorrectAnswer,
        topic: formTopic,
        class_level: formClassLevel,
        language: formLanguage,
      };

      if (editingQuestion) {
        const { error } = await supabase
          .from('quiz_questions')
          .update(questionData)
          .eq('id', editingQuestion.id);

        if (error) throw error;
        toast.success('Question updated!');
      } else {
        const { error } = await supabase
          .from('quiz_questions')
          .insert(questionData);

        if (error) throw error;
        toast.success('Question added!');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Question deleted!');
      fetchQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Question Bank
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openAddDialog} className="bg-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? 'Edit Question' : 'Add New Question'}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Topic</Label>
                      <Select value={formTopic} onValueChange={setFormTopic}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TOPICS.map(t => (
                            <SelectItem key={t} value={t}>
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Select value={formClassLevel} onValueChange={setFormClassLevel}>
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
                    <div>
                      <Label>Language</Label>
                      <Select value={formLanguage} onValueChange={setFormLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Question</Label>
                    <Textarea
                      value={formQuestion}
                      onChange={(e) => setFormQuestion(e.target.value)}
                      placeholder="Enter the question..."
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label>Options (Select the correct answer)</Label>
                    <RadioGroup 
                      value={formCorrectAnswer.toString()} 
                      onValueChange={(v) => setFormCorrectAnswer(parseInt(v))}
                      className="mt-2 space-y-2"
                    >
                      {formOptions.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...formOptions];
                              newOptions[index] = e.target.value;
                              setFormOptions(newOptions);
                            }}
                            placeholder={`Option ${index + 1}`}
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Question'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={topicFilter} onValueChange={setTopicFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {TOPICS.map(t => (
                  <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {CLASS_LEVELS.map(c => (
                  <SelectItem key={c} value={c}>Class {c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Questions ({filteredQuestions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading questions...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No questions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Question</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Correct Answer</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.slice(0, 50).map((question) => (
                    <TableRow key={question.id}>
                      <TableCell className="font-medium">
                        <p className="line-clamp-2">{question.question}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {question.topic.charAt(0).toUpperCase() + question.topic.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>Class {question.class_level}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {question.language === 'en' ? 'English' : 'हिंदी'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {question.options[question.correct_answer]}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(question)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {filteredQuestions.length > 50 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Showing 50 of {filteredQuestions.length} questions. Use filters to narrow down.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionManager;
