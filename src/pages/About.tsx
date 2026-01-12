import { GraduationCap, Target, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t, language } = useLanguage();

  const values = [
    { icon: GraduationCap, title: 'Quality Education', titleHi: 'गुणवत्तापूर्ण शिक्षा', desc: 'We believe every student deserves access to quality educational resources.', descHi: 'हम मानते हैं कि हर छात्र को गुणवत्तापूर्ण शैक्षिक संसाधनों तक पहुंच मिलनी चाहिए।' },
    { icon: Target, title: 'Goal-Oriented', titleHi: 'लक्ष्य-केंद्रित', desc: 'We help students set and achieve their academic and career goals.', descHi: 'हम छात्रों को उनके शैक्षिक और करियर लक्ष्य निर्धारित करने और प्राप्त करने में मदद करते हैं।' },
    { icon: Users, title: 'Community Focus', titleHi: 'समुदाय केंद्रित', desc: 'We are committed to uplifting our local community through education.', descHi: 'हम शिक्षा के माध्यम से अपने स्थानीय समुदाय को आगे बढ़ाने के लिए प्रतिबद्ध हैं।' },
    { icon: Heart, title: 'Passion for Teaching', titleHi: 'पढ़ाने का जुनून', desc: 'Our team is passionate about making learning fun and effective.', descHi: 'हमारी टीम सीखने को मजेदार और प्रभावी बनाने के लिए जुनूनी है।' },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('about.title')}</span>
            </h1>
          </div>

          {/* Story Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-hero p-8 text-white flex items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-4">{t('about.story.title')}</h2>
                      <p className="text-white/90 leading-relaxed">
                        {t('about.story.content')}
                      </p>
                    </div>
                  </div>
                  <div className="p-8 bg-card">
                    <h2 className="text-2xl font-bold mb-4">{t('about.mission.title')}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('about.mission.content')}
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-bold">500+</span>
                        </div>
                        <span className="text-muted-foreground">Students Guided</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                          <span className="text-success font-bold">95%</span>
                        </div>
                        <span className="text-muted-foreground">Success Rate</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                          <span className="text-secondary font-bold">5+</span>
                        </div>
                        <span className="text-muted-foreground">Years Experience</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Values */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">Our Values</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        {language === 'hi' ? value.titleHi : value.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {language === 'hi' ? value.descHi : value.desc}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Founder Quote */}
          <div className="max-w-2xl mx-auto mt-16">
            <Card className="bg-muted/50">
              <CardContent className="p-8 text-center">
                <blockquote className="text-lg italic text-muted-foreground mb-4">
                  "From a small town in Madhya Pradesh to IIT Madras - I learned that with the right guidance and resources, any student can achieve their dreams. Scope Express is my way of giving back to the community that raised me."
                </blockquote>
                <p className="font-semibold text-primary">— Founder, Scope Express</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
