import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.practice': 'Free Practice',
    'nav.career': 'Career Guidance',
    'nav.library': 'Library',
    'nav.stationery': 'Stationery',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'nav.mocktest': 'Mock Test',
    
    // Hero Section
    'hero.title': 'Your Future Needs Direction, Not Confusion',
    'hero.subtitle': 'Padhai • Practice • Career Guidance – Sab Ek Jagah',
    'hero.library.btn': 'Join Library @ ₹600/Month',
    'hero.practice.btn': 'Free Practice & Quizzes',
    
    // Features
    'features.library.title': 'Physical Library',
    'features.library.desc': 'AC, Wi-Fi, Individual Desk & peaceful environment',
    'features.career.title': 'Career Guidance',
    'features.career.desc': 'Expert guidance for your dream career',
    'features.practice.title': 'Free Practice',
    'features.practice.desc': 'Gamified quizzes to boost your learning',
    'features.stationery.title': 'Stationery',
    'features.stationery.desc': 'Quality stationery at best prices',
    
    // Practice Page
    'practice.title': 'Free Practice Zone',
    'practice.subtitle': 'Play, Learn, Grow',
    'practice.form.title': 'Enter Your Details to Start',
    'practice.form.name': 'Student Name',
    'practice.form.mobile': 'Mobile Number',
    'practice.form.class': 'Class',
    'practice.form.school': 'School Name',
    'practice.form.submit': 'Start Practice',
    'practice.form.note': 'No login required. Free for all students.',
    
    // Topics
    'topic.reasoning': 'Reasoning Practice',
    'topic.history': 'History Questions',
    'topic.maths': 'Maths Basics',
    'topic.science': 'Science',
    'topic.gk': 'General Knowledge',
    
    // Quiz
    'quiz.question': 'Question',
    'quiz.score': 'Score',
    'quiz.level': 'Level',
    'quiz.correct': 'Correct!',
    'quiz.wrong': 'Try Again!',
    'quiz.complete.title': 'Quiz Complete!',
    'quiz.complete.attempted': 'Questions Attempted',
    'quiz.complete.correct': 'Correct Answers',
    'quiz.complete.score': 'Final Score',
    'quiz.complete.level': 'Level Achieved',
    'quiz.btn.more': 'Practice More',
    'quiz.btn.career': 'Career Guidance',
    'quiz.btn.library': 'Join Library',
    
    // Levels
    'level.beginner': 'Beginner',
    'level.learner': 'Learner',
    'level.performer': 'Performer',
    'level.champion': 'Champion',
    
    // Career Page
    'career.title': 'Career Guidance',
    'career.subtitle': 'Which Career to Choose? Understand Here',
    'career.engineering': 'Engineering',
    'career.medical': 'Medical',
    'career.admin': 'Administrative Services',
    'career.defence': 'Defence & Others',
    'career.form.title': 'Request Career Guidance',
    'career.form.interest': 'Career Interested In',
    'career.form.submit': 'Request Guidance',
    
    // Library Page
    'library.title': 'Library',
    'library.subtitle': 'Where Study Happens Automatically',
    'library.pricing': '₹600 / Month',
    'library.facility.ac': 'AC',
    'library.facility.wifi': 'Wi-Fi',
    'library.facility.desk': 'Individual Desk',
    'library.facility.charging': 'Charging',
    'library.facility.cctv': 'CCTV',
    'library.form.title': 'Library Enquiry',
    'library.form.timing': 'Preferred Timing',
    'library.form.submit': 'Enquire Now',
    
    // Stationery Page
    'stationery.title': 'Stationery',
    'stationery.subtitle': 'Quality Stationery for Students',
    'stationery.btn': 'Shop Now',
    'stationery.form.title': 'Product Enquiry',
    'stationery.form.product': 'Product Interest',
    'stationery.form.submit': 'Submit Enquiry',
    
    // About Page
    'about.title': 'About Us',
    'about.story.title': 'Our Story',
    'about.story.content': 'From Amarpatan to Global Experience - our journey began with a dream to bring quality education to every student in our society. Now, we bring that same experience to help local students shape their future.',
    'about.mission.title': 'Our Mission',
    'about.mission.content': 'To provide accessible, quality educational support to students in our society and surrounding areas.',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.phone': 'Phone',
    'contact.address': 'Address',
    'contact.address.value': 'Amarpatan, Satna, MP',
    'contact.form.title': 'Send us a Message',
    'contact.form.message': 'Your Message',
    'contact.form.submit': 'Send Message',
    
    // Common
    'common.name': 'Name',
    'common.mobile': 'Mobile Number',
    'common.class': 'Class',
    'common.school': 'School Name',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.success': 'Success!',
    'common.error': 'Error occurred. Please try again.',
    
    // Footer
    'footer.rights': 'All rights reserved.',
    'footer.tagline': 'Empowering Students',
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.practice': 'फ्री प्रैक्टिस',
    'nav.career': 'करियर गाइडेंस',
    'nav.library': 'लाइब्रेरी',
    'nav.stationery': 'स्टेशनरी',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.admin': 'एडमिन',
    'nav.mocktest': 'मॉक टेस्ट',
    
    // Hero Section
    'hero.title': 'आपके भविष्य को दिशा चाहिए, भ्रम नहीं',
    'hero.subtitle': 'पढ़ाई • प्रैक्टिस • करियर गाइडेंस – सब एक जगह',
    'hero.library.btn': 'लाइब्रेरी ज्वाइन करें @ ₹600/महीना',
    'hero.practice.btn': 'फ्री प्रैक्टिस और क्विज़',
    
    // Features
    'features.library.title': 'फिजिकल लाइब्रेरी',
    'features.library.desc': 'AC, Wi-Fi, इंडिविजुअल डेस्क और शांत माहौल',
    'features.career.title': 'करियर गाइडेंस',
    'features.career.desc': 'आपके सपनों के करियर के लिए एक्सपर्ट गाइडेंस',
    'features.practice.title': 'फ्री प्रैक्टिस',
    'features.practice.desc': 'गेमिफाइड क्विज़ से बढ़ाएं अपनी लर्निंग',
    'features.stationery.title': 'स्टेशनरी',
    'features.stationery.desc': 'बेस्ट प्राइस पर क्वालिटी स्टेशनरी',
    
    // Practice Page
    'practice.title': 'फ्री प्रैक्टिस ज़ोन',
    'practice.subtitle': 'खेलो, सीखो, आगे बढ़ो',
    'practice.form.title': 'शुरू करने के लिए अपनी जानकारी दें',
    'practice.form.name': 'छात्र का नाम',
    'practice.form.mobile': 'मोबाइल नंबर',
    'practice.form.class': 'कक्षा',
    'practice.form.school': 'स्कूल का नाम',
    'practice.form.submit': 'प्रैक्टिस शुरू करें',
    'practice.form.note': 'लॉगिन की जरूरत नहीं। सभी छात्रों के लिए फ्री।',
    
    // Topics
    'topic.reasoning': 'रीज़निंग प्रैक्टिस',
    'topic.history': 'इतिहास के प्रश्न',
    'topic.maths': 'गणित बेसिक्स',
    'topic.science': 'विज्ञान',
    'topic.gk': 'सामान्य ज्ञान',
    
    // Quiz
    'quiz.question': 'प्रश्न',
    'quiz.score': 'स्कोर',
    'quiz.level': 'लेवल',
    'quiz.correct': 'सही जवाब!',
    'quiz.wrong': 'फिर से कोशिश करें!',
    'quiz.complete.title': 'क्विज़ पूरा!',
    'quiz.complete.attempted': 'प्रश्न अटेम्प्ट किए',
    'quiz.complete.correct': 'सही जवाब',
    'quiz.complete.score': 'फाइनल स्कोर',
    'quiz.complete.level': 'लेवल प्राप्त',
    'quiz.btn.more': 'और प्रैक्टिस करें',
    'quiz.btn.career': 'करियर गाइडेंस',
    'quiz.btn.library': 'लाइब्रेरी ज्वाइन करें',
    
    // Levels
    'level.beginner': 'बिगिनर',
    'level.learner': 'लर्नर',
    'level.performer': 'परफॉर्मर',
    'level.champion': 'चैंपियन',
    
    // Career Page
    'career.title': 'करियर गाइडेंस',
    'career.subtitle': 'करियर कौनसा चुनें? यहाँ समझो',
    'career.engineering': 'इंजीनियरिंग',
    'career.medical': 'मेडिकल',
    'career.admin': 'प्रशासनिक सेवाएं',
    'career.defence': 'डिफेंस और अन्य',
    'career.form.title': 'करियर गाइडेंस के लिए अनुरोध',
    'career.form.interest': 'किस करियर में रुचि है',
    'career.form.submit': 'गाइडेंस के लिए अनुरोध',
    
    // Library Page
    'library.title': 'लाइब्रेरी',
    'library.subtitle': 'जहाँ पढ़ाई ऑटोमैटिकली होती है',
    'library.pricing': '₹600 / महीना',
    'library.facility.ac': 'AC',
    'library.facility.wifi': 'Wi-Fi',
    'library.facility.desk': 'इंडिविजुअल डेस्क',
    'library.facility.charging': 'चार्जिंग',
    'library.facility.cctv': 'CCTV',
    'library.form.title': 'लाइब्रेरी एनक्वायरी',
    'library.form.timing': 'पसंदीदा समय',
    'library.form.submit': 'एनक्वायरी करें',
    
    // Stationery Page
    'stationery.title': 'स्टेशनरी',
    'stationery.subtitle': 'छात्रों के लिए क्वालिटी स्टेशनरी',
    'stationery.btn': 'अभी खरीदें',
    'stationery.form.title': 'प्रोडक्ट एनक्वायरी',
    'stationery.form.product': 'प्रोडक्ट में रुचि',
    'stationery.form.submit': 'एनक्वायरी सबमिट करें',
    
    // About Page
    'about.title': 'हमारे बारे में',
    'about.story.title': 'हमारी कहानी',
    'about.story.content': 'अमरपाटन से वैश्विक अनुभव तक - हमारी यात्रा एक सपने से शुरू हुई कि अपने समाज के हर छात्र तक गुणवत्तापूर्ण शिक्षा पहुंचे। अब, हम उसी अनुभव को स्थानीय छात्रों के भविष्य को आकार देने में मदद करने के लिए लाते हैं।',
    'about.mission.title': 'हमारा मिशन',
    'about.mission.content': 'हमारे समाज और आसपास के क्षेत्रों के छात्रों को सुलभ, गुणवत्तापूर्ण शैक्षिक सहायता प्रदान करना।',
    
    // Contact Page
    'contact.title': 'संपर्क करें',
    'contact.phone': 'फोन',
    'contact.address': 'पता',
    'contact.address.value': 'अमरपाटन, सतना, MP',
    'contact.form.title': 'हमें मैसेज भेजें',
    'contact.form.message': 'आपका संदेश',
    'contact.form.submit': 'मैसेज भेजें',
    
    // Common
    'common.name': 'नाम',
    'common.mobile': 'मोबाइल नंबर',
    'common.class': 'कक्षा',
    'common.school': 'स्कूल का नाम',
    'common.submit': 'सबमिट',
    'common.loading': 'लोड हो रहा है...',
    'common.success': 'सफल!',
    'common.error': 'त्रुटि हुई। कृपया पुनः प्रयास करें।',
    
    // Footer
    'footer.rights': 'सर्वाधिकार सुरक्षित।',
    'footer.tagline': 'छात्रों को सशक्त बनाना',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
