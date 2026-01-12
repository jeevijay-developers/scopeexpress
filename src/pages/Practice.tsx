import { useState } from 'react';
import { 
  Brain, BookOpen, Calculator, FlaskConical, Globe, ArrowRight, Gamepad2, 
  Star, Trophy, Zap, Target, Sparkles, Music, Award, CheckCircle,
  Users, Clock, Gift
} from 'lucide-react';
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
import quizFun from '@/assets/quiz-fun.jpg';
import studentSuccess from '@/assets/student-success.jpg';

interface StudentInfo {
  name: string;
  mobile: string;
  classLevel: string;
  school: string;
}

const topics = [
  { id: 'reasoning', icon: Brain, color: 'bg-primary', questions: 50 },
  { id: 'history', icon: BookOpen, color: 'bg-secondary', questions: 45 },
  { id: 'maths', icon: Calculator, color: 'bg-accent', questions: 60 },
  { id: 'science', icon: FlaskConical, color: 'bg-success', questions: 55 },
  { id: 'gk', icon: Globe, color: 'bg-warning', questions: 70 },
];

const classes = ['6', '7', '8', '9', '10', '11', '12'];

const Practice = () => {
  const { t, language } = useLanguage();
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

  const features = [
    { icon: Gift, text: language === 'hi' ? '100% मुफ्त' : '100% Free', color: 'text-success' },
    { icon: Zap, text: language === 'hi' ? 'तुरंत शुरू' : 'Instant Start', color: 'text-warning' },
    { icon: Trophy, text: language === 'hi' ? '4 लेवल्स' : '4 Levels', color: 'text-primary' },
    { icon: Music, text: language === 'hi' ? 'साउंड इफेक्ट्स' : 'Sound Effects', color: 'text-accent' },
  ];

  const levels = [
    { name: language === 'hi' ? 'बिगिनर' : 'Beginner', points: '0-24', icon: Star, color: 'bg-muted' },
    { name: language === 'hi' ? 'लर्नर' : 'Learner', points: '25-49', icon: Target, color: 'bg-primary' },
    { name: language === 'hi' ? 'परफॉर्मर' : 'Performer', points: '50-79', icon: Zap, color: 'bg-secondary' },
    { name: language === 'hi' ? 'चैंपियन' : 'Champion', points: '80+', icon: Trophy, color: 'bg-warning' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.classLevel || !formData.school) {
      toast.error(language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields');
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
    } catch (err: unknown) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? String((err as any).message)
          : String(err);

      console.error('Error submitting form:', err);
      toast.error(
        language === 'hi'
          ? `सबमिट नहीं हुआ: ${message}`
          : `Submit failed: ${message}`
      );
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
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-12 md:py-16">
        {/* Animated Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-warning/30 rounded-full blur-xl animate-bounce-slow"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Gift className="h-4 w-4" />
                <span className="text-sm font-bold">
                  {language === 'hi' ? '🎮 100% FREE - कोई लॉगिन नहीं!' : '🎮 100% FREE - No Login Required!'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient">{t('practice.title')}</span>
              </h1>
              
              <p className="text-2xl font-medium text-foreground mb-4 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {t('practice.subtitle')} 🚀
              </p>
              
              <p className="text-muted-foreground mb-6 text-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {language === 'hi' 
                  ? 'अपनी class के हिसाब से 5 topics में practice करें। Points कमाएं, levels unlock करें, sounds सुनें और Champion बनें!'
                  : 'Practice in 5 topics based on your class. Earn points, unlock levels, hear sounds and become a Champion!'}
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-8 animate-fade-in" style={{ animationDelay: '0.25s' }}>
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
                    <feature.icon className={`h-4 w-4 ${feature.color}`} />
                    <span className="text-sm font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <p className="text-3xl font-bold text-primary">280+</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'प्रश्न' : 'Questions'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <p className="text-3xl font-bold text-accent">5</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'विषय' : 'Topics'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <p className="text-3xl font-bold text-success">7</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'कक्षाएं' : 'Classes'}</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img 
                src={quizFun} 
                alt="Students playing quiz" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-warning text-warning-foreground px-4 py-2 rounded-2xl shadow-lg animate-bounce-slow">
                <p className="font-bold">🏆 Champion!</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-success text-success-foreground px-4 py-2 rounded-2xl shadow-lg animate-float">
                <p className="font-bold">+10 Points!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'hi' ? '🎯 कैसे काम करता है?' : '🎯 How It Works?'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: language === 'hi' ? 'जानकारी दें' : 'Enter Info', desc: language === 'hi' ? 'अपना नाम, मोबाइल, class दर्ज करें' : 'Enter your name, mobile, class', icon: Users },
              { step: '2', title: language === 'hi' ? 'Topic चुनें' : 'Choose Topic', desc: language === 'hi' ? '5 topics में से कोई एक चुनें' : 'Choose any one from 5 topics', icon: BookOpen },
              { step: '3', title: language === 'hi' ? 'Quiz खेलें' : 'Play Quiz', desc: language === 'hi' ? 'सवालों के जवाब दें, points कमाएं' : 'Answer questions, earn points', icon: Gamepad2 },
              { step: '4', title: language === 'hi' ? 'Level Up करें' : 'Level Up', desc: language === 'hi' ? 'Champion बनें और celebrate करें!' : 'Become Champion and celebrate!', icon: Trophy },
            ].map((item, i) => (
              <Card key={i} className="text-center card-hover relative overflow-hidden">
                <div className="absolute top-2 left-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <CardContent className="p-6 pt-10">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Levels Explanation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'hi' ? '🔥 4 Levels - Beginner से Champion तक!' : '🔥 4 Levels - From Beginner to Champion!'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {levels.map((level, i) => (
              <Card key={i} className={`text-center card-hover ${i === 3 ? 'ring-2 ring-warning' : ''}`}>
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${level.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <level.icon className={`h-7 w-7 ${i === 3 ? 'text-warning-foreground' : 'text-white'}`} />
                  </div>
                  <p className="font-bold">{level.name}</p>
                  <p className="text-xs text-muted-foreground">{level.points} points</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          {!studentInfo ? (
            /* Student Info Form */
            <div className="max-w-lg mx-auto">
              <Card className="animate-scale-in shadow-2xl">
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{t('practice.form.title')}</CardTitle>
                  <p className="text-muted-foreground mt-2">
                    {language === 'hi' ? 'बस 4 details और शुरू करें practice!' : 'Just 4 details and start practicing!'}
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('practice.form.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile">{t('practice.form.mobile')} *</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder={language === 'hi' ? 'मोबाइल नंबर' : 'Mobile number'}
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="class">{t('practice.form.class')} *</Label>
                      <Select
                        value={formData.classLevel}
                        onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder={language === 'hi' ? 'कक्षा चुनें' : 'Select class'} />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((c) => (
                            <SelectItem key={c} value={c}>
                              {language === 'hi' ? `कक्षा ${c}` : `Class ${c}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="school">{t('practice.form.school')} *</Label>
                      <Input
                        id="school"
                        value={formData.school}
                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                        placeholder={language === 'hi' ? 'स्कूल का नाम' : 'School name'}
                        className="h-12"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gradient-primary text-lg font-semibold"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t('common.loading') : (
                        <>
                          {t('practice.form.submit')} 🚀
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success" />
                      {t('practice.form.note')}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Topic Selection */
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">
                    {language === 'hi' ? 'स्वागत है' : 'Welcome'}, {studentInfo.name}! 🎉
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  {language === 'hi' ? '🎯 अपना Topic चुनें' : '🎯 Choose Your Topic'}
                </h2>
                <p className="text-muted-foreground">
                  {language === 'hi' 
                    ? `Class ${studentInfo.classLevel} के लिए questions तैयार हैं!`
                    : `Questions ready for Class ${studentInfo.classLevel}!`}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic, i) => (
                  <Card
                    key={topic.id}
                    className="cursor-pointer card-hover border-2 border-transparent hover:border-primary/30 animate-fade-in overflow-hidden"
                    style={{ animationDelay: `${i * 0.1}s` }}
                    onClick={() => handleTopicSelect(topic.id)}
                  >
                    <CardContent className="p-8 text-center relative">
                      <div className="absolute top-2 right-2 bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                        {topic.questions}+ Qs
                      </div>
                      <div className={`w-20 h-20 ${topic.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <topic.icon className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{t(`topic.${topic.id}`)}</h3>
                      <Button className="mt-2 w-full" variant="outline">
                        {language === 'hi' ? 'खेलें' : 'Play'} →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Success Banner */}
      <section className="py-12 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={studentSuccess} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'hi' ? '🏆 Champion बनने का मौका!' : '🏆 Chance to Become Champion!'}
          </h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'हर सही जवाब पर +10 points मिलते हैं। 80+ points पर आप Champion बन जाते हैं! Sound effects के साथ practice करें और मज़े लें!'
              : 'Get +10 points for every correct answer. Score 80+ points to become a Champion! Practice with sound effects and have fun!'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <p className="text-2xl font-bold">🎵</p>
              <p className="text-sm">{language === 'hi' ? 'सही जवाब पर Happy Sound' : 'Happy Sound on Correct'}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <p className="text-2xl font-bold">🔔</p>
              <p className="text-sm">{language === 'hi' ? 'गलत जवाब पर Soft Sound' : 'Soft Sound on Wrong'}</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
              <p className="text-2xl font-bold">🎺</p>
              <p className="text-sm">{language === 'hi' ? 'Level Up पर Fanfare' : 'Fanfare on Level Up'}</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Practice;
