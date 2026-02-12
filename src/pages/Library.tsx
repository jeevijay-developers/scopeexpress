import { useState, useEffect } from 'react';
import { 
  Snowflake, Wifi, MonitorSmartphone, BatteryCharging, Cctv, ArrowRight, CheckCircle,
  Clock, Users, Star, MapPin, Phone, Sparkles, BookOpen, Coffee, Zap, Crown,
  Shield, Headphones, Lamp, Volume2, GraduationCap, ArrowLeft, Building2
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
import CitySearch from '@/components/library/CitySearch';
import LibraryCard from '@/components/library/LibraryCard';
import type { City } from '@/data/indianCities';

interface Library {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pin_code: string | null;
  phone: string | null;
  facilities: string[];
  timings: string;
  seats: number;
  price_per_month: number;
}

const facilities = [
  { icon: Snowflake, key: 'ac', desc: 'Full AC', color: 'bg-blue-500' },
  { icon: Wifi, key: 'wifi', desc: 'High-Speed WiFi', color: 'bg-green-500' },
  { icon: MonitorSmartphone, key: 'desk', desc: 'Personal Desk', color: 'bg-purple-500' },
  { icon: BatteryCharging, key: 'charging', desc: 'Power Points', color: 'bg-yellow-500' },
  { icon: Cctv, key: 'cctv', desc: '24/7 CCTV', color: 'bg-red-500' },
  { icon: Coffee, key: 'water', desc: 'Water & Tea', color: 'bg-orange-500' },
];

const timings = [
  'Morning (6 AM - 12 PM)',
  'Afternoon (12 PM - 6 PM)',
  'Evening (6 PM - 10 PM)',
  'Full Day',
];

const classes = ['6', '7', '8', '9', '10', '11', '12', 'College', 'Competitive Exams'];

const plans = [
  { name: 'Basic', price: '₹500', features: ['General Seating', 'WiFi Access', 'Locker', '6AM-6PM'] },
  { name: 'Standard', price: '₹700', features: ['AC Zone', 'WiFi + Power', 'Locker', '6AM-10PM'], popular: true },
  { name: 'Premium', price: '₹900', features: ['Private Cabin', 'All Amenities', 'Priority Support', '24/7 Access'] },
];

const Library = () => {
  const { t, language } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [isLoadingLibraries, setIsLoadingLibraries] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<Library | null>(null);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    classLevel: '',
    timing: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch libraries when city is selected
  useEffect(() => {
    if (selectedCity) {
      fetchLibraries(selectedCity.name);
    }
  }, [selectedCity]);

  const fetchLibraries = async (cityName: string) => {
    setIsLoadingLibraries(true);
    try {
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .eq('city', cityName)
        .eq('is_active', true);

      if (error) throw error;

      const parsedData = (data || []).map(lib => ({
        ...lib,
        facilities: Array.isArray(lib.facilities) ? (lib.facilities as string[]) : [],
      }));

      setLibraries(parsedData);
    } catch (error) {
      console.error('Error fetching libraries:', error);
      toast.error('Failed to fetch libraries');
    } finally {
      setIsLoadingLibraries(false);
    }
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setSelectedLibrary(null);
    setShowEnquiryForm(false);
  };

  const handleJoinClick = (library: Library) => {
    setSelectedLibrary(library);
    setShowEnquiryForm(true);
    // Scroll to form
    setTimeout(() => {
      document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToSearch = () => {
    setSelectedCity(null);
    setLibraries([]);
    setSelectedLibrary(null);
    setShowEnquiryForm(false);
  };

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
        city: selectedCity?.name || null,
        library_id: selectedLibrary?.id || null,
      });

      if (error) throw error;

      toast.success(t('common.success'));
      setFormData({ name: '', mobile: '', classLevel: '', timing: '' });
      setShowEnquiryForm(false);
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

  const stats = [
    { value: '100+', label: language === 'hi' ? 'सीटें' : 'Seats' },
    { value: '16hrs', label: language === 'hi' ? 'खुला' : 'Open' },
    { value: '500+', label: language === 'hi' ? 'स्टूडेंट्स' : 'Students' },
    { value: '#1', label: language === 'hi' ? 'रेटिंग' : 'Rating' },
  ];

  return (
    <Layout>
      {/* Hero Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={libraryInterior} alt="Library" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/80 to-foreground/60"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 text-6xl animate-float hidden md:block">📚</div>
        <div className="absolute bottom-20 right-40 text-5xl animate-float hidden md:block" style={{ animationDelay: '0.5s' }}>✨</div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Crown className="h-4 w-4 text-warning" />
              <span className="text-sm font-bold">
                {language === 'hi' ? '🏆 अमरपाटन की #1 Library' : '🏆 #1 Library in Amarpatan'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('library.title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.15s' }}>
              {language === 'hi' 
                ? 'AC Environment • Personal Desk • High-Speed WiFi • शांत माहौल में पढ़ाई करें!'
                : 'AC Environment • Personal Desk • High-Speed WiFi • Study in peaceful environment!'}
            </p>
            
            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {stats.map((stat, i) => (
                <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-2xl md:text-3xl font-black text-primary">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <Button 
                size="lg" 
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg rounded-2xl shadow-lg"
                onClick={() => document.getElementById('city-search')?.scrollIntoView({ behavior: 'smooth' })}
              >
                {language === 'hi' ? 'अभी Join करें' : 'Join Now'} 
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl border-white/30 text-white hover:bg-white/10">
                <Phone className="mr-2 h-5 w-5" />
                +91 62653 68438
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* City Search Section */}
      <section id="city-search" className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {!selectedCity ? (
            <CitySearch onCitySelect={handleCitySelect} language={language} />
          ) : (
            <div className="space-y-8">
              {/* Back button and city info */}
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleBackToSearch} className="rounded-xl">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {language === 'hi' ? 'दूसरा शहर चुनें' : 'Change City'}
                </Button>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-lg">{selectedCity.name}, {selectedCity.state}</span>
                </div>
              </div>

              {/* Libraries List */}
              {isLoadingLibraries ? (
                <div className="text-center py-12">
                  <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">
                    {language === 'hi' ? 'Libraries खोज रहे हैं...' : 'Finding libraries...'}
                  </p>
                </div>
              ) : libraries.length > 0 ? (
                <div>
                  <h3 className="text-xl font-bold mb-6">
                    {language === 'hi' 
                      ? `${selectedCity.name} में ${libraries.length} Libraries मिलीं`
                      : `Found ${libraries.length} Libraries in ${selectedCity.name}`}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.map((library) => (
                      <LibraryCard
                        key={library.id}
                        library={library}
                        onJoinClick={handleJoinClick}
                        language={language}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <Card className="max-w-lg mx-auto text-center">
                  <CardContent className="pt-12 pb-8">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-bold mb-2">
                      {language === 'hi' ? 'जल्द आ रहा है!' : 'Coming Soon!'}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {language === 'hi' 
                        ? `${selectedCity.name} में अभी कोई library नहीं है। लेकिन जल्द ही आ रहा है!`
                        : `No library in ${selectedCity.name} yet. But we're expanding soon!`}
                    </p>
                    <Button onClick={() => setShowEnquiryForm(true)}>
                      {language === 'hi' ? 'मुझे सूचित करें' : 'Notify Me'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            {language === 'hi' ? '✨ प्रीमियम सुविधाएं' : '✨ Premium Facilities'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {language === 'hi' ? 'सबकुछ जो आपको पढ़ाई में चाहिए' : 'Everything you need for focused study'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {facilities.map((facility, i) => (
              <Card key={i} className="text-center card-hover animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <CardContent className="p-6">
                  <div className={`w-16 h-16 ${facility.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <facility.icon className="h-8 w-8 text-white" />
                  </div>
                  <p className="font-bold">{t(`library.facility.${facility.key}`)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{facility.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">
            {language === 'hi' ? '💰 मेम्बरशिप प्लान' : '💰 Membership Plans'}
          </h2>
          <p className="text-center text-muted-foreground mb-10">
            {language === 'hi' ? 'अपनी जरूरत के हिसाब से प्लान चुनें' : 'Choose a plan that fits your needs'}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <Card 
                key={i} 
                className={`relative overflow-hidden animate-fade-in ${
                  plan.popular ? 'border-2 border-primary shadow-xl scale-105' : ''
                }`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-sm font-bold rounded-bl-xl">
                    POPULAR
                  </div>
                )}
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-4xl font-black text-primary mb-4">{plan.price}<span className="text-sm text-muted-foreground font-normal">/month</span></p>
                  
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-primary' : ''}`} 
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => document.getElementById('city-search')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {language === 'hi' ? 'चुनें' : 'Select'}
                  </Button>
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
            <div className="order-2 lg:order-1">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                {language === 'hi' ? '📚 हमारी Library क्यों?' : '📚 Why Our Library?'}
              </h2>
              
              <div className="grid gap-4">
                {[
                  { icon: Snowflake, title: language === 'hi' ? 'पूर्ण AC माहौल' : 'Full AC Environment', desc: language === 'hi' ? 'गर्मी में भी ठंडा और आरामदायक' : 'Cool and comfortable even in summer' },
                  { icon: Lamp, title: language === 'hi' ? 'अच्छी रोशनी' : 'Proper Lighting', desc: language === 'hi' ? 'आंखों पर कम stress' : 'Less strain on eyes' },
                  { icon: Volume2, title: language === 'hi' ? 'शांत वातावरण' : 'Silent Environment', desc: language === 'hi' ? 'कोई distraction नहीं' : 'No distractions' },
                  { icon: Shield, title: language === 'hi' ? '24/7 सुरक्षा' : '24/7 Security', desc: language === 'hi' ? 'CCTV और guard' : 'CCTV and guards' },
                  { icon: GraduationCap, title: language === 'hi' ? 'Competition Books' : 'Competition Books', desc: language === 'hi' ? 'JEE, NEET, UPSC की किताबें' : 'JEE, NEET, UPSC books available' },
                  { icon: Headphones, title: language === 'hi' ? 'Online Classes' : 'Online Classes', desc: language === 'hi' ? 'High-speed WiFi' : 'High-speed WiFi' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-2xl shadow-sm animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative order-1 lg:order-2">
              <img 
                src={heroStudents} 
                alt="Students in library" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <img src={medineeKumar} alt="Medinee Kumar" className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <p className="font-bold">Medinee Kumar</p>
                    <p className="text-xs text-muted-foreground">Founder</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-warning text-warning" />)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-2xl shadow-lg animate-float">
                <p className="font-bold text-sm">🎯 Focus Zone</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry-form" className="py-12 md:py-16 bg-gradient-to-r from-primary/10 via-accent/5 to-secondary/10">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto shadow-2xl animate-scale-in">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl">{t('library.form.title')}</CardTitle>
              <p className="text-muted-foreground mt-2">
                {language === 'hi' ? '🎯 आज ही अपनी seat book करें!' : '🎯 Book your seat today!'}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pre-filled City & Library Name */}
                {(selectedCity || selectedLibrary) && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-xl border border-border">
                    {selectedCity && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{language === 'hi' ? 'शहर' : 'City'}</Label>
                        <div className="flex items-center gap-2 bg-background px-3 py-2.5 rounded-lg border">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-sm">{selectedCity.name}, {selectedCity.state}</span>
                        </div>
                      </div>
                    )}
                    {selectedLibrary && (
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">{language === 'hi' ? 'लाइब्रेरी' : 'Library'}</Label>
                        <div className="flex items-center gap-2 bg-background px-3 py-2.5 rounded-lg border">
                          <Building2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="font-medium text-sm">{selectedLibrary.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">{t('common.name')} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                    className="h-12 rounded-xl"
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
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">{t('common.class')} *</Label>
                  <Select
                    value={formData.classLevel}
                    onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
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
                    <SelectTrigger className="h-12 rounded-xl">
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
                  className="w-full h-14 bg-gradient-to-r from-primary to-accent text-lg font-bold rounded-xl shadow-lg"
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
                  {language === 'hi' ? '✅ हम जल्द ही आपसे संपर्क करेंगे' : '✅ We will contact you shortly'}
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
