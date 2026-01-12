import { useState } from 'react';
import { Pencil, BookMarked, Calculator, Ruler, Highlighter, ExternalLink, ArrowRight } from 'lucide-react';
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
  { icon: Pencil, name: 'Pens & Pencils', nameHi: 'पेन और पेंसिल' },
  { icon: BookMarked, name: 'Notebooks', nameHi: 'नोटबुक' },
  { icon: Calculator, name: 'Calculators', nameHi: 'कैलकुलेटर' },
  { icon: Ruler, name: 'Geometry Sets', nameHi: 'ज्योमेट्री सेट' },
  { icon: Highlighter, name: 'Highlighters', nameHi: 'हाइलाइटर' },
];

const Stationery = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    productInterest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">{t('stationery.title')}</span>
            </h1>
            <p className="text-xl text-muted-foreground">{t('stationery.subtitle')}</p>
          </div>

          {/* Product Categories */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
            {products.map((product, index) => (
              <Card key={index} className="card-hover">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <product.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <p className="font-medium text-sm">
                    {language === 'hi' ? product.nameHi : product.name}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shop Now CTA */}
          <div className="max-w-lg mx-auto mb-12">
            <Card className="bg-gradient-secondary text-white overflow-hidden">
              <CardContent className="p-8 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                
                <h3 className="text-2xl font-bold mb-4">Visit Our Store</h3>
                <p className="text-white/80 mb-6">
                  Quality stationery at the best prices. Visit us today!
                </p>
                <Button size="lg" variant="secondary" className="bg-white text-secondary hover:bg-white/90">
                  {t('stationery.btn')}
                  <ExternalLink className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enquiry Form */}
          <Card className="max-w-md mx-auto animate-scale-in">
            <CardHeader>
              <CardTitle className="text-center">{t('stationery.form.title')}</CardTitle>
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
                  <Label htmlFor="product">{t('stationery.form.product')}</Label>
                  <Select
                    value={formData.productInterest}
                    onValueChange={(value) => setFormData({ ...formData, productInterest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product category" />
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
                  className="w-full bg-gradient-secondary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('common.loading') : t('stationery.form.submit')}
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

export default Stationery;
