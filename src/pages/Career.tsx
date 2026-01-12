import { useState, useMemo } from 'react';
import { 
  ArrowRight, CheckCircle, Star, Users, Award, Target, Zap, BookOpen, 
  GraduationCap, Search, Filter, Briefcase, Clock, TrendingUp, Building2,
  ChevronDown, ChevronUp, MapPin, DollarSign, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { careerPaths, CareerPath } from '@/data/careerData';
import medineeKumar from '@/assets/medinee-kumar.png';

const categoryLabels: Record<string, { en: string; hi: string; icon: string; color: string }> = {
  tech: { en: 'Technology', hi: 'टेक्नोलॉजी', icon: '💻', color: 'bg-blue-500' },
  engineering: { en: 'Engineering', hi: 'इंजीनियरिंग', icon: '⚙️', color: 'bg-orange-500' },
  medical: { en: 'Medical', hi: 'मेडिकल', icon: '⚕️', color: 'bg-red-500' },
  admin: { en: 'Administrative', hi: 'प्रशासनिक', icon: '🏛️', color: 'bg-amber-600' },
  defence: { en: 'Defence', hi: 'रक्षा', icon: '🛡️', color: 'bg-green-700' },
  commerce: { en: 'Commerce', hi: 'वाणिज्य', icon: '📊', color: 'bg-indigo-600' },
  law: { en: 'Law', hi: 'कानून', icon: '⚖️', color: 'bg-purple-600' },
  arts: { en: 'Arts & Creative', hi: 'कला एवं रचनात्मक', icon: '🎨', color: 'bg-pink-500' },
};

const classes = ['6', '7', '8', '9', '10', '11', '12'];

const Career = () => {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedCareer, setExpandedCareer] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    classLevel: '',
    careerInterest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter careers based on search and category
  const filteredCareers = useMemo(() => {
    return careerPaths.filter(career => {
      const matchesSearch = 
        career.en.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.hi.title.includes(searchQuery) ||
        career.en.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        career.exams.some(exam => exam.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || career.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Group careers by category
  const careersByCategory = useMemo(() => {
    const grouped: Record<string, CareerPath[]> = {};
    filteredCareers.forEach(career => {
      if (!grouped[career.category]) {
        grouped[career.category] = [];
      }
      grouped[career.category].push(career);
    });
    return grouped;
  }, [filteredCareers]);

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

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'bg-green-500';
      case 'High': return 'bg-blue-500';
      case 'Growing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

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
                  {language === 'hi' ? 'इंजीनियर मेंटर द्वारा मार्गदर्शन' : 'Guidance by Engineer Mentor'}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="text-gradient">{t('career.title')}</span>
              </h1>
              
              <p className="text-xl text-muted-foreground mb-6 animate-fade-in" style={{ animationDelay: '0.15s' }}>
                {language === 'hi' ? '30+ करियर पाथ्स में से अपना सही करियर खोजें' : 'Find your perfect career from 30+ career paths'}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Briefcase className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">30+</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'करियर' : 'Careers'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Users className="h-6 w-6 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'छात्र' : 'Students'}</p>
                </div>
                <div className="text-center p-4 bg-card rounded-xl shadow-sm">
                  <Star className="h-6 w-6 text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold">FREE</p>
                  <p className="text-xs text-muted-foreground">{language === 'hi' ? 'गाइडेंस' : 'Guidance'}</p>
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
                  <p className="text-sm opacity-90">Mechanical Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-muted/30 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={language === 'hi' ? 'करियर खोजें... (e.g., Software, Doctor, IAS)' : 'Search careers... (e.g., Software, Doctor, IAS)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="whitespace-nowrap"
              >
                {language === 'hi' ? 'सभी' : 'All'} ({careerPaths.length})
              </Button>
              {Object.entries(categoryLabels).map(([key, label]) => {
                const count = careerPaths.filter(c => c.category === key).length;
                return (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="whitespace-nowrap"
                  >
                    {label.icon} {language === 'hi' ? label.hi : label.en} ({count})
                  </Button>
                );
              })}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">
            {language === 'hi' 
              ? `${filteredCareers.length} करियर मिले`
              : `${filteredCareers.length} careers found`}
          </p>
        </div>
      </section>

      {/* Career Cards */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {Object.entries(careersByCategory).map(([category, careers]) => (
            <div key={category} className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 ${categoryLabels[category]?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center text-xl`}>
                  {categoryLabels[category]?.icon || '📌'}
                </div>
                <h2 className="text-2xl font-bold">
                  {language === 'hi' ? categoryLabels[category]?.hi : categoryLabels[category]?.en}
                </h2>
                <Badge variant="secondary">{careers.length}</Badge>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careers.map((career) => (
                  <Card 
                    key={career.id} 
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedCareer === career.id ? 'ring-2 ring-primary shadow-xl' : 'card-hover'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${career.color} rounded-xl flex items-center justify-center text-2xl`}>
                            {career.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {language === 'hi' ? career.hi.title : career.en.title}
                            </CardTitle>
                            <Badge className={`${getDemandColor(career.demandLevel)} text-white text-xs mt-1`}>
                              {career.demandLevel} Demand
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {language === 'hi' ? career.hi.description : career.en.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium">{career.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-primary" />
                          <span>{career.duration}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {career.exams.slice(0, 3).map((exam, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {exam}
                          </Badge>
                        ))}
                        {career.exams.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{career.exams.length - 3}
                          </Badge>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => setExpandedCareer(expandedCareer === career.id ? null : career.id)}
                      >
                        {expandedCareer === career.id ? (
                          <>
                            {language === 'hi' ? 'कम देखें' : 'Show Less'}
                            <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            {language === 'hi' ? 'विस्तार से देखें' : 'View Details'}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>

                      {/* Expanded Content */}
                      {expandedCareer === career.id && (
                        <div className="mt-4 pt-4 border-t space-y-4 animate-fade-in">
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-success" />
                              {language === 'hi' ? 'पात्रता' : 'Eligibility'}
                            </h4>
                            <p className="text-sm text-muted-foreground">{career.eligibility}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4 text-primary" />
                              {language === 'hi' ? 'करियर स्कोप' : 'Career Scope'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language === 'hi' ? career.hi.scope : career.en.scope}
                            </p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-secondary" />
                              {language === 'hi' ? 'जॉब रोल्स' : 'Job Roles'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.jobRoles.map((role, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-warning" />
                              {language === 'hi' ? 'टॉप कॉलेज' : 'Top Colleges'}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {career.topColleges.map((college, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {college}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-accent" />
                              {language === 'hi' ? 'वर्क-लाइफ' : 'Work-Life'}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {language === 'hi' ? career.hi.workLife : career.en.workLife}
                            </p>
                          </div>

                          <div className="pt-2">
                            <Button 
                              className="w-full bg-gradient-primary"
                              onClick={() => setFormData({ ...formData, careerInterest: career.en.title })}
                            >
                              {language === 'hi' ? 'इस करियर के लिए गाइडेंस लें' : 'Get Guidance for this Career'}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {filteredCareers.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {language === 'hi' ? 'कोई करियर नहीं मिला' : 'No careers found'}
              </h3>
              <p className="text-muted-foreground">
                {language === 'hi' ? 'अपनी खोज बदलकर देखें' : 'Try changing your search query'}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                {language === 'hi' ? 'फ़िल्टर हटाएं' : 'Clear Filters'}
              </Button>
            </div>
          )}
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
              { icon: Award, title: language === 'hi' ? 'मैकेनिकल इंजीनियर' : 'Mechanical Engineer', desc: language === 'hi' ? 'अनुभवी मेंटर' : 'Experienced Mentor' },
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
                <div>
                  <Label htmlFor="name">{t('common.name')}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === 'hi' ? 'अपना नाम लिखें' : 'Enter your name'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="mobile">{t('common.mobile')}</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10 digit mobile number"
                  />
                </div>

                <div>
                  <Label>{t('common.class')}</Label>
                  <Select 
                    value={formData.classLevel} 
                    onValueChange={(value) => setFormData({ ...formData, classLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'hi' ? 'कक्षा चुनें' : 'Select class'} />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls} value={cls}>Class {cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{language === 'hi' ? 'रुचि का करियर' : 'Career Interest'}</Label>
                  <Select 
                    value={formData.careerInterest} 
                    onValueChange={(value) => setFormData({ ...formData, careerInterest: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'hi' ? 'करियर चुनें' : 'Select career'} />
                    </SelectTrigger>
                    <SelectContent>
                      {careerPaths.map((career) => (
                        <SelectItem key={career.id} value={career.en.title}>
                          {career.icon} {language === 'hi' ? career.hi.title : career.en.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-secondary"
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? (language === 'hi' ? 'भेजा जा रहा है...' : 'Submitting...') 
                    : t('career.form.submit')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t text-center">
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {language === 'hi' ? '100% मुफ्त' : '100% Free'}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-success" />
                    {language === 'hi' ? 'व्यक्तिगत गाइडेंस' : 'Personal Guidance'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default Career;
