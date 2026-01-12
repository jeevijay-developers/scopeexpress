import { useState } from 'react';
import { 
  Brain, BookOpen, Calculator, FlaskConical, Globe, ArrowRight, Gamepad2, 
  Star, Trophy, Zap, Target, Sparkles, Music, Award, CheckCircle,
  Users, Clock, Gift, Play, Heart, Flame, Timer, Crown, User, School,
  Phone, ChevronRight
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

interface StudentInfo {
  name: string;
  mobile: string;
  classLevel: string;
  school: string;
}

const topics = [
  { id: 'reasoning', icon: Brain, color: 'from-violet-500 to-purple-600', questions: 50, emoji: '🧠' },
  { id: 'history', icon: BookOpen, color: 'from-amber-500 to-orange-600', questions: 45, emoji: '📜' },
  { id: 'maths', icon: Calculator, color: 'from-blue-500 to-cyan-600', questions: 60, emoji: '🔢' },
  { id: 'science', icon: FlaskConical, color: 'from-green-500 to-emerald-600', questions: 55, emoji: '🔬' },
  { id: 'gk', icon: Globe, color: 'from-pink-500 to-rose-600', questions: 70, emoji: '🌍' },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.classLevel || !formData.school) {
      toast.error(language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const newLeadId = crypto.randomUUID();

      const { error } = await supabase
        .from('leads')
        .insert({
          id: newLeadId,
          name: formData.name,
          mobile: formData.mobile,
          class: formData.classLevel,
          school: formData.school,
          source_page: 'Free Practice',
          interest_type: 'Quiz Started',
        });

      if (error) throw error;

      setLeadId(newLeadId);
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
          studentName={studentInfo.name}
          leadId={leadId}
          onEnd={handleQuizEnd}
        />
      </Layout>
    );
  }

  // Show Quiz Dashboard after student info is submitted
  if (studentInfo && leadId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="relative container mx-auto px-4 py-8">
          {/* Player Welcome Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-6 py-3 rounded-full mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-purple-300 text-sm">{language === 'hi' ? 'वेलकम, प्लेयर!' : 'Welcome, Player!'}</p>
                <p className="text-white text-2xl font-bold">{studentInfo.name}</p>
              </div>
              <div className="ml-4 pl-4 border-l border-purple-500/30 text-left">
                <p className="text-purple-300 text-sm">{language === 'hi' ? 'कक्षा' : 'Class'}</p>
                <p className="text-white text-lg font-bold">{studentInfo.classLevel}</p>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                {language === 'hi' ? '🎮 टॉपिक चुनें' : '🎮 Choose Your Topic'}
              </span>
            </h1>
            <p className="text-purple-200 text-lg">
              {language === 'hi' 
                ? 'किसी भी टॉपिक पर क्लिक करें और क्विज़ शुरू करें!'
                : 'Click on any topic and start the quiz!'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {[
              { icon: Heart, label: language === 'hi' ? '3 लाइव्स' : '3 Lives', color: 'text-red-400', bg: 'bg-red-500/20' },
              { icon: Timer, label: language === 'hi' ? '30 सेकंड/प्रश्न' : '30 Sec/Question', color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
              { icon: Flame, label: language === 'hi' ? 'स्ट्रीक बोनस' : 'Streak Bonus', color: 'text-orange-400', bg: 'bg-orange-500/20' },
              { icon: Crown, label: language === 'hi' ? 'चैंपियन बनो!' : 'Become Champion!', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
            ].map((stat, i) => (
              <div key={i} className={`flex items-center gap-2 ${stat.bg} px-4 py-2 rounded-full border border-white/10`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-white text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Topic Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
            {topics.map((topic, i) => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className="group animate-fade-in"
                style={{ animationDelay: `${0.2 + i * 0.1}s` }}
              >
                <Card className="h-full bg-slate-800/50 border-2 border-transparent hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden group-hover:scale-105">
                  <CardContent className="p-0">
                    {/* Header with Gradient */}
                    <div className={`bg-gradient-to-r ${topic.color} p-6 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute -right-6 -top-6 text-8xl opacity-20 group-hover:scale-125 transition-transform duration-500">
                        {topic.emoji}
                      </div>
                      <div className="relative">
                        <topic.icon className="h-12 w-12 text-white mb-3 group-hover:scale-110 transition-transform" />
                        <h3 className="text-2xl font-bold text-white">
                          {t(`practice.topics.${topic.id}`)}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-purple-300 text-sm">
                          {language === 'hi' ? 'प्रश्नों की संख्या' : 'Questions'}
                        </span>
                        <span className="text-white font-bold">{topic.questions}+</span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-purple-300 text-sm">
                          {language === 'hi' ? 'डिफिकल्टी' : 'Difficulty'}
                        </span>
                        <div className="flex gap-1">
                          {[1, 2, 3].map((star) => (
                            <Star key={star} className={`h-4 w-4 ${star <= 2 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>

                      <Button className={`w-full bg-gradient-to-r ${topic.color} hover:opacity-90 text-lg py-6 group`}>
                        <Play className="mr-2 h-5 w-5 group-hover:scale-125 transition-transform" />
                        {language === 'hi' ? 'खेलें' : 'PLAY'}
                        <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {/* Levels Preview */}
          <div className="max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h2 className="text-xl font-bold text-white text-center mb-6">
              {language === 'hi' ? '🏆 4 लेवल्स - बिगिनर से चैंपियन तक!' : '🏆 4 Levels - From Beginner to Champion!'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: language === 'hi' ? 'बिगिनर' : 'Beginner', points: '0-24', color: 'from-gray-500 to-slate-600', icon: Star },
                { name: language === 'hi' ? 'लर्नर' : 'Learner', points: '25-49', color: 'from-blue-500 to-cyan-600', icon: Target },
                { name: language === 'hi' ? 'परफॉर्मर' : 'Performer', points: '50-79', color: 'from-purple-500 to-pink-600', icon: Zap },
                { name: language === 'hi' ? 'चैंपियन' : 'Champion', points: '80+', color: 'from-yellow-500 to-orange-600', icon: Trophy },
              ].map((level, i) => (
                <div key={i} className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                    <level.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-white font-bold">{level.name}</p>
                  <p className="text-purple-300 text-xs">{level.points} pts</p>
                </div>
              ))}
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mt-10">
            <Button
              variant="ghost"
              className="text-purple-300 hover:text-white"
              onClick={() => {
                setStudentInfo(null);
                setLeadId(null);
              }}
            >
              {language === 'hi' ? '← दूसरे अकाउंट से खेलें' : '← Play with different account'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show Registration Form
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 py-16 md:py-24">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Info */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Gift className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm font-bold">
                  {language === 'hi' ? '🎮 100% FREE - कोई लॉगिन नहीं!' : '🎮 100% FREE - No Login Required!'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  {language === 'hi' ? 'खेलो. सीखो. जीतो!' : 'PLAY. LEARN. WIN!'}
                </span>
              </h1>
              
              <p className="text-purple-200 text-lg mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {language === 'hi' 
                  ? 'अपनी class के हिसाब से 5 topics में practice करें। Points कमाएं, levels unlock करें और Champion बनें!'
                  : 'Practice in 5 topics based on your class. Earn points, unlock levels and become a Champion!'}
              </p>

              {/* Feature Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                {[
                  { icon: Heart, text: language === 'hi' ? '3 लाइव्स' : '3 Lives', color: 'text-red-400' },
                  { icon: Timer, text: language === 'hi' ? '30 सेकंड टाइमर' : '30 Sec Timer', color: 'text-cyan-400' },
                  { icon: Flame, text: language === 'hi' ? 'स्ट्रीक बोनस' : 'Streak Bonus', color: 'text-orange-400' },
                  { icon: Trophy, text: language === 'hi' ? '4 लेवल्स' : '4 Levels', color: 'text-yellow-400' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex justify-center lg:justify-start gap-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="text-center">
                  <p className="text-4xl font-bold text-cyan-400">280+</p>
                  <p className="text-purple-300 text-sm">{language === 'hi' ? 'प्रश्न' : 'Questions'}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-pink-400">5</p>
                  <p className="text-purple-300 text-sm">{language === 'hi' ? 'विषय' : 'Topics'}</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-green-400">7</p>
                  <p className="text-purple-300 text-sm">{language === 'hi' ? 'कक्षाएं' : 'Classes'}</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card className="bg-slate-800/80 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-xl">
                <CardHeader className="text-center pb-2">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
                    <Gamepad2 className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">
                    {language === 'hi' ? '🚀 शुरू करें!' : '🚀 Get Started!'}
                  </CardTitle>
                  <p className="text-purple-300 mt-2">
                    {language === 'hi' ? 'बस 4 details और quiz शुरू!' : 'Just 4 details and start the quiz!'}
                  </p>
                </CardHeader>
                <CardContent className="pt-4">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-purple-200 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {language === 'hi' ? 'आपका नाम' : 'Your Name'} *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                        className="h-14 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                        required
                      />
                    </div>

                    {/* Mobile Field */}
                    <div className="space-y-2">
                      <Label htmlFor="mobile" className="text-purple-200 flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="10 digit mobile number"
                        className="h-14 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                        required
                      />
                    </div>

                    {/* Class & School Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-purple-200 flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          {language === 'hi' ? 'कक्षा' : 'Class'} *
                        </Label>
                        <Select
                          value={formData.classLevel}
                          onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                        >
                          <SelectTrigger className="h-14 bg-slate-700/50 border-purple-500/30 text-white">
                            <SelectValue placeholder={language === 'hi' ? 'चुनें' : 'Select'} />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-purple-500/30">
                            {classes.map((c) => (
                              <SelectItem key={c} value={c} className="text-white hover:bg-purple-500/20">
                                {language === 'hi' ? `कक्षा ${c}` : `Class ${c}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school" className="text-purple-200 flex items-center gap-2">
                          <School className="h-4 w-4" />
                          {language === 'hi' ? 'स्कूल' : 'School'} *
                        </Label>
                        <Input
                          id="school"
                          value={formData.school}
                          onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                          placeholder={language === 'hi' ? 'स्कूल का नाम' : 'School name'}
                          className="h-14 bg-slate-700/50 border-purple-500/30 text-white placeholder:text-purple-300/50 focus:border-purple-400"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full h-16 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-500 hover:via-pink-500 hover:to-purple-500 text-xl font-bold shadow-lg shadow-purple-500/30"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {language === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-6 w-6" />
                          {language === 'hi' ? 'गेम शुरू करें!' : 'START GAME!'}
                          <ArrowRight className="ml-2 h-6 w-6" />
                        </>
                      )}
                    </Button>

                    {/* Trust Badge */}
                    <div className="flex items-center justify-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>{language === 'hi' ? '100% मुफ्त' : '100% Free'}</span>
                      </div>
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>{language === 'hi' ? 'तुरंत शुरू' : 'Instant Start'}</span>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Topics Preview */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-10">
            {language === 'hi' ? '🎯 5 टॉपिक्स में Practice करें' : '🎯 Practice in 5 Topics'}
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {topics.map((topic, i) => (
              <div 
                key={topic.id}
                className={`flex items-center gap-3 bg-gradient-to-r ${topic.color} px-6 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-transform`}
              >
                <span className="text-3xl">{topic.emoji}</span>
                <div>
                  <p className="text-white font-bold text-lg">{t(`practice.topics.${topic.id}`)}</p>
                  <p className="text-white/70 text-sm">{topic.questions}+ questions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-purple-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            {language === 'hi' ? '🎮 कैसे खेलें?' : '🎮 How to Play?'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: language === 'hi' ? 'जानकारी दें' : 'Enter Details', desc: language === 'hi' ? 'ऊपर फॉर्म भरें' : 'Fill the form above', icon: User },
              { step: '2', title: language === 'hi' ? 'Topic चुनें' : 'Choose Topic', desc: language === 'hi' ? '5 में से कोई एक' : 'Pick any of 5', icon: BookOpen },
              { step: '3', title: language === 'hi' ? 'Quiz खेलें' : 'Play Quiz', desc: language === 'hi' ? 'Points कमाएं' : 'Earn points', icon: Gamepad2 },
              { step: '4', title: language === 'hi' ? 'Champion बनें' : 'Become Champion', desc: language === 'hi' ? '80+ points पर' : 'At 80+ points', icon: Trophy },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                  {item.step}
                </div>
                <Card className="bg-slate-800/50 border-purple-500/20 pt-8">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-7 w-7 text-purple-400" />
                    </div>
                    <h3 className="text-white font-bold mb-2">{item.title}</h3>
                    <p className="text-purple-300 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Practice;
