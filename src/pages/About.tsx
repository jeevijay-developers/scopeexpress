import { 
  GraduationCap, Target, Users, Heart, Award, BookOpen, Star, 
  Trophy, CheckCircle, Sparkles, Quote, MapPin, Calendar, Lightbulb,
  Building2, Users2, TrendingUp, Medal
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import medineeKumar from '@/assets/medinee-kumar.png';
import studentSuccess from '@/assets/student-success.jpg';
import libraryInterior from '@/assets/library-interior.jpg';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    { icon: GraduationCap, title: 'Quality Education', titleHi: 'गुणवत्तापूर्ण शिक्षा', desc: 'We believe every student deserves access to quality educational resources.', descHi: 'हम मानते हैं कि हर छात्र को गुणवत्तापूर्ण शैक्षिक संसाधनों तक पहुंच मिलनी चाहिए।', color: 'bg-primary' },
    { icon: Target, title: 'Goal-Oriented', titleHi: 'लक्ष्य-केंद्रित', desc: 'We help students set and achieve their academic and career goals.', descHi: 'हम छात्रों को उनके शैक्षिक और करियर लक्ष्य निर्धारित करने और प्राप्त करने में मदद करते हैं।', color: 'bg-secondary' },
    { icon: Users, title: 'Community Focus', titleHi: 'समुदाय केंद्रित', desc: 'We are committed to uplifting our local community through education.', descHi: 'हम शिक्षा के माध्यम से अपने स्थानीय समुदाय को आगे बढ़ाने के लिए प्रतिबद्ध हैं।', color: 'bg-accent' },
    { icon: Heart, title: 'Passion for Teaching', titleHi: 'पढ़ाने का जुनून', desc: 'Our team is passionate about making learning fun and effective.', descHi: 'हमारी टीम सीखने को मजेदार और प्रभावी बनाने के लिए जुनूनी है।', color: 'bg-success' },
  ];

  const achievements = [
    { icon: Users2, number: '500+', label: language === 'hi' ? 'छात्र मार्गदर्शित' : 'Students Guided', color: 'text-primary' },
    { icon: Trophy, number: '95%', label: language === 'hi' ? 'सफलता दर' : 'Success Rate', color: 'text-success' },
    { icon: Calendar, number: '5+', label: language === 'hi' ? 'वर्षों का अनुभव' : 'Years Experience', color: 'text-secondary' },
    { icon: Award, number: '50+', label: language === 'hi' ? 'प्रथम रैंक' : 'First Rankers', color: 'text-warning' },
  ];

  const timeline = [
    { year: '2019', title: language === 'hi' ? 'शुरुआत' : 'The Beginning', desc: language === 'hi' ? 'छोटे कमरे में 10 छात्रों के साथ शुरुआत' : 'Started with 10 students in a small room' },
    { year: '2020', title: language === 'hi' ? 'लाइब्रेरी स्थापना' : 'Library Established', desc: language === 'hi' ? 'अमरपाटन में पहली प्रोफेशनल लाइब्रेरी' : 'First professional library in Amarpatan' },
    { year: '2022', title: language === 'hi' ? 'कैरियर गाइडेंस' : 'Career Guidance', desc: language === 'hi' ? 'व्यक्तिगत कैरियर काउंसलिंग शुरू' : 'Started personalized career counseling' },
    { year: '2024', title: language === 'hi' ? 'डिजिटल विस्तार' : 'Digital Expansion', desc: language === 'hi' ? 'ऑनलाइन प्रैक्टिस और क्विज़ लॉन्च' : 'Launched online practice & quizzes' },
  ];

  const services = [
    { icon: BookOpen, title: language === 'hi' ? 'प्रीमियम लाइब्रेरी' : 'Premium Library', desc: language === 'hi' ? 'AC, WiFi और शांत वातावरण' : 'AC, WiFi & peaceful environment' },
    { icon: Lightbulb, title: language === 'hi' ? 'कैरियर गाइडेंस' : 'Career Guidance', desc: language === 'hi' ? 'विशेषज्ञ मार्गदर्शन और सलाह' : 'Expert guidance & mentorship' },
    { icon: GraduationCap, title: language === 'hi' ? 'फ्री प्रैक्टिस' : 'Free Practice', desc: language === 'hi' ? 'गेमिफाइड क्विज़ और टेस्ट' : 'Gamified quizzes & tests' },
    { icon: Building2, title: language === 'hi' ? 'स्टेशनरी शॉप' : 'Stationery Shop', desc: language === 'hi' ? 'सभी शैक्षिक सामग्री' : 'All educational materials' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16 md:py-24">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-warning/20 rounded-full blur-2xl animate-bounce-slow"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">
                {language === 'hi' ? '🏆 अमरपाटन का #1 शैक्षिक केंद्र' : '🏆 #1 Education Hub in Amarpatan'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient">{t('about.title')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {language === 'hi' 
                ? 'एक इंजीनियर द्वारा स्थापित, हज़ारों छात्रों का भरोसा'
                : 'Founded by an Engineer, trusted by thousands of students'}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {achievements.map((item, i) => (
                <Card key={i} className="card-hover bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <item.icon className={`h-8 w-8 ${item.color} mx-auto mb-2`} />
                    <p className={`text-3xl font-bold ${item.color}`}>{item.number}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section - Medinee Kumar */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full mb-4">
              <Medal className="h-4 w-4" />
              <span className="text-sm font-bold">
                {language === 'hi' ? 'संस्थापक और मार्गदर्शक' : 'Founder & Mentor'}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {language === 'hi' ? '👨‍🎓 मेदिनी कुमार जी से मिलें' : '👨‍🎓 Meet Medinee Kumar Ji'}
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  {/* Image Side */}
                  <div className="relative bg-gradient-hero p-8 flex items-center justify-center">
                    <div className="relative animate-float">
                      <img 
                        src={medineeKumar} 
                        alt="Medinee Kumar - Founder of Scope Express" 
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-3xl shadow-2xl border-4 border-white/20"
                      />
                      <div className="absolute -top-4 -right-4 bg-warning text-warning-foreground px-4 py-2 rounded-2xl shadow-lg animate-bounce-slow">
                        <p className="font-bold text-sm">🚢 Marine Engineer</p>
                      </div>
                      <div className="absolute -bottom-4 -left-4 bg-success text-success-foreground px-4 py-2 rounded-2xl shadow-lg">
                        <p className="font-bold text-sm">🌍 Global Experience</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="p-8 md:p-12">
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {language === 'hi' ? 'मेदिनी कुमार' : 'Medinee Kumar'}
                    </h3>
                    <p className="text-primary font-medium mb-6">
                      {language === 'hi' ? 'संस्थापक | Marine Engineer | IIT JEE 2006' : 'Founder | Marine Engineer | IIT JEE 2006'}
                    </p>

                    <div className="space-y-4 text-muted-foreground mb-8">
                      <p className="leading-relaxed">
                        {language === 'hi' 
                          ? 'मध्य प्रदेश के एक छोटे से गाँव से 2006 में IIT JEE qualify करके Marine Engineer बने। चीन, जापान, कोरिया, अमेरिका, यूरोप, जर्मनी, कनाडा, ब्राज़ील, सऊदी अरब और सभी समुद्री देशों में काम करने का वैश्विक अनुभव।'
                          : 'From a small village, qualified IIT JEE in 2006 and became a Marine Engineer. Global working experience in China, Japan, Korea, USA, Europe, Germany, Canada, Brazil, Saudi Arabia, and all maritime countries.'}
                      </p>
                      <p className="leading-relaxed">
                        {language === 'hi' 
                          ? 'अपने वैश्विक अनुभव और ज्ञान को अमरपाटन के छात्रों के साथ साझा करने के लिए, उन्होंने Scope Express की स्थापना की। आज, वे सैकड़ों छात्रों को उनके शैक्षिक और करियर लक्ष्यों तक पहुँचने में मदद कर रहे हैं।'
                          : 'To share his global experience and knowledge with students of his society, he founded Scope Express. Today, he helps hundreds of students reach their academic and career goals.'}
                      </p>
                    </div>

                    {/* Achievements */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { icon: GraduationCap, text: language === 'hi' ? 'Marine Engineer' : 'Marine Engineer' },
                        { icon: Users, text: language === 'hi' ? '500+ छात्र मार्गदर्शित' : '500+ Students Mentored' },
                        { icon: Award, text: language === 'hi' ? 'IIT JEE 2006' : 'IIT JEE 2006' },
                        { icon: Heart, text: language === 'hi' ? 'वैश्विक अनुभव' : 'Global Experience' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                          <item.icon className="h-5 w-5 text-primary" />
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-12 w-12 mx-auto mb-6 opacity-50" />
            <blockquote className="text-xl md:text-2xl italic mb-6 leading-relaxed">
              {language === 'hi' 
                ? '"एक छोटे से गाँव से IIT JEE 2006 qualify करके Marine Engineer बना और दुनिया के कई देशों में काम किया। अब मैं उसी अनुभव से अमरपाटन के छात्रों को उनके सपने पूरे करने में मदद कर रहा हूं।"'
                : '"From a small village, I qualified IIT JEE in 2006, became a Marine Engineer, and worked across many countries worldwide. Now I use that experience to help students in Amarpatan achieve their dreams."'}
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <img src={medineeKumar} alt="Medinee Kumar" className="w-12 h-12 rounded-full object-cover border-2 border-white/50" />
              <div className="text-left">
                <p className="font-bold">{language === 'hi' ? 'मेदिनी कुमार' : 'Medinee Kumar'}</p>
                <p className="text-sm text-white/80">{language === 'hi' ? 'संस्थापक, Scope Express' : 'Founder, Scope Express'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Our Story */}
              <Card className="overflow-hidden shadow-xl animate-fade-in">
                <CardContent className="p-0">
                  <img src={studentSuccess} alt="Student Success" className="w-full h-48 object-cover" />
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-primary mb-4">
                      <BookOpen className="h-5 w-5" />
                      <span className="font-bold">{t('about.story.title')}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('about.story.content')}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {language === 'hi' 
                        ? 'जब मेदिनी कुमार जी IIT से लौटे, उन्होंने देखा कि अमरपाटन के छात्रों को सही मार्गदर्शन नहीं मिल रहा। इसी सोच से Scope Express का जन्म हुआ।'
                        : 'When Medinee Kumar returned from IIT, he observed that students in Amarpatan lacked proper guidance. This thought gave birth to Scope Express.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Our Mission */}
              <Card className="overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-0">
                  <img src={libraryInterior} alt="Library Interior" className="w-full h-48 object-cover" />
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-secondary mb-4">
                      <Target className="h-5 w-5" />
                      <span className="font-bold">{t('about.mission.title')}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('about.mission.content')}
                    </p>
                    <ul className="space-y-3">
                      {[
                        language === 'hi' ? 'गुणवत्तापूर्ण शिक्षा सबके लिए सुलभ बनाना' : 'Make quality education accessible to all',
                        language === 'hi' ? 'व्यक्तिगत कैरियर मार्गदर्शन प्रदान करना' : 'Provide personalized career guidance',
                        language === 'hi' ? 'डिजिटल और पारंपरिक शिक्षा का मेल' : 'Blend digital and traditional learning',
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'hi' ? '📅 हमारी यात्रा' : '📅 Our Journey'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' ? 'छोटी शुरुआत से बड़ी उपलब्धियों तक' : 'From humble beginnings to great achievements'}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {timeline.map((item, i) => (
                <Card key={i} className="card-hover text-center relative overflow-visible animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full font-bold text-sm">
                    {item.year}
                  </div>
                  <CardContent className="pt-8 pb-6">
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'hi' ? '🎯 हमारी सेवाएं' : '🎯 Our Services'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' ? 'छात्रों के सर्वांगीण विकास के लिए' : 'For holistic development of students'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {services.map((service, i) => (
              <Card key={i} className="card-hover text-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {language === 'hi' ? '💝 हमारे मूल्य' : '💝 Our Values'}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="card-hover animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 flex gap-4">
                  <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      {language === 'hi' ? value.titleHi : value.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {language === 'hi' ? value.descHi : value.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {language === 'hi' ? '🚀 आज ही Scope Express परिवार से जुड़ें!' : '🚀 Join the Scope Express Family Today!'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {language === 'hi' 
              ? 'अपने शैक्षिक सपनों को साकार करें - मेदिनी कुमार जी के मार्गदर्शन में'
              : 'Realize your educational dreams - under the guidance of Medinee Kumar ji'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/practice" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-colors">
              <Star className="h-5 w-5" />
              {language === 'hi' ? 'फ्री प्रैक्टिस शुरू करें' : 'Start Free Practice'}
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-colors border border-white/30">
              <MapPin className="h-5 w-5" />
              {language === 'hi' ? 'हमसे मिलें' : 'Visit Us'}
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
