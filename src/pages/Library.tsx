import { useState } from 'react';
import { Snowflake, Wifi, MonitorSmartphone, BatteryCharging, Cctv, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const facilities = [
  { icon: Snowflake, key: 'ac' },
  { icon: Wifi, key: 'wifi' },
  { icon: MonitorSmartphone, key: 'desk' },
  { icon: BatteryCharging, key: 'charging' },
  { icon: Cctv, key: 'cctv' },
];

const timings = [
  'Morning (6 AM - 12 PM)',
  'Afternoon (12 PM - 6 PM)',
  'Evening (6 PM - 10 PM)',
  'Full Day',
];

const classes = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Competitive Exams'];

const Library = () => {
  const { t } = useLanguage();
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
      toast.error('Please fill all fields');
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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('library.title')}</span>
            </h1>
            <p className="text-xl text-muted-foreground">{t('library.subtitle')}</p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto mb-12">
            <Card className="bg-gradient-hero text-white overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <p className="text-white/80 mb-2">Monthly Membership</p>
                <h2 className="text-5xl md:text-6xl font-bold mb-4">{t('library.pricing')}</h2>
                <p className="text-white/80">Unlimited access to all facilities</p>
              </CardContent>
            </Card>
          </div>

          {/* Facilities */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-center mb-8">Our Facilities</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {facilities.map((facility) => (
                <Card key={facility.key} className="card-hover">
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <facility.icon className="h-7 w-7 text-primary" />
                    </div>
                    <p className="font-medium">{t(`library.facility.${facility.key}`)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="max-w-2xl mx-auto mb-12">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-center">Why Choose Our Library?</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Peaceful study environment',
                    'High-speed internet',
                    'Extended hours (6 AM - 10 PM)',
                    'Competition books available',
                    'Separate reading zones',
                    'Flexible timings',
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enquiry Form */}
          <Card className="max-w-md mx-auto animate-scale-in">
            <CardHeader>
              <CardTitle className="text-center">{t('library.form.title')}</CardTitle>
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
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timing">{t('library.form.timing')}</Label>
                  <Select
                    value={formData.timing}
                    onValueChange={(value) => setFormData({ ...formData, timing: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timing" />
                    </SelectTrigger>
                    <SelectContent>
                      {timings.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
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
                  {isSubmitting ? t('common.loading') : t('library.form.submit')}
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

export default Library;
