import { useState } from 'react';
import { 
  Pencil, BookMarked, Calculator, Ruler, Highlighter, ExternalLink, ArrowRight,
  Star, Truck, Tag, ShieldCheck, Clock, Gift, Sparkles, ChevronRight,
  Package, CheckCircle, Zap, Heart
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

const products = [
  { icon: Pencil, name: 'Pens & Pencils', nameHi: 'पेन और पेंसिल', price: '₹10+', color: 'bg-primary', popular: true },
  { icon: BookMarked, name: 'Notebooks', nameHi: 'नोटबुक', price: '₹30+', color: 'bg-success', popular: true },
  { icon: Calculator, name: 'Calculators', nameHi: 'कैलकुलेटर', price: '₹150+', color: 'bg-secondary', popular: false },
  { icon: Ruler, name: 'Geometry Sets', nameHi: 'ज्योमेट्री सेट', price: '₹50+', color: 'bg-accent', popular: false },
  { icon: Highlighter, name: 'Highlighters', nameHi: 'हाइलाइटर', price: '₹20+', color: 'bg-warning', popular: true },
  { icon: Package, name: 'Exam Kits', nameHi: 'परीक्षा किट', price: '₹99+', color: 'bg-primary', popular: true },
];

const features = [
  { icon: Tag, text: 'Best Prices', textHi: 'सबसे कम दाम', desc: 'Wholesale rates for students' },
  { icon: ShieldCheck, text: 'Quality Products', textHi: 'क्वालिटी प्रोडक्ट्स', desc: 'Branded & trusted items' },
  { icon: Truck, text: 'Home Delivery', textHi: 'होम डिलीवरी', desc: 'Free delivery above ₹500' },
  { icon: Gift, text: 'Student Offers', textHi: 'स्टूडेंट ऑफर्स', desc: 'Special discounts' },
];

const testimonials = [
  { name: 'Rahul Sharma', class: 'Class 12', text: 'Best quality pens at lowest price!', rating: 5 },
  { name: 'Priya Singh', class: 'Class 10', text: 'My go-to shop for all stationery needs.', rating: 5 },
  { name: 'Amit Kumar', class: 'B.Sc', text: 'Genuine products and great service!', rating: 4 },
];

const Stationery = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    productInterest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STORE_URL = "https://bizgrow360.com/s/scope-express-7c1ce756-c92e-4548-bd75-b6f85f9ced4e";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) {
      toast.error('Please fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert({
        name: formData.name,
        mobile: formData.mobile,
        source_page: 'Stationery',
        interest_type: 'Product Enquiry',
        product_interest: formData.productInterest,
      });

      if (error) throw error;

      toast.success(t('common.success'));
      setFormData({ name: '', mobile: '', productInterest: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-secondary/10 via-primary/5 to-accent/10 py-16 md:py-24">
        {/* Animated Background */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-bounce-slow"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-20 right-20 text-5xl animate-float">✏️</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float" style={{ animationDelay: '0.5s' }}>📒</div>
        <div className="absolute top-1/3 right-1/4 text-3xl animate-bounce-slow">📐</div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full mb-6 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">
                {language === 'hi' ? '🎉 स्पेशल स्टूडेंट डिस्काउंट!' : '🎉 Special Student Discount!'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <span className="text-gradient">{t('stationery.title')}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {language === 'hi' 
                ? 'सभी स्टेशनरी आइटम्स एक ही जगह - बेस्ट क्वालिटी, बेस्ट प्राइस!'
                : 'All stationery items in one place - Best quality, Best prices!'}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-card px-6 py-3 rounded-2xl shadow-lg">
                <p className="text-2xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">{language === 'hi' ? 'प्रोडक्ट्स' : 'Products'}</p>
              </div>
              <div className="bg-card px-6 py-3 rounded-2xl shadow-lg">
                <p className="text-2xl font-bold text-success">20%</p>
                <p className="text-sm text-muted-foreground">{language === 'hi' ? 'डिस्काउंट' : 'Discount'}</p>
              </div>
              <div className="bg-card px-6 py-3 rounded-2xl shadow-lg">
                <p className="text-2xl font-bold text-secondary">Free</p>
                <p className="text-sm text-muted-foreground">{language === 'hi' ? 'डिलीवरी' : 'Delivery'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <a 
                href={STORE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-secondary to-primary text-lg rounded-2xl shadow-lg hover:scale-105 transition-transform">
                  {language === 'hi' ? 'अभी खरीदें' : 'Shop Now'}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a 
                href={STORE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-2xl hover:scale-105 transition-transform">
                  {language === 'hi' ? 'कैटलॉग देखें' : 'View Catalog'}
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-muted/30 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-3 justify-center animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold">{language === 'hi' ? feature.textHi : feature.text}</p>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === 'hi' ? '🛒 हमारे प्रोडक्ट्स' : '🛒 Our Products'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {language === 'hi' ? 'हर जरूरत के लिए बेस्ट स्टेशनरी' : 'Best stationery for every need'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {products.map((product, index) => (
              <a
                key={index}
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Card 
                  className="card-hover cursor-pointer relative overflow-hidden transition-all duration-300 hover:ring-2 hover:ring-primary group"
                >
                  {product.popular && (
                    <div className="absolute top-2 right-2 bg-warning text-warning-foreground text-xs px-2 py-1 rounded-full font-bold">
                      HOT
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${product.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                      <product.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="font-bold mb-1">
                      {language === 'hi' ? product.nameHi : product.name}
                    </p>
                    <p className="text-primary font-semibold text-lg">{product.price}</p>
                    <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {language === 'hi' ? 'खरीदने के लिए क्लिक करें →' : 'Click to buy →'}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers Banner */}
      <section className="py-12 bg-gradient-to-r from-secondary via-primary to-accent text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/20 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Zap className="h-4 w-4" />
              <span className="font-bold">{language === 'hi' ? 'लिमिटेड टाइम ऑफर!' : 'Limited Time Offer!'}</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {language === 'hi' ? 'एग्जाम किट स्पेशल' : 'Exam Kit Special'}
            </h2>
            
            <p className="text-xl text-white/90 mb-6">
              {language === 'hi' 
                ? 'पेन + पेंसिल + रबर + स्केल + शार्पनर - सब एक किट में!'
                : 'Pen + Pencil + Eraser + Scale + Sharpener - All in one kit!'}
            </p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-2xl line-through text-white/60">₹150</span>
              <span className="text-5xl font-black">₹99</span>
              <span className="bg-warning text-warning-foreground px-3 py-1 rounded-full text-sm font-bold">
                {language === 'hi' ? '34% बचत' : 'Save 34%'}
              </span>
            </div>
            
            <a 
              href={STORE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90 rounded-2xl shadow-xl hover:scale-105 transition-transform">
                {language === 'hi' ? 'अभी खरीदें' : 'Buy Now'}
                <ExternalLink className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'hi' ? '⭐ ग्राहकों की राय' : '⭐ Customer Reviews'}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold text-primary">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.class}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Store CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10 border-2 border-primary/20 overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-bold mb-4">
                    {language === 'hi' ? '🏪 हमारी दुकान पर आएं!' : '🏪 Visit Our Store!'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === 'hi' 
                      ? 'सभी प्रोडक्ट्स देखें और बेस्ट डील पाएं। स्टूडेंट आईडी पर एक्स्ट्रा डिस्काउंट!'
                      : 'See all products and get best deals. Extra discount on Student ID!'}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>{language === 'hi' ? '500+ प्रोडक्ट्स उपलब्ध' : '500+ products available'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>{language === 'hi' ? 'स्टूडेंट डिस्काउंट' : 'Student discount'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <span>{language === 'hi' ? 'सभी ब्रांड्स' : 'All brands'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="h-5 w-5" />
                    <span>{language === 'hi' ? 'सोम-शनि: 9 AM - 8 PM' : 'Mon-Sat: 9 AM - 8 PM'}</span>
                  </div>
                </div>
                
                {/* Enquiry Form */}
                <Card className="shadow-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl text-center">{t('stationery.form.title')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('common.name')} *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={language === 'hi' ? 'अपना नाम' : 'Your name'}
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
                        <Label htmlFor="product">{t('stationery.form.product')}</Label>
                        <Select
                          value={formData.productInterest}
                          onValueChange={(value) => setFormData({ ...formData, productInterest: value })}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder={language === 'hi' ? 'प्रोडक्ट चुनें' : 'Select product'} />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.name} value={product.name}>
                                {language === 'hi' ? product.nameHi : product.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-secondary to-primary text-lg font-bold rounded-xl"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? t('common.loading') : (
                          <>
                            {t('stationery.form.submit')} 🚀
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </>
                        )}
                      </Button>
                      
                      <div className="text-center mt-4">
                        <span className="text-sm text-muted-foreground">{language === 'hi' ? 'या सीधे खरीदें' : 'Or buy directly'}</span>
                      </div>
                      
                      <a 
                        href={STORE_URL} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-14 text-lg font-bold rounded-xl border-2 border-primary hover:bg-primary/10"
                          size="lg"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          {language === 'hi' ? 'स्टोर पर जाएं' : 'Visit Store'}
                        </Button>
                      </a>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Floating Store CTA */}
      <a 
        href={STORE_URL} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <Button 
          size="lg" 
          className="h-14 px-6 bg-gradient-to-r from-secondary to-primary text-lg rounded-full shadow-2xl hover:scale-105 transition-transform animate-pulse"
        >
          🛒 {language === 'hi' ? 'खरीदें' : 'Shop'}
        </Button>
      </a>
    </Layout>
  );
};

export default Stationery;
