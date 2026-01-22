import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { OnlineStoreBanner } from './OnlineStoreBanner';
import { useLanguage } from '@/contexts/LanguageContext';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export const Layout = ({ children, hideFooter = false }: LayoutProps) => {
  const { language } = useLanguage();
  const location = useLocation();
  
  // Show store banner on all pages except stationery (it has its own store integration)
  const showStoreBanner = !location.pathname.includes('/stationery') && !location.pathname.includes('/admin');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      {showStoreBanner && <OnlineStoreBanner variant="compact" language={language} />}
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <OnlineStoreBanner variant="floating" language={language} />
    </div>
  );
};
