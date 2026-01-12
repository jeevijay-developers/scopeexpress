import { useState } from 'react';
import { 
  Snowflake, Wifi, MonitorSmartphone, BatteryCharging, Cctv, ArrowRight, CheckCircle,
  Clock, Users, Star, MapPin, Phone, Sparkles, BookOpen, Coffee, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import libraryInterior from '@/assets/library-interior.jpg';
import heroStudents from '@/assets/hero-students.jpg';
import medineeKumar from '@/assets/medinee-kumar.png';

const facilities = [
  { icon: Snowflake, key: 'ac', desc: 'Full AC Environment' },
  { icon: Wifi, key: 'wifi', desc: 'High-Speed Internet' },
  { icon: MonitorSmartphone, key: 'desk', desc: 'Personal Study Desk' },
  { icon: BatteryCharging, key: 'charging', desc: 'Charging Points' },
  { icon: Cctv, key: 'cctv', desc: '24/7 Security' },
  { icon: Coffee, key: 'water', desc: 'Water Dispenser' },
];

const timings = [
  'Morning (6 AM - 12 PM)',
  'Afternoon (12 PM - 6 PM)',
  'Evening (6 PM - 10 PM)',
  'Full Day',
];

const classes = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Competitive Exams'];

const Library = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    classLevel: '',
    timing: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.classLevel || !formData.timing) {
      toast.error(language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        mobile: formData.mobile,
        class: formData.classLevel,
        source_page: 'Library',
        interest_type: 'Library Membership',
        preferred_timing: formData.timing,
      });

      if (error) throw error;

      toast.success(t('common.success'));
      setFormData({ name: '', mobile: '', classLevel: '', timing: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    { icon: BookOpen, text: language === 'hi' ? 'शांत माहौल' : 'Peaceful Environment' },
    { icon: Clock, text: language === 'hi' ? '16 घंटे खुला' : '16 Hours Open' },
    { icon: Users, text: language === 'hi' ? 'सीमित सीटें' : 'Limited Seats' },
    { icon: Zap, text: language === 'hi' ? 'Focus बढ़ता है' : 'Increases Focus' },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={libraryInterior} alt="Library" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'hi' ? 'अमरपाटन की #1 Library' : '#1 Library in Amarpatan'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('library.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              {t('library.subtitle')}
            </p>
            
            <div className="flex items-center gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{t('library.pricing')}</p>
                <p className="text-sm text-white/70">{language === 'hi' ? 'केवल' : 'Only'}</p>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="flex flex-wrap gap-2">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full text-sm">
                    <b.icon className="h-3 w-3" />
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
            
            <Button size="lg" className="bg-primary hover:bg-primary/90 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              {language === 'hi' ? 'अभी Join करें' : 'Join Now'} →
            </Button>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            {language === 'hi' ? '✨ हमारी सुविधाएं' : '✨ Our Facilities'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {facilities.map((facility, i) => (
              <Card key={i} className="text-center card-hover">
                <CardContent className="p-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <facility.icon className="h-7 w-7 text-primary" />
                  </div>
                  <p className="font-semibold text-sm">{t(`library.facility.${facility.key}`)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{facility.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Our Library */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                {language === 'hi' ? '📚 हमारी Library क्यों?' : '📚 Why Our Library?'}
              </h2>
              
              <div className="space-y-4">
                {[
                  { title: language === 'hi' ? 'शांत और AC माहौल' : 'Peaceful AC Environment', desc: language === 'hi' ? 'पूरी तरह से air-conditioned, distraction-free study zone' : 'Fully air-conditioned, distraction-free study zone' },
                  { title: language === 'hi' ? 'Individual Study Desks' : 'Individual Study Desks', desc: language === 'hi' ? 'हर student के लिए personal desk और proper lighting' : 'Personal desk and proper lighting for every student' },
                  { title: language === 'hi' ? 'लंबे समय तक खुला' : 'Extended Hours', desc: language === 'hi' ? 'सुबह 6 बजे से रात 10 बजे तक - 16 घंटे' : '6 AM to 10 PM - 16 hours daily' },
                  { title: language === 'hi' ? 'Competition Books' : 'Competition Books', desc: language === 'hi' ? 'JEE, NEET, UPSC और अन्य exams की books उपलब्ध' : 'Books available for JEE, NEET, UPSC and other exams' },
                  { title: language === 'hi' ? 'High-Speed Wi-Fi' : 'High-Speed Wi-Fi', desc: language === 'hi' ? 'Online resources और video lectures के लिए fast internet' : 'Fast internet for online resources and video lectures' },
                  { title: language === 'hi' ? 'Security & CCTV' : 'Security & CCTV', desc: language === 'hi' ? '24/7 CCTV surveillance और safe environment' : '24/7 CCTV surveillance and safe environment' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-card rounded-xl shadow-sm">
                    <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={heroStudents} 
                alt="Students in library" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <img src={medineeKumar} alt="Medinee Kumar" className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold">Medinee Kumar</p>
                    <p className="text-xs text-muted-foreground">Founder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Banner */}
      <section className="py-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-white/80 mb-2">{language === 'hi' ? 'Monthly Membership' : 'Monthly Membership'}</p>
            <h2 className="text-5xl md:text-7xl font-bold mb-4">{t('library.pricing')}</h2>
            <p className="text-white/80 mb-6">{language === 'hi' ? 'सभी सुविधाओं के साथ Unlimited Access' : 'Unlimited Access with All Facilities'}</p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['AC', 'Wi-Fi', 'Individual Desk', 'Charging', 'CCTV', 'Books'].map((f, i) => (
                <div key={i} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                  ✓ {f}
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg">
                {language === 'hi' ? 'अभी Enquire करें' : 'Enquire Now'} →
              </Button>
              <Button size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white/20">
                <Phone className="mr-2 h-5 w-5" />
                +91 62653 68438
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Timings */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  {language === 'hi' ? 'खुलने का समय' : 'Opening Hours'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>{language === 'hi' ? 'सोमवार - शनिवार' : 'Monday - Saturday'}</span>
                    <span className="font-bold text-primary">6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>{language === 'hi' ? 'रविवार' : 'Sunday'}</span>
                    <span className="font-bold text-primary">8:00 AM - 8:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  {language === 'hi' ? 'हमारा पता' : 'Our Location'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-lg font-semibold">Scope Express Library</p>
                  <p className="text-muted-foreground">{t('contact.address.value')}</p>
                  <p className="text-muted-foreground">Pin Code: 485776</p>
                  <a href="tel:+916265368438" className="flex items-center gap-2 text-primary font-medium">
                    <Phone className="h-4 w-4" />
                    +91 62653 68438
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('library.form.title')}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {language === 'hi' ? 'आज ही अपनी seat book करें!' : 'Book your seat today!'}
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
                      <SelectValue placeholder={language === 'hi' ? 'कक्षा / कोर्स चुनें' : 'Select class / course'} />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timing">{t('library.form.timing')} *</Label>
                  <Select
                    value={formData.timing}
                    onValueChange={(value) => setFormData({ ...formData, timing: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={language === 'hi' ? 'समय चुनें' : 'Select timing'} />
                    </SelectTrigger>
                    <SelectContent>
                      {timings.map((time) => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 bg-gradient-primary text-lg font-semibold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') : (
                    <>
                      {t('library.form.submit')} 🚀
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  {language === 'hi' ? 'हम जल्द ही आपसे संपर्क करेंगे' : 'We will contact you shortly'}
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Library;
