import { useState } from 'react';
import { 
  Phone, MapPin, Clock, Mail, ArrowRight, MessageCircle, 
  Sparkles, Users, Star, CheckCircle, Send, Heart, Calendar,
  Building2, Headphones, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import medineeKumar from '@/assets/medinee-kumar.png';
import libraryInterior from '@/assets/library-interior.jpg';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile || !formData.message) {
      toast.error(language === 'hi' ? 'कृपया सभी फील्ड भरें' : 'Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        mobile: formData.mobile,
        message: formData.message,
        source_page: 'Contact',
        interest_type: 'General Enquiry',
      });

      if (error) throw error;

      toast.success(t('common.success'));
      setFormData({ name: '', mobile: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { 
      icon: Phone, 
      label: t('contact.phone'), 
      value: '+91 62653 68438', 
      href: 'tel:+916265368438',
      color: 'bg-primary',
      desc: language === 'hi' ? 'कॉल करें 6AM-10PM' : 'Call us 6AM-10PM'
    },
    { 
      icon: MessageCircle, 
      label: 'WhatsApp', 
      value: '+91 62653 68438', 
      href: 'https://wa.me/916265368438',
      color: 'bg-success',
      desc: language === 'hi' ? 'तुरंत जवाब पाएं' : 'Get instant reply'
    },
    { 
      icon: Mail, 
      label: 'Email', 
      value: 'contact@scopeexpress.in', 
      href: 'mailto:contact@scopeexpress.in',
      color: 'bg-secondary',
      desc: language === 'hi' ? '24 घंटे में जवाब' : 'Reply within 24hrs'
    },
    { 
      icon: MapPin, 
      label: t('contact.address'), 
      value: language === 'hi' ? 'अमरपाटन, सतना' : 'Amarpatan, Satna', 
      href: 'https://maps.google.com/?q=Amarpatan+Satna+MP',
      color: 'bg-accent',
      desc: language === 'hi' ? 'MP 485776' : 'MP 485776'
    },
  ];

  const openHours = [
    { day: language === 'hi' ? 'सोमवार - शनिवार' : 'Monday - Saturday', time: '6:00 AM - 10:00 PM' },
    { day: language === 'hi' ? 'रविवार' : 'Sunday', time: '8:00 AM - 8:00 PM' },
  ];

  const reasons = [
    { icon: Zap, text: language === 'hi' ? 'तुरंत जवाब' : 'Quick Response' },
    { icon: Users, text: language === 'hi' ? 'व्यक्तिगत ध्यान' : 'Personal Attention' },
    { icon: Heart, text: language === 'hi' ? 'मुफ्त परामर्श' : 'Free Consultation' },
    { icon: Star, text: language === 'hi' ? 'विशेषज्ञ मार्गदर्शन' : 'Expert Guidance' },
  ];

  const faqs = [
    {
      q: language === 'hi' ? 'लाइब्रेरी की फीस क्या है?' : 'What is the library fee?',
      a: language === 'hi' ? 'मासिक ₹500 से शुरू, AC सीट के लिए ₹800' : 'Starting from ₹500/month, ₹800 for AC seat'
    },
    {
      q: language === 'hi' ? 'कैरियर गाइडेंस फ्री है?' : 'Is career guidance free?',
      a: language === 'hi' ? 'पहला सेशन बिल्कुल फ्री! बाद में ₹299 प्रति सेशन' : 'First session absolutely free! ₹299/session after'
    },
    {
      q: language === 'hi' ? 'क्या ऑनलाइन गाइडेंस मिलती है?' : 'Do you provide online guidance?',
      a: language === 'hi' ? 'हाँ, वीडियो कॉल पर भी गाइडेंस उपलब्ध है' : 'Yes, guidance available via video call too'
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16 md:py-20">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-success/20 rounded-full blur-2xl animate-bounce-slow"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-bold">
                  {language === 'hi' ? '💬 हम हमेशा आपकी मदद के लिए तैयार!' : '💬 We are always ready to help!'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient">{t('contact.title')}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {language === 'hi' 
                  ? 'कोई भी सवाल? बस एक कॉल या मैसेज दूर है हमारी टीम!'
                  : 'Any questions? Our team is just a call or message away!'}
              </p>

              {/* Quick Contact Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <a 
                  href="tel:+916265368438" 
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <Phone className="h-5 w-5" />
                  {language === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
                </a>
                <a 
                  href="https://wa.me/916265368438" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-success text-success-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>
              </div>

              {/* Why Contact Pills */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {reasons.map((reason, i) => (
                  <div key={i} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
                    <reason.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{reason.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <img 
                src={libraryInterior} 
                alt="Scope Express Library" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-2xl shadow-lg animate-bounce-slow">
                <p className="font-bold">📍 Amarpatan</p>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-warning text-warning-foreground px-4 py-2 rounded-2xl shadow-lg animate-float">
                <p className="font-bold">⏰ 6AM - 10PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {contactInfo.map((info, index) => (
              <a 
                key={index} 
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="block"
              >
                <Card className="card-hover h-full text-center animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <info.icon className="h-7 w-7 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{info.label}</p>
                    <p className="font-bold">{info.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{info.desc}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="shadow-2xl animate-scale-in order-2 lg:order-1">
              <CardHeader className="text-center pb-2">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Send className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{t('contact.form.title')}</CardTitle>
                <p className="text-muted-foreground">
                  {language === 'hi' ? 'अपना सवाल भेजें, हम जल्द जवाब देंगे!' : 'Send your query, we will respond soon!'}
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
                      placeholder={language === 'hi' ? 'मोबाइल नंबर' : 'Enter mobile number'}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t('contact.form.message')} *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={language === 'hi' ? 'अपना सवाल या संदेश लिखें...' : 'Type your question or message...'}
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-primary text-lg font-semibold"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('common.loading') : (
                      <>
                        {t('contact.form.submit')} 🚀
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {language === 'hi' ? 'आपकी जानकारी सुरक्षित है' : 'Your information is secure'}
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Info Side */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Meet the Founder */}
              <Card className="overflow-hidden shadow-xl animate-fade-in">
                <CardContent className="p-0">
                  <div className="bg-gradient-hero p-6 text-white">
                    <div className="flex items-center gap-4">
                      <img 
                        src={medineeKumar} 
                        alt="Medinee Kumar" 
                        className="w-20 h-20 rounded-2xl object-cover border-2 border-white/30"
                      />
                      <div>
                        <p className="text-sm text-white/80 mb-1">
                          {language === 'hi' ? 'सीधे बात करें' : 'Talk directly with'}
                        </p>
                        <h3 className="text-xl font-bold">
                          {language === 'hi' ? 'मेदिनी कुमार जी' : 'Medinee Kumar Ji'}
                        </h3>
                        <p className="text-sm text-white/80">
                          {language === 'hi' ? 'संस्थापक | IIT मद्रास' : 'Founder | IIT Madras'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground mb-4">
                      {language === 'hi' 
                        ? 'कैरियर से जुड़े सवालों के लिए सीधे मेदिनी कुमार जी से बात करें। व्यक्तिगत मार्गदर्शन पाएं।'
                        : 'For career-related questions, talk directly with Medinee Kumar ji. Get personalized guidance.'}
                    </p>
                    <a 
                      href="https://wa.me/916265368438?text=नमस्ते%20मेदिनी%20जी,%20मुझे%20कैरियर%20गाइडेंस%20चाहिए"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      <MessageCircle className="h-4 w-4" />
                      {language === 'hi' ? 'WhatsApp पर संपर्क करें' : 'Contact on WhatsApp'}
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card className="shadow-xl animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <CardTitle>{language === 'hi' ? 'खुलने का समय' : 'Opening Hours'}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' ? 'हम आपके लिए हमेशा उपलब्ध' : 'We are always available for you'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {openHours.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                        <span className="font-medium">{item.day}</span>
                        <span className="text-primary font-bold">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FAQs */}
              <Card className="shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <CardTitle>{language === 'hi' ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked'}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {language === 'hi' ? 'जल्दी जवाब पाएं' : 'Get quick answers'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqs.map((faq, i) => (
                      <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                        <p className="font-medium mb-1">{faq.q}</p>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">
              {language === 'hi' ? '📍 हमें यहाँ खोजें' : '📍 Find Us Here'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'hi' ? 'Scope Express Library, अमरपाटन, सतना, MP 485776' : 'Scope Express Library, Amarpatan, Satna, MP 485776'}
            </p>
          </div>
          
          <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
                    <MapPin className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Scope Express Library</h3>
                  <p className="text-muted-foreground mb-4">Amarpatan, Satna, Madhya Pradesh 485776</p>
                  <a 
                    href="https://maps.google.com/?q=Amarpatan+Satna+MP+485776"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
                  >
                    <MapPin className="h-5 w-5" />
                    {language === 'hi' ? 'Google Maps पर देखें' : 'View on Google Maps'}
                  </a>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-bold">
                  🏢 {language === 'hi' ? 'मुख्य कार्यालय' : 'Main Office'}
                </div>
                <div className="absolute bottom-4 right-4 bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold">
                  🚗 {language === 'hi' ? 'फ्री पार्किंग' : 'Free Parking'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {language === 'hi' ? '🤝 आज ही संपर्क करें!' : '🤝 Get in Touch Today!'}
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-xl mx-auto">
            {language === 'hi' 
              ? 'कोई भी सवाल हो, हम यहाँ हैं आपकी मदद के लिए'
              : 'Whatever your question, we are here to help you'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="tel:+916265368438" 
              className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-white/90 transition-colors"
            >
              <Phone className="h-5 w-5" />
              +91 62653 68438
            </a>
            <a 
              href="https://wa.me/916265368438" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-colors border border-white/30"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
