import { useState } from 'react';
import { Brain, BookOpen, Calculator, FlaskConical, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { QuizGame } from '@/components/quiz/QuizGame';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentInfo {
  name: string;
  mobile: string;
  classLevel: string;
  school: string;
}

const topics = [
  { id: 'reasoning', icon: Brain, color: 'bg-primary' },
  { id: 'history', icon: BookOpen, color: 'bg-secondary' },
  { id: 'maths', icon: Calculator, color: 'bg-accent' },
  { id: 'science', icon: FlaskConical, color: 'bg-success' },
  { id: 'gk', icon: Globe, color: 'bg-warning' },
];

const classes = ['6', '7', '8', '9', '10', '11', '12'];

const Practice = () => {
  const { t } = useLanguage();
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    classLevel: '',
    school: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.classLevel || !formData.school) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .insert({
          name: formData.name,
          mobile: formData.mobile,
          class: formData.classLevel,
          school: formData.school,
          source_page: 'Free Practice',
          interest_type: 'Quiz Started',
        })
        .select()
        .single();

      if (error) throw error;

      setLeadId(data.id);
      setStudentInfo({
        name: formData.name,
        mobile: formData.mobile,
        classLevel: formData.classLevel,
        school: formData.school,
      });
      toast.success(t('common.success'));
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleQuizEnd = () => {
    setSelectedTopic(null);
  };

  // Show quiz game if topic is selected
  if (selectedTopic && studentInfo && leadId) {
    return (
      <Layout hideFooter>
        <QuizGame
          topic={selectedTopic}
          classLevel={studentInfo.classLevel}
          leadId={leadId}
          onEnd={handleQuizEnd}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('practice.title')}</span>
            </h1>
            <p className="text-xl text-muted-foreground">{t('practice.subtitle')}</p>
          </div>

          {!studentInfo ? (
            /* Student Info Form */
            <Card className="max-w-md mx-auto animate-scale-in">
              <CardHeader>
                <CardTitle className="text-center">{t('practice.form.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('practice.form.name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile">{t('practice.form.mobile')}</Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class">{t('practice.form.class')}</Label>
                    <Select
                      value={formData.classLevel}
                      onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c} value={c}>
                            Class {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school">{t('practice.form.school')}</Label>
                    <Input
                      id="school"
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      placeholder="Enter school name"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-primary"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('common.loading') : t('practice.form.submit')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <p className="text-center text-sm text-muted-foreground">
                    {t('practice.form.note')}
                  </p>
                </form>
              </CardContent>
            </Card>
          ) : (
            /* Topic Selection */
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-lg mb-8">
                Welcome, <span className="font-semibold text-primary">{studentInfo.name}</span>! Choose a topic to practice:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer card-hover border-2 border-transparent hover:border-primary/30"
                    onClick={() => handleTopicSelect(topic.id)}
                  >
                    <CardContent className="p-8 text-center">
                      <div className={`w-20 h-20 ${topic.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        <topic.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold">{t(`topic.${topic.id}`)}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Practice;
