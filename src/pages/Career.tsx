import { useState } from 'react';
import { 
  Briefcase, Stethoscope, Building2, Shield, ArrowRight, CheckCircle, 
  Star, Users, Award, Target, Zap, BookOpen, GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import medineeKumar from '@/assets/medinee-kumar.png';
import careerEngineering from '@/assets/career-engineering.jpg';
import careerMedical from '@/assets/career-medical.jpg';
import careerAdmin from '@/assets/career-admin.jpg';
import careerDefence from '@/assets/career-defence.jpg';

const careers = [
  { 
    id: 'engineering', 
    icon: Briefcase, 
    color: 'bg-primary',
    image: careerEngineering,
    exams: ['JEE Main', 'JEE Advanced', 'State CETs', 'BITSAT', 'VITEEE'],
    salary: '8-50 LPA',
    duration: '4 Years B.Tech',
  },
  { 
    id: 'medical', 
    icon: Stethoscope, 
    color: 'bg-accent',
    image: careerMedical,
    exams: ['NEET UG', 'AIIMS', 'JIPMER', 'State PMTs'],
    salary: '10-80 LPA',
    duration: '5.5 Years MBBS',
  },
  { 
    id: 'admin', 
    icon: Building2, 
    color: 'bg-secondary',
    image: careerAdmin,
    exams: ['UPSC CSE', 'State PSC', 'SSC CGL'],
    salary: '8-25 LPA + Perks',
    duration: '1-3 Years Prep',
  },
  { 
    id: 'defence', 
    icon: Shield, 
    color: 'bg-success',
    image: careerDefence,
    exams: ['NDA', 'CDS', 'AFCAT', 'Indian Army TES'],
    salary: '6-20 LPA + Benefits',
    duration: '3-4 Years Training',
  },
];

const careerInfo = {
  engineering: {
    en: {
      title: 'Engineering',
      description: 'Build the future with technology and innovation. Engineering opens doors to IT, robotics, AI, civil infrastructure, and countless other exciting fields.',
      scope: 'Software Developer, Data Scientist, Civil Engineer, Mechanical Engineer, Electronics Engineer, AI/ML Engineer',
    },
    hi: {
      title: 'इंजीनियरिंग',
      description: 'तकनीक और नवाचार के साथ भविष्य बनाएं। इंजीनियरिंग IT, robotics, AI, civil infrastructure और कई अन्य रोमांचक क्षेत्रों में दरवाजे खोलती है।',
      scope: 'Software Developer, Data Scientist, Civil Engineer, Mechanical Engineer, Electronics Engineer, AI/ML Engineer',
    },
  },
  medical: {
    en: {
      title: 'Medical',
      description: 'Serve humanity through healthcare. Become a doctor, surgeon, or healthcare specialist and make a difference in people\'s lives every day.',
      scope: 'Doctor, Surgeon, Specialist, Researcher, Hospital Administrator, Healthcare Consultant',
    },
    hi: {
      title: 'मेडिकल',
      description: 'स्वास्थ्य सेवा के माध्यम से मानवता की सेवा करें। डॉक्टर, सर्जन या हेल्थकेयर स्पेशलिस्ट बनें और हर दिन लोगों की जिंदगी में बदलाव लाएं।',
      scope: 'Doctor, Surgeon, Specialist, Researcher, Hospital Administrator, Healthcare Consultant',
    },
  },
  admin: {
    en: {
      title: 'Administrative Services',
      description: 'Lead and govern the nation. Join IAS, IPS, IFS and shape policies that impact millions. The most prestigious career in India.',
      scope: 'IAS Officer, IPS Officer, IFS Officer, District Collector, Commissioner, Secretary',
    },
    hi: {
      title: 'प्रशासनिक सेवाएं',
      description: 'देश का नेतृत्व और शासन करें। IAS, IPS, IFS में शामिल हों और ऐसी नीतियां बनाएं जो करोड़ों लोगों को प्रभावित करती हैं। भारत का सबसे प्रतिष्ठित करियर।',
      scope: 'IAS Officer, IPS Officer, IFS Officer, District Collector, Commissioner, Secretary',
    },
  },
  defence: {
    en: {
      title: 'Defence & Others',
      description: 'Serve the nation through armed forces. A career of honor, discipline, and patriotism. Options include Army, Navy, Air Force, and paramilitary.',
      scope: 'Army Officer, Navy Officer, Air Force Pilot, Para SF, NDA Cadet, Technical Officer',
    },
    hi: {
      title: 'डिफेंस और अन्य',
      description: 'सशस्त्र बलों के माध्यम से देश की सेवा करें। सम्मान, अनुशासन और देशभक्ति का करियर। आर्मी, नेवी, एयर फोर्स और पैरामिलिट्री विकल्प उपलब्ध हैं।',
      scope: 'Army Officer, Navy Officer, Air Force Pilot, Para SF, NDA Cadet, Technical Officer',
    },
  },
};

const classes = ['6', '7', '8', '9', '10', '11', '12'];

const Career = () => {
  const { t, language } = useLanguage();
  const [selectedCareer, setSelectedCareer] = useState<string>('engineering');
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    classLevel: '',
    careerInterest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.classLevel || !formData.careerInterest) {
      toast.error(language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        mobile: formData.mobile,
        class: formData.classLevel,
        source_page: 'Career Guidance',
        interest_type: 'Career Enquiry',
        career_interest: formData.careerInterest,
      });

      if (error) throw error;

      toast.success(t('common.success'));
      setFormData({ name: '', mobile: '', classLevel: '', careerInterest: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCareerData = careers.find(c => c.id === selectedCareer)!;
  const selectedCareerInfo = careerInfo[selectedCareer as keyof typeof careerInfo][language as 'en' | 'hi'];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/10 via-background to-primary/10 py-12 md:py-16">
        <div className="absolute top-10 right-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6 animate-fade-in">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {language === 'hi' ? 'IIT Madras Alumni द्वारा मार्गदर्शन' : 'Guidance by IIT Madras Alumni'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient">{t('career.title')}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {t('career.subtitle')}
              </p>
              
              <p className="text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {language === 'hi' 
                  ? 'सही career चुनना जीवन का सबसे महत्वपूर्ण फैसला है। Medinee Kumar जी के अनुभव और मार्गदर्शन से अपने सपनों को साकार करें।'
                  : 'Choosing the right career is life\'s most important decision. Realize your dreams with Medinee Kumar\'s experience and guidance.'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'छात्र' : 'Students'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Star className="h-6 w-6 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'रेटिंग' : 'Rating'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Award className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">95%</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'सफलता' : 'Success'}</p>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="relative">
                <img 
                  src={medineeKumar} 
                  alt="Medinee Kumar - Career Mentor" 
                  className="rounded-3xl shadow-2xl mx-auto max-w-sm"
                />
                <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground px-6 py-3 rounded-2xl shadow-lg">
                  <p className="font-bold">Medinee Kumar</p>
                  <p className="text-sm opacity-90">IIT Madras Alumni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Tabs */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {language === 'hi' ? '🎯 Career Options Explore करें' : '🎯 Explore Career Options'}
          </h2>

          <Tabs value={selectedCareer} onValueChange={setSelectedCareer} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8 h-auto">
              {careers.map((career) => (
                <TabsTrigger 
                  key={career.id} 
                  value={career.id}
                  className="flex flex-col gap-1 py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <career.icon className="h-5 w-5" />
                  <span className="text-xs">{t(`career.${career.id}`)}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {careers.map((career) => (
              <TabsContent key={career.id} value={career.id}>
                <Card className="overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="relative h-64 md:h-auto">
                      <img 
                        src={career.image} 
                        alt={careerInfo[career.id as keyof typeof careerInfo][language as 'en' | 'hi'].title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-sm opacity-80">{language === 'hi' ? 'औसत सैलरी' : 'Avg. Salary'}</p>
                        <p className="text-2xl font-bold">{career.salary}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-8">
                      <div className={`w-14 h-14 ${career.color} rounded-2xl flex items-center justify-center mb-4`}>
                        <career.icon className="h-7 w-7 text-white" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3">
                        {careerInfo[career.id as keyof typeof careerInfo][language as 'en' | 'hi'].title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-4">
                        {careerInfo[career.id as keyof typeof careerInfo][language as 'en' | 'hi'].description}
                      </p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">{language === 'hi' ? 'प्रमुख परीक्षाएं:' : 'Key Exams:'}</p>
                        <div className="flex flex-wrap gap-2">
                          {career.exams.map((exam, i) => (
                            <span key={i} className="bg-muted px-3 py-1 rounded-full text-sm">
                              {exam}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">{language === 'hi' ? 'करियर स्कोप:' : 'Career Scope:'}</p>
                        <p className="text-sm text-muted-foreground">
                          {careerInfo[career.id as keyof typeof careerInfo][language as 'en' | 'hi'].scope}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span>{career.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4 text-warning" />
                          <span>{career.salary}</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">
            {language === 'hi' ? '✨ Medinee Kumar जी से क्यों सीखें?' : '✨ Why Learn from Medinee Kumar?'}
          </h2>
          
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Award, title: language === 'hi' ? 'IIT Madras' : 'IIT Madras', desc: language === 'hi' ? 'Alumni का अनुभव' : 'Alumni Experience' },
              { icon: Target, title: language === 'hi' ? 'व्यक्तिगत' : 'Personal', desc: language === 'hi' ? 'One-on-One Guidance' : 'One-on-One Guidance' },
              { icon: Users, title: language === 'hi' ? '500+' : '500+', desc: language === 'hi' ? 'Students Guided' : 'Students Guided' },
              { icon: Star, title: language === 'hi' ? 'Free' : 'Free', desc: language === 'hi' ? 'Career Counseling' : 'Career Counseling' },
            ].map((item, i) => (
              <Card key={i} className="text-center card-hover">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('career.form.title')}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {language === 'hi' ? 'Medinee Kumar जी से FREE guidance पाएं!' : 'Get FREE guidance from Medinee Kumar!'}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('common.name')} *</Label>
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
                  <Label htmlFor="mobile">{t('common.mobile')} *</Label>
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
                  <Label htmlFor="class">{t('common.class')} *</Label>
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
                  <Label htmlFor="career">{t('career.form.interest')} *</Label>
                  <Select
                    value={formData.careerInterest}
                    onValueChange={(value) => setFormData({ ...formData, careerInterest: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'hi' ? 'करियर चुनें' : 'Select career'} />
                    </SelectTrigger>
                    <SelectContent>
                      {careers.map((career) => (
                        <SelectItem key={career.id} value={career.id}>
                          {t(`career.${career.id}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-secondary text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') : (
                    <>
                      {t('career.form.submit')} 🚀
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {language === 'hi' ? 'Free Guidance - कोई शुल्क नहीं' : 'Free Guidance - No Charges'}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Career;
