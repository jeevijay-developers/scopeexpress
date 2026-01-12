import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Gamepad2, ShoppingBag, ArrowRight, Star, Users, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: BookOpen,
      title: t('features.library.title'),
      desc: t('features.library.desc'),
      link: '/library',
      color: 'bg-primary',
    },
    {
      icon: GraduationCap,
      title: t('features.career.title'),
      desc: t('features.career.desc'),
      link: '/career',
      color: 'bg-secondary',
    },
    {
      icon: Gamepad2,
      title: t('features.practice.title'),
      desc: t('features.practice.desc'),
      link: '/practice',
      color: 'bg-accent',
    },
    {
      icon: ShoppingBag,
      title: t('features.stationery.title'),
      desc: t('features.stationery.desc'),
      link: '/stationery',
      color: 'bg-success',
    },
  ];

  const stats = [
    { icon: Users, value: '500+', label: 'Students Helped' },
    { icon: Trophy, value: '95%', label: 'Success Rate' },
    { icon: Star, value: '4.9', label: 'Rating' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              <span className="text-gradient">{t('hero.title')}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                <Link to="/library">
                  {t('hero.library.btn')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2">
                <Link to="/practice">
                  {t('hero.practice.btn')}
                  <Gamepad2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3 glass-card px-6 py-4 rounded-2xl">
                <stat.icon className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From study space to career guidance - we've got you covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link}>
                <Card className="h-full card-hover border-2 border-transparent hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of students who are already on their path to success with Scope Express
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg">
              <Link to="/practice">Start Free Practice</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white text-white hover:bg-white/20">
              <Link to="/contact">{t('contact.title')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
