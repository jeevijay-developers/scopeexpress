import { Link } from 'react-router-dom';
import { Phone, MapPin, Facebook, Instagram, Youtube, Mail, Clock, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/practice', label: t('nav.practice') },
    { path: '/career', label: t('nav.career') },
    { path: '/library', label: t('nav.library') },
    { path: '/stationery', label: t('nav.stationery') },
    { path: '/about', label: t('nav.about') },
    { path: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <img src={logo} alt="Scope Express" className="h-14 w-auto" />
            <p className="text-background/70 text-sm leading-relaxed">
              {language === 'hi' 
                ? 'प्रमुख educational hub। Library, Career Guidance, और Free Practice - सब एक जगह।'
                : 'Your premier educational hub. Library, Career Guidance, and Free Practice - all in one place.'}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2.5 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-background/10 hover:bg-pink-500 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-full bg-background/10 hover:bg-red-500 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Links'}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-background/70 hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full group-hover:bg-primary transition-colors"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t('contact.title')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-background/70">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-background/50">Call Us</p>
                  <a href="tel:+916265368438" className="hover:text-primary transition-colors font-medium">
                    +91 62653 68438
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-background/50">Email</p>
                  <a href="mailto:contact@scopeexpress.in" className="hover:text-primary transition-colors font-medium">
                    contact@scopeexpress.in
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <div className="w-10 h-10 bg-background/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-background/50">Address</p>
                  <span className="font-medium">{t('contact.address.value')}</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Timings & CTA */}
          <div>
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {language === 'hi' ? 'लाइब्रेरी समय' : 'Library Hours'}
            </h4>
            <div className="bg-background/5 rounded-xl p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-background/70 text-sm">Mon - Sat</span>
                <span className="font-semibold text-primary">6 AM - 10 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-background/70 text-sm">Sunday</span>
                <span className="font-semibold text-primary">8 AM - 8 PM</span>
              </div>
            </div>
            
            <Link 
              to="/library" 
              className="block w-full bg-primary text-primary-foreground text-center py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              {language === 'hi' ? 'Library Join करें' : 'Join Library'} →
            </Link>
            
            <p className="text-center text-background/50 text-sm mt-3">
              ₹600/month only
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm flex items-center gap-1">
              © {currentYear} Scope Express. {t('footer.rights')} 
              <Heart className="h-3 w-3 text-accent fill-accent inline mx-1" />
              {language === 'hi' ? 'प्यार से बनाया गया' : 'Made with love'}
            </p>
            <p className="text-background/60 text-sm">
              {language === 'hi' 
                ? 'मेदिनी कुमार जी द्वारा स्थापित (Marine Engineer | IIT JEE 2006)'
                : 'Founded by Medinee Kumar (Marine Engineer | IIT JEE 2006)'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
