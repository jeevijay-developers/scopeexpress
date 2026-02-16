import { Link } from 'react-router-dom';
import { 
  BookOpen, GraduationCap, Gamepad2, ShoppingBag, ArrowRight, Star, Users, Trophy, 
  CheckCircle, Sparkles, Target, Zap, Clock, Award, TrendingUp, Heart,
  Brain, Calculator, Globe, FlaskConical, Play, Flame, Shield, Timer, Crown,
  Rocket, Medal, PartyPopper, Gift, ExternalLink, Pencil, Package, Tag, Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import heroStudents from '@/assets/hero-students.jpg';
import studentSuccess from '@/assets/student-success.jpg';
import libraryInterior from '@/assets/library-interior.jpg';
import medineeKumar from '@/assets/medinee-kumar.png';
import quizFun from '@/assets/quiz-fun.jpg';

const STORE_URL = "https://bizgrow360.com/s/scope-express-7c1ce756-c92e-4548-bd75-b6f85f9ced4e";

const Index = () => {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: t('features.library.title'),
      desc: t('features.library.desc'),
      link: '/library',
      color: 'bg-primary',
      highlight: '₹600/month',
    },
    {
      icon: GraduationCap,
      title: t('features.career.title'),
      desc: t('features.career.desc'),
      link: '/career',
      color: 'bg-secondary',
      highlight: 'Free Guidance',
    },
    {
      icon: Gamepad2,
      title: t('features.practice.title'),
      desc: t('features.practice.desc'),
      link: '/practice',
      color: 'bg-accent',
      highlight: '100% Free',
    },
    {
      icon: ShoppingBag,
      title: t('features.stationery.title'),
      desc: t('features.stationery.desc'),
      link: '/stationery',
      color: 'bg-success',
      highlight: 'Best Prices',
    },
  ];

  const stats = [
    { icon: Users, value: '500+', label: language === 'hi' ? 'छात्रों की मदद' : 'Students Helped' },
    { icon: Trophy, value: '95%', label: language === 'hi' ? 'सफलता दर' : 'Success Rate' },
    { icon: Star, value: '4.9', label: language === 'hi' ? 'रेटिंग' : 'Rating' },
    { icon: Award, value: '5+', label: language === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience' },
  ];

  const benefits = [
    { icon: CheckCircle, text: language === 'hi' ? 'इंजीनियर मेंटर' : 'Engineer Mentor' },
    { icon: CheckCircle, text: language === 'hi' ? 'व्यक्तिगत ध्यान' : 'Personal Attention' },
    { icon: CheckCircle, text: language === 'hi' ? 'गुणवत्तापूर्ण मार्गदर्शन' : 'Quality Guidance' },
    { icon: CheckCircle, text: language === 'hi' ? 'सफलता गारंटी' : 'Success Guarantee' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      class: 'Class 12',
      text: language === 'hi' 
        ? 'Scope Express ने मेरी पढ़ाई को बदल दिया। अब मैं JEE की तैयारी में confident हूं!'
        : 'Scope Express transformed my studies. Now I am confident in my JEE preparation!',
      rating: 5,
    },
    {
      name: 'Rahul Verma',
      class: 'Class 10',
      text: language === 'hi'
        ? 'Library का माहौल बहुत अच्छा है। पढ़ाई में मन लगता है।'
        : 'The library environment is excellent. I can focus on my studies.',
      rating: 5,
    },
    {
      name: 'Sneha Patel',
      class: 'Class 11',
      text: language === 'hi'
        ? 'Medinee Sir की guidance से career clear हो गया।'
        : 'Medinee Sir\'s guidance made my career path clear.',
      rating: 5,
    },
  ];

  const quizTopics = [
    { icon: Brain, name: language === 'hi' ? 'रीज़निंग' : 'Reasoning', color: 'bg-primary' },
    { icon: Calculator, name: language === 'hi' ? 'गणित' : 'Maths', color: 'bg-accent' },
    { icon: FlaskConical, name: language === 'hi' ? 'विज्ञान' : 'Science', color: 'bg-success' },
    { icon: Globe, name: language === 'hi' ? 'सामान्य ज्ञान' : 'GK', color: 'bg-warning' },
    { icon: BookOpen, name: language === 'hi' ? 'इतिहास' : 'History', color: 'bg-secondary' },
  ];

  const quizFeatures = [
    { icon: Flame, text: language === 'hi' ? 'स्ट्रीक बोनस' : 'Streak Bonus', color: 'text-orange-500' },
    { icon: Timer, text: language === 'hi' ? '30 सेकंड टाइमर' : '30 Sec Timer', color: 'text-blue-500' },
    { icon: Heart, text: language === 'hi' ? '3 लाइव्स' : '3 Lives', color: 'text-red-500' },
    { icon: Crown, text: language === 'hi' ? 'चैंपियन बनो' : 'Become Champion', color: 'text-yellow-500' },
  ];

  return (
    <Layout>
      {/* Hero Section with Image */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 md:py-20">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-bounce-slow"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'hi' ? '#1 स्टूडेंट हब' : '#1 Student Hub'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient">{t('hero.title')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 group">
                  <Link to="/library">
                    {t('hero.library.btn')}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2 group">
                  <Link to="/practice">
                    {t('hero.practice.btn')}
                    <Gamepad2 className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-2 gap-3 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <benefit.icon className="h-4 w-4 text-success" />
                    <span>{benefit.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={heroStudents} 
                  alt="Students studying" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl border animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-xs text-muted-foreground">
                      {language === 'hi' ? 'सफलता दर' : 'Success Rate'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg animate-bounce-slow">
                <span className="text-sm font-semibold">🎯 100% Free Practice</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="glass-card p-6 rounded-2xl text-center card-hover animate-fade-in"
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARCADE QUIZ MOCKUP SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-yellow-500/10 rounded-full blur-3xl animate-bounce-slow"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-yellow-500 text-white px-6 py-2 rounded-full mb-6 animate-bounce-slow">
              <Gamepad2 className="h-5 w-5" />
              <span className="font-bold text-sm">{language === 'hi' ? '🎮 आर्केड क्विज़ ज़ोन' : '🎮 ARCADE QUIZ ZONE'}</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400">
                {language === 'hi' ? 'खेलो. सीखो. जीतो!' : 'PLAY. LEARN. WIN!'}
              </span>
            </h2>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'रेट्रो आर्केड स्टाइल में क्विज़ खेलें और Champion बनें!'
                : 'Experience retro arcade-style quizzes and become the Champion!'}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Quiz Mockup Card */}
            <div className="relative">
              <div className="bg-gray-800 rounded-3xl p-6 border-4 border-cyan-500/50 shadow-2xl shadow-cyan-500/20 transform hover:scale-105 transition-all duration-500">
                {/* Arcade Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((_, i) => (
                        <Heart key={i} className="h-6 w-6 text-red-500 fill-red-500 animate-pulse" />
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2 rounded-full">
                    <span className="text-black font-bold flex items-center gap-1">
                      <Flame className="h-4 w-4" /> 5 STREAK
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 text-2xl font-bold font-mono">1,250</p>
                    <p className="text-xs text-gray-400">SCORE</p>
                  </div>
                </div>

                {/* Timer Bar */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full w-3/4 rounded-full animate-pulse"></div>
                </div>

                {/* Question */}
                <div className="bg-gray-900/50 rounded-2xl p-6 mb-6 border border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-primary px-3 py-1 rounded-full text-xs text-white">Q.5</span>
                    <span className="text-gray-400 text-sm">Class 10 • Science</span>
                  </div>
                  <p className="text-white text-lg font-medium">
                    {language === 'hi' 
                      ? 'पृथ्वी का सबसे गर्म स्थान कौन सा है?'
                      : 'What is the hottest place on Earth?'}
                  </p>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  {['Death Valley', 'Sahara Desert', 'Lut Desert', 'Danakil Depression'].map((option, i) => (
                    <button
                      key={i}
                      className={`p-4 rounded-xl font-medium transition-all duration-300 text-left ${
                        i === 2 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105 shadow-lg shadow-green-500/30' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span className="text-sm opacity-60">#{String.fromCharCode(65 + i)}</span>
                      <p className="font-bold">{option}</p>
                    </button>
                  ))}
                </div>

                {/* Correct Animation */}
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full animate-bounce">
                    <PartyPopper className="h-5 w-5" />
                    <span className="font-bold">{language === 'hi' ? '+50 बोनस पॉइंट्स!' : '+50 BONUS POINTS!'}</span>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-yellow-500 text-black px-4 py-2 rounded-full font-bold shadow-lg animate-bounce-slow">
                🏆 LEVEL 3
              </div>
              <div className="absolute -bottom-6 -right-6 bg-pink-500 text-white px-4 py-2 rounded-full font-bold shadow-lg animate-float">
                ⚡ x2 COMBO
              </div>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {quizFeatures.map((feature, i) => (
                  <div key={i} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all">
                    <feature.icon className={`h-8 w-8 ${feature.color} mb-2`} />
                    <p className="text-white font-bold">{feature.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-cyan-400" />
                  {language === 'hi' ? 'क्विज़ टॉपिक्स' : 'Quiz Topics'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {quizTopics.map((topic, i) => (
                    <div key={i} className={`flex items-center gap-2 ${topic.color} text-white px-4 py-2 rounded-full`}>
                      <topic.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{topic.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20 p-6 rounded-xl border border-cyan-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Gift className="h-8 w-8 text-yellow-400" />
                  <div>
                    <p className="text-white font-bold text-lg">{language === 'hi' ? '100% मुफ़्त!' : '100% FREE!'}</p>
                    <p className="text-gray-400 text-sm">{language === 'hi' ? 'कोई लॉगिन नहीं चाहिए' : 'No login required'}</p>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 text-lg py-6 group">
                <Link to="/practice" className="flex items-center justify-center gap-2">
                  <Play className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {language === 'hi' ? 'अभी खेलना शुरू करें!' : 'START PLAYING NOW!'}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section - Medinee Kumar */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative">
                <img 
                  src={medineeKumar} 
                  alt="Medinee Kumar - Founder" 
                  className="w-full max-w-md mx-auto rounded-3xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg">
                  <p className="font-bold">Marine Engineer</p>
                  <p className="text-sm opacity-90">IIT JEE 2006</p>
                </div>
                <div className="absolute -top-4 -left-4 bg-success text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold animate-pulse">
                  🌍 Global Experience
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'hi' ? 'संस्थापक एवं मेंटर' : 'Founder & Mentor'}
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'hi' ? 'मेदिनी कुमार जी' : 'Medinee Kumar'}
              </h2>
              
              <p className="text-xl text-primary font-medium mb-4">
                {language === 'hi' ? 'Marine Engineer | IIT JEE 2006 | वैश्विक अनुभव' : 'Marine Engineer | IIT JEE 2006 | Global Experience'}
              </p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {language === 'hi' 
                  ? 'एक छोटे से गाँव से 2006 में IIT JEE qualify करके Marine Engineer बने। चीन, जापान, कोरिया, अमेरिका, यूरोप, जर्मनी, कनाडा, ब्राज़ील, सऊदी अरब और सभी समुद्री देशों में काम करने का वैश्विक अनुभव। अब वही अनुभव उनके समाज के छात्रों के लिए उपलब्ध है।'
                  : 'From a small village, qualified IIT JEE in 2006 and became a Marine Engineer. Global working experience in China, Japan, Korea, USA, Europe, Germany, Canada, Brazil, Saudi Arabia, and all maritime countries. Now that same experience is available for students of his society.'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">
                    {language === 'hi' ? '500+ छात्रों का मार्गदर्शन' : '500+ Students Guided'}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-card rounded-xl">
                  <Zap className="h-5 w-5 text-warning" />
                  <span className="text-sm font-medium">
                    {language === 'hi' ? '10+ देशों का अनुभव' : '10+ Countries Experience'}
                  </span>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-gradient-secondary">
                <Link to="/career">
                  {language === 'hi' ? 'करियर गाइडेंस लें' : 'Get Career Guidance'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? 'आपकी सफलता के लिए सब कुछ' : 'Everything You Need to Succeed'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'स्टडी स्पेस से करियर गाइडेंस तक - हमने आपको कवर किया है'
                : 'From study space to career guidance - we\'ve got you covered'}
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="study">Study</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <Link key={index} to={feature.link}>
                    <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20 group overflow-hidden">
                      <CardContent className="p-6 text-center relative">
                        <div className="absolute top-2 right-2 bg-success/20 text-success text-xs px-2 py-1 rounded-full">
                          {feature.highlight}
                        </div>
                        <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                          <feature.icon className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.desc}</p>
                        <div className="mt-4 flex items-center justify-center text-primary text-sm font-medium">
                          {language === 'hi' ? 'और जानें' : 'Learn More'}
                          <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="study">
              <div className="grid md:grid-cols-2 gap-6">
                <Link to="/library">
                  <Card className="h-full card-hover overflow-hidden">
                    <img src={libraryInterior} alt="Library" className="w-full h-48 object-cover" />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{t('features.library.title')}</h3>
                      <p className="text-muted-foreground">{t('features.library.desc')}</p>
                      <p className="text-primary font-bold mt-2">₹600/month</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link to="/stationery">
                  <Card className="h-full card-hover">
                    <CardContent className="p-6">
                      <ShoppingBag className="h-12 w-12 text-success mb-4" />
                      <h3 className="text-xl font-semibold mb-2">{t('features.stationery.title')}</h3>
                      <p className="text-muted-foreground">{t('features.stationery.desc')}</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="career">
              <Link to="/career">
                <Card className="card-hover overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <img src={medineeKumar} alt="Career Guidance" className="w-full h-64 object-cover" />
                    <CardContent className="p-8 flex flex-col justify-center">
                      <h3 className="text-2xl font-semibold mb-4">{t('features.career.title')}</h3>
                      <p className="text-muted-foreground mb-4">{t('features.career.desc')}</p>
                      <p className="text-primary font-medium">
                        {language === 'hi' ? 'मेदिनी कुमार जी द्वारा व्यक्तिगत मार्गदर्शन' : 'Personal guidance by Medinee Kumar'}
                      </p>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </TabsContent>
            
            <TabsContent value="practice">
              <Link to="/practice">
                <Card className="card-hover bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardContent className="p-8">
                    <div className="flex flex-wrap gap-3 mb-6">
                      {quizTopics.map((topic, i) => (
                        <div key={i} className={`flex items-center gap-2 ${topic.color} text-white px-4 py-2 rounded-full`}>
                          <topic.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{topic.name}</span>
                        </div>
                      ))}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4">{t('features.practice.title')}</h3>
                    <p className="text-muted-foreground mb-4">{t('features.practice.desc')}</p>
                    <p className="text-success font-bold text-lg">🎮 100% FREE - No Login Required!</p>
                  </CardContent>
                </Card>
              </Link>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* 🛒 STATIONERY STORE BANNER */}
      <section className="py-16 bg-gradient-to-r from-secondary/10 via-success/10 to-primary/10 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-success/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Floating Stationery Icons */}
        <div className="absolute top-16 right-20 text-4xl animate-float hidden md:block">✏️</div>
        <div className="absolute bottom-20 left-16 text-3xl animate-bounce-slow hidden md:block">📒</div>
        <div className="absolute top-1/3 right-1/4 text-2xl animate-float hidden md:block" style={{ animationDelay: '0.5s' }}>📐</div>
        
        <div className="container mx-auto px-4 relative">
          {/* Blinking Online Order Banner */}
          <a 
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-10 bg-gradient-to-r from-success via-emerald-500 to-teal-500 rounded-2xl p-4 text-white relative overflow-hidden shadow-xl hover:scale-[1.02] transition-transform"
          >
            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-bounce-slow">
                <ShoppingBag className="h-5 w-5" />
                <span className="font-bold">
                  {language === 'hi' ? '🛒 ऑनलाइन स्टोर' : '🛒 ONLINE STORE'}
                </span>
              </div>
              <div className="text-center">
                <p className="text-lg md:text-xl font-bold flex items-center gap-2 justify-center">
                  <span className="inline-block animate-bounce" style={{ animationDuration: '1s' }}>🎉</span>
                  {language === 'hi' 
                    ? 'हम ऑनलाइन ऑर्डर स्वीकार करते हैं! स्टोर पर जाएं →'
                    : 'We Accept Online Orders! Visit Store →'}
                  <span className="inline-block animate-bounce" style={{ animationDuration: '1s', animationDelay: '0.3s' }}>🎉</span>
                </p>
                <p className="text-sm text-white/90">
                  {language === 'hi' ? '500+ प्रोडक्ट्स • होम डिलीवरी • बेस्ट प्राइस' : '500+ Products • Home Delivery • Best Prices'}
                </p>
              </div>
              <ExternalLink className="h-5 w-5 hidden md:block" />
            </div>
          </a>
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-success/20 text-success px-4 py-2 rounded-full mb-4 animate-bounce-slow">
              <Tag className="h-4 w-4" />
              <span className="font-bold text-sm">
                {language === 'hi' ? '🎉 स्पेशल स्टूडेंट ऑफर!' : '🎉 Special Student Offer!'}
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">
                {language === 'hi' ? '🛒 Scope Express Store' : '🛒 Scope Express Store'}
              </span>
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'सभी स्टेशनरी आइटम्स एक ही जगह - बेस्ट क्वालिटी, बेस्ट प्राइस!'
                : 'All stationery items in one place - Best quality, Best prices!'}
            </p>
          </div>
          
          {/* Featured Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {[
              { icon: Pencil, name: language === 'hi' ? 'पेन और पेंसिल' : 'Pens & Pencils', price: '₹10+', color: 'bg-primary', hot: true },
              { icon: BookOpen, name: language === 'hi' ? 'नोटबुक' : 'Notebooks', price: '₹30+', color: 'bg-success', hot: true },
              { icon: Calculator, name: language === 'hi' ? 'कैलकुलेटर' : 'Calculators', price: '₹150+', color: 'bg-secondary', hot: false },
              { icon: Package, name: language === 'hi' ? 'एग्जाम किट' : 'Exam Kits', price: '₹99', color: 'bg-accent', hot: true },
              { icon: ShoppingBag, name: language === 'hi' ? 'स्कूल बैग' : 'School Bags', price: '₹299+', color: 'bg-warning', hot: false },
              { icon: BookOpen, name: language === 'hi' ? 'हाइलाइटर' : 'Highlighters', price: '₹20+', color: 'bg-pink-500', hot: true },
            ].map((product, i) => (
              <a 
                key={i}
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="card-hover overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-success relative">
                  {product.hot && (
                    <div className="absolute top-2 right-2 bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full font-bold z-10">
                      HOT
                    </div>
                  )}
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${product.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                      <product.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-semibold text-sm mb-1">{product.name}</p>
                    <p className="text-success font-bold">{product.price}</p>
                    <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'hi' ? 'क्लिक करें →' : 'Click to buy →'}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
          
          {/* Special Offer Banner */}
          <div className="bg-gradient-to-r from-success via-primary to-secondary rounded-3xl p-8 md:p-10 text-white relative overflow-hidden mb-10">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute top-5 right-5 w-20 h-20 border-2 border-white/20 rounded-full hidden md:block"></div>
            <div className="absolute bottom-5 left-5 w-16 h-16 border-2 border-white/20 rounded-full hidden md:block"></div>
            
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <Zap className="h-4 w-4" />
                  <span className="font-bold">{language === 'hi' ? 'लिमिटेड टाइम ऑफर!' : 'Limited Time Offer!'}</span>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-3">
                  {language === 'hi' ? 'एग्जाम किट स्पेशल' : 'Exam Kit Special'}
                </h3>
                
                <p className="text-white/90 mb-4">
                  {language === 'hi' 
                    ? 'पेन + पेंसिल + रबर + स्केल + शार्पनर - सब एक किट में!'
                    : 'Pen + Pencil + Eraser + Scale + Sharpener - All in one kit!'}
                </p>
                
                <div className="flex items-center gap-4">
                  <span className="text-xl line-through text-white/60">₹150</span>
                  <span className="text-4xl font-black">₹99</span>
                  <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold">
                    {language === 'hi' ? '34% बचत' : 'Save 34%'}
                  </span>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <a 
                  href={STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                    {language === 'hi' ? 'अभी खरीदें' : 'Buy Now'}
                    <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
          
          {/* Store Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Tag, text: language === 'hi' ? 'सबसे कम दाम' : 'Best Prices', desc: language === 'hi' ? 'होलसेल रेट्स' : 'Wholesale rates' },
              { icon: CheckCircle, text: language === 'hi' ? 'क्वालिटी प्रोडक्ट्स' : 'Quality Products', desc: language === 'hi' ? 'ब्रांडेड आइटम्स' : 'Branded items' },
              { icon: Truck, text: language === 'hi' ? 'होम डिलीवरी' : 'Home Delivery', desc: language === 'hi' ? '₹500+ पर फ्री' : 'Free above ₹500' },
              { icon: Gift, text: language === 'hi' ? 'स्टूडेंट ऑफर्स' : 'Student Offers', desc: language === 'hi' ? 'स्पेशल डिस्काउंट' : 'Special discounts' },
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm">
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{feature.text}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Main CTA */}
          <div className="text-center">
            <a 
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="h-14 px-12 text-lg bg-gradient-to-r from-success to-primary rounded-2xl shadow-xl hover:scale-105 transition-transform">
                <ShoppingBag className="mr-2 h-5 w-5" />
                {language === 'hi' ? 'स्टोर पर जाएं - 500+ प्रोडक्ट्स' : 'Visit Store - 500+ Products'}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Success Stories Banner */}
      <section className="py-16 bg-gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src={studentSuccess} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? '⭐ छात्रों की सफलता की कहानियां' : '⭐ Student Success Stories'}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-bold">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm opacity-80">{testimonial.class}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Career Paths Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4">
              <GraduationCap className="h-4 w-4" />
              <span className="text-sm font-medium">{language === 'hi' ? '30+ करियर पाथ्स' : '30+ Career Paths'}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? '🎯 अपना सही करियर खोजें' : '🎯 Find Your Perfect Career'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {language === 'hi' 
                ? 'Engineering, Medical, Defence, Commerce और अन्य कई विकल्पों में से चुनें'
                : 'Choose from Engineering, Medical, Defence, Commerce and many more options'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: '💻', title: 'Tech', count: '8+', color: 'bg-blue-500' },
              { icon: '⚕️', title: 'Medical', count: '6+', color: 'bg-red-500' },
              { icon: '🛡️', title: 'Defence', count: '5+', color: 'bg-green-700' },
              { icon: '📊', title: 'Commerce', count: '6+', color: 'bg-indigo-600' },
              { icon: '⚙️', title: 'Engineering', count: '4+', color: 'bg-orange-500' },
              { icon: '🏛️', title: 'Admin', count: '4+', color: 'bg-amber-600' },
              { icon: '⚖️', title: 'Law', count: '3+', color: 'bg-purple-600' },
              { icon: '🎨', title: 'Arts', count: '4+', color: 'bg-pink-500' },
            ].map((category, i) => (
              <Card key={i} className="card-hover text-center overflow-hidden group">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} careers</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-gradient-secondary">
              <Link to="/career">
                {language === 'hi' ? 'सभी करियर देखें' : 'Explore All Careers'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? '🚀 अपना सफर आज ही शुरू करें!' : '🚀 Start Your Journey Today!'}
            </h2>
            <p className="text-background/80 mb-8 text-lg">
              {language === 'hi' 
                ? 'Scope Express के साथ जुड़ें और अपने सपनों को हकीकत बनाएं। सैकड़ों छात्र पहले से ही सफलता की राह पर हैं!'
                : 'Join Scope Express and turn your dreams into reality. Hundreds of students are already on their path to success!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg">
                <Link to="/practice">
                  {language === 'hi' ? 'Free Practice शुरू करें' : 'Start Free Practice'}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-background text-background hover:bg-background/20">
                <Link to="/library">
                  {language === 'hi' ? 'Library Join करें' : 'Join Library'}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-background text-background hover:bg-background/20">
                <Link to="/contact">{t('contact.title')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
