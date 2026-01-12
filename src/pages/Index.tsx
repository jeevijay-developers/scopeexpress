import { Link } from 'react-router-dom';
import { 
  BookOpen, GraduationCap, Gamepad2, ShoppingBag, ArrowRight, Star, Users, Trophy, 
  CheckCircle, Sparkles, Target, Zap, Clock, Award, TrendingUp, Heart,
  Brain, Calculator, Globe, FlaskConical
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
    { icon: CheckCircle, text: language === 'hi' ? 'IIT Madras अनुभव' : 'IIT Madras Experience' },
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
                  {language === 'hi' ? 'अमरपाटन का #1 स्टूडेंट हब' : '#1 Student Hub in Amarpatan'}
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
                  <p className="font-bold">IIT Madras</p>
                  <p className="text-sm opacity-90">Alumni</p>
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
                {language === 'hi' ? 'IIT मद्रास से अमरपाटन तक का सफर' : 'From IIT Madras to Amarpatan'}
              </p>
              
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {language === 'hi' 
                  ? 'एक छोटे से गाँव से IIT Madras तक का सफर। अब वही अनुभव और मार्गदर्शन अमरपाटन के हर छात्र के लिए उपलब्ध है। Scope Express के माध्यम से, मेदिनी कुमार जी हर student को उनके सपनों तक पहुंचने में मदद कर रहे हैं।'
                  : 'From a small village to IIT Madras - a journey of dedication and hard work. Now, the same experience and guidance is available for every student in Amarpatan. Through Scope Express, Medinee Kumar is helping every student reach their dreams.'}
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
                    {language === 'hi' ? '5+ वर्षों का अनुभव' : '5+ Years Experience'}
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

      {/* Quiz Preview Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
                <Gamepad2 className="h-4 w-4" />
                <span className="text-sm font-medium">100% FREE</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {language === 'hi' ? '🎮 खेलो, सीखो, आगे बढ़ो!' : '🎮 Play, Learn, Grow!'}
              </h2>
              
              <p className="text-muted-foreground mb-6 text-lg">
                {language === 'hi' 
                  ? 'हमारे gamified practice zone में 5 topics में class-wise questions के साथ practice करें। Points कमाएं, levels unlock करें, और Champion बनें!'
                  : 'Practice with class-wise questions in 5 topics in our gamified practice zone. Earn points, unlock levels, and become a Champion!'}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm">
                  <Zap className="h-6 w-6 text-warning" />
                  <div>
                    <p className="font-semibold">{language === 'hi' ? 'तुरंत शुरू करें' : 'Instant Start'}</p>
                    <p className="text-xs text-muted-foreground">No login needed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm">
                  <Star className="h-6 w-6 text-primary" />
                  <div>
                    <p className="font-semibold">{language === 'hi' ? 'Points कमाएं' : 'Earn Points'}</p>
                    <p className="text-xs text-muted-foreground">+10 per correct</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm">
                  <Trophy className="h-6 w-6 text-secondary" />
                  <div>
                    <p className="font-semibold">{language === 'hi' ? '4 Levels' : '4 Levels'}</p>
                    <p className="text-xs text-muted-foreground">Beginner to Champion</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-card rounded-xl shadow-sm">
                  <Clock className="h-6 w-6 text-accent" />
                  <div>
                    <p className="font-semibold">{language === 'hi' ? 'Sound Effects' : 'Sound Effects'}</p>
                    <p className="text-xs text-muted-foreground">Fun audio feedback</p>
                  </div>
                </div>
              </div>
              
              <Button asChild size="lg" className="bg-gradient-accent">
                <Link to="/practice">
                  {language === 'hi' ? 'अभी खेलें - FREE!' : 'Play Now - FREE!'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={studentSuccess} 
                alt="Quiz Success" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -left-4 bg-card p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <p className="text-2xl font-bold text-primary">🏆</p>
                <p className="text-sm font-medium">Champion!</p>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-success text-white px-6 py-3 rounded-2xl shadow-xl animate-float">
                <p className="font-bold">+10 Points!</p>
              </div>
            </div>
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
                ? 'Scope Express के साथ जुड़ें और अपने सपनों को हकीकत बनाएं। अमरपाटन के सैकड़ों छात्र पहले से ही सफलता की राह पर हैं!'
                : 'Join Scope Express and turn your dreams into reality. Hundreds of students in Amarpatan are already on their path to success!'}
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
