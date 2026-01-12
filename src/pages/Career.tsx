import { useState } from 'react';
import { Briefcase, Stethoscope, Building2, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const careers = [
  { id: 'engineering', icon: Briefcase, color: 'bg-primary' },
  { id: 'medical', icon: Stethoscope, color: 'bg-accent' },
  { id: 'admin', icon: Building2, color: 'bg-secondary' },
  { id: 'defence', icon: Shield, color: 'bg-success' },
];

const careerInfo = {
  engineering: {
    en: {
      title: 'Engineering',
      description: 'Build the future with technology and innovation. Options include Computer Science, Mechanical, Civil, Electrical and more.',
      exams: 'JEE Main, JEE Advanced, State CETs',
    },
    hi: {
      title: 'इंजीनियरिंग',
      description: 'तकनीक और नवाचार के साथ भविष्य बनाएं। कंप्यूटर साइंस, मैकेनिकल, सिविल, इलेक्ट्रिकल आदि विकल्प उपलब्ध हैं।',
      exams: 'JEE Main, JEE Advanced, State CETs',
    },
  },
  medical: {
    en: {
      title: 'Medical',
      description: 'Serve humanity through healthcare. Become a doctor, surgeon, or healthcare specialist.',
      exams: 'NEET UG, AIIMS, JIPMER',
    },
    hi: {
      title: 'मेडिकल',
      description: 'स्वास्थ्य सेवा के माध्यम से मानवता की सेवा करें। डॉक्टर, सर्जन, या हेल्थकेयर स्पेशलिस्ट बनें।',
      exams: 'NEET UG, AIIMS, JIPMER',
    },
  },
  admin: {
    en: {
      title: 'Administrative Services',
      description: 'Lead and govern. Join IAS, IPS, IFS and shape the nation\'s future.',
      exams: 'UPSC CSE, State PSC',
    },
    hi: {
      title: 'प्रशासनिक सेवाएं',
      description: 'नेतृत्व करें और शासन करें। IAS, IPS, IFS में शामिल हों और देश का भविष्य बनाएं।',
      exams: 'UPSC CSE, State PSC',
    },
  },
  defence: {
    en: {
      title: 'Defence & Others',
      description: 'Serve the nation through armed forces. Options include Army, Navy, Air Force, and paramilitary.',
      exams: 'NDA, CDS, AFCAT',
    },
    hi: {
      title: 'डिफेंस और अन्य',
      description: 'सशस्त्र बलों के माध्यम से देश की सेवा करें। आर्मी, नेवी, एयर फोर्स, और पैरामिलिट्री विकल्प उपलब्ध हैं।',
      exams: 'NDA, CDS, AFCAT',
    },
  },
};

const classes = ['6', '7', '8', '9', '10', '11', '12'];

const Career = () => {
  const { t, language } = useLanguage();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
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
      toast.error('Please fill all fields');
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('career.title')}</span>
            </h1>
            <p className="text-xl text-muted-foreground">{t('career.subtitle')}</p>
          </div>

          {/* Career Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {careers.map((career) => {
              const info = careerInfo[career.id as keyof typeof careerInfo][language as 'en' | 'hi'];
              return (
                <Card
                  key={career.id}
                  className={`cursor-pointer card-hover border-2 transition-all ${
                    selectedCareer === career.id ? 'border-primary' : 'border-transparent hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedCareer(career.id)}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${career.color} rounded-2xl flex items-center justify-center mb-4`}>
                      <career.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{info.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{info.description}</p>
                    <p className="text-xs text-primary font-medium">Exams: {info.exams}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enquiry Form */}
          <Card className="max-w-md mx-auto animate-scale-in">
            <CardHeader>
              <CardTitle className="text-center">{t('career.form.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('common.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">{t('common.mobile')}</Label>
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
                  <Label htmlFor="class">{t('common.class')}</Label>
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
                  <Label htmlFor="career">{t('career.form.interest')}</Label>
                  <Select
                    value={formData.careerInterest}
                    onValueChange={(value) => setFormData({ ...formData, careerInterest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select career" />
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
                  className="w-full bg-gradient-primary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') : t('career.form.submit')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Career;
