import { Link } from 'react-router-dom';
import { Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';

export const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <img src={logo} alt="Scope Express" className="h-12 w-auto brightness-0 invert" />
            <p className="text-background/70 text-sm">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-background/20 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/practice" className="text-background/70 hover:text-background transition-colors">{t('nav.practice')}</Link></li>
              <li><Link to="/career" className="text-background/70 hover:text-background transition-colors">{t('nav.career')}</Link></li>
              <li><Link to="/library" className="text-background/70 hover:text-background transition-colors">{t('nav.library')}</Link></li>
              <li><Link to="/stationery" className="text-background/70 hover:text-background transition-colors">{t('nav.stationery')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">{t('contact.title')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-background/70">
                <Phone className="h-4 w-4" />
                <a href="tel:+916265368438" className="hover:text-background transition-colors">
                  +91 62653 68438
                </a>
              </li>
              <li className="flex items-start gap-2 text-background/70">
                <MapPin className="h-4 w-4 mt-1" />
                <span>{t('contact.address.value')}</span>
              </li>
            </ul>
          </div>

          {/* Timings */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Library Timings</h4>
            <ul className="space-y-2 text-background/70 text-sm">
              <li>Monday - Saturday</li>
              <li className="font-medium text-background">6:00 AM - 10:00 PM</li>
              <li className="mt-2">Sunday</li>
              <li className="font-medium text-background">8:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60 text-sm">
          <p>© {currentYear} Scope Express. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};
