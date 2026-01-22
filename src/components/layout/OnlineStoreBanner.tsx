import { ExternalLink, ShoppingCart, Sparkles, Package, Truck } from 'lucide-react';

const STORE_URL = "https://bizgrow360.com/s/scope-express-7c1ce756-c92e-4548-bd75-b6f85f9ced4e";

interface OnlineStoreBannerProps {
  variant?: 'full' | 'compact' | 'floating';
  language?: 'en' | 'hi';
}

export const OnlineStoreBanner = ({ variant = 'full', language = 'en' }: OnlineStoreBannerProps) => {
  if (variant === 'floating') {
    return (
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 right-4 z-50 flex items-center gap-2 bg-gradient-to-r from-success to-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl animate-bounce-slow hover:scale-110 transition-transform md:hidden"
      >
        <ShoppingCart className="h-5 w-5" />
        <span className="font-bold text-sm">
          {language === 'hi' ? 'ऑनलाइन शॉप' : 'Shop Online'}
        </span>
      </a>
    );
  }

  if (variant === 'compact') {
    return (
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-success via-emerald-500 to-teal-500 py-2 px-4 hover:opacity-95 transition-opacity"
      >
        <div className="container mx-auto flex items-center justify-center gap-3 text-white text-sm font-medium">
          <div className="flex items-center gap-2 animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>{language === 'hi' ? '🛒 ऑनलाइन ऑर्डर स्वीकार करते हैं!' : '🛒 We Accept Online Orders!'}</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:flex items-center gap-1">
            <Truck className="h-4 w-4" />
            {language === 'hi' ? 'होम डिलीवरी उपलब्ध' : 'Home Delivery Available'}
          </span>
          <ExternalLink className="h-4 w-4 ml-2" />
        </div>
      </a>
    );
  }

  // Full banner
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-success via-emerald-500 to-teal-500 py-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <a
          href={STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col md:flex-row items-center justify-center gap-4 text-white group"
        >
          {/* Blinking badge */}
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold">
              {language === 'hi' ? '🛒 ऑनलाइन स्टोर' : '🛒 ONLINE STORE'}
            </span>
          </div>

          {/* Main message */}
          <div className="text-center md:text-left">
            <p className="text-lg md:text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
              <span className="inline-block animate-bounce" style={{ animationDuration: '1s' }}>🎉</span>
              {language === 'hi' 
                ? 'हम ऑनलाइन ऑर्डर स्वीकार करते हैं!'
                : 'We Accept Online Orders!'}
            </p>
            <p className="text-sm text-white/90 flex items-center gap-3 justify-center md:justify-start">
              <span className="flex items-center gap-1">
                <Package className="h-4 w-4" />
                500+ Products
              </span>
              <span className="flex items-center gap-1">
                <Truck className="h-4 w-4" />
                {language === 'hi' ? 'होम डिलीवरी' : 'Home Delivery'}
              </span>
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-2 bg-white text-success px-6 py-3 rounded-full font-bold group-hover:scale-105 transition-transform shadow-lg">
            <span>{language === 'hi' ? 'स्टोर पर जाएं' : 'Visit Store'}</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </a>
      </div>
    </section>
  );
};

export default OnlineStoreBanner;
