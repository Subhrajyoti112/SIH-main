import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  // Import translations here to avoid circular dependency
  const translations: Record<string, Record<Language, string>> = {
    home: { en: 'Home', hi: 'होम', od: 'ଘର' },
    farmer: { en: 'Farmer', hi: 'किसान', od: 'କୃଷକ' },
    fpo: { en: 'FPO', hi: 'एफपीओ', od: 'ଏଫପିଓ' },
    retailer: { en: 'Retailer', hi: 'खुदरा विक्रेता', od: 'ଖୁଚୁରା ବ୍ୟବସାୟୀ' },
    consumer: { en: 'Consumer', hi: 'उपभोक्ता', od: 'ଗ୍ରାହକ' },
    government: { en: 'Government', hi: 'सरकार', od: 'ସରକାର' },
    blockchain_explorer: { en: 'Blockchain Explorer', hi: 'ब्लॉकचेन एक्सप्लोरर', od: 'ବ୍ଲକଚେନ୍ ଏକ୍ସପ୍ଲୋରର' },
    login: { en: 'Login', hi: 'लॉगिन', od: 'ଲଗଇନ୍' },
    signup: { en: 'Sign Up', hi: 'साइन अप', od: 'ସାଇନ୍ ଅପ୍' },
    hero_title: { 
      en: 'Farm-to-Consumer Transparency with Blockchain', 
      hi: 'ब्लॉकचेन के साथ फार्म-से-उपभोक्ता पारदर्शिता', 
      od: 'ବ୍ଲକଚେନ୍ ସହିତ ଫାର୍ମ-ରୁ-ଗ୍ରାହକ ସ୍ଵଚ୍ଛତା' 
    },
    hero_description: { 
      en: 'Trace every step of your agricultural produce journey from farm to your table using cutting-edge blockchain technology.', 
      hi: 'अत्याधुनिक ब्लॉकचेन तकनीक का उपयोग करके अपने कृषि उत्पादों की यात्रा के हर कदम को ट्रेस करें।', 
      od: 'ଅତ୍ୟାଧୁନିକ ବ୍ଲକଚେନ୍ ଟେକ୍ନୋଲୋଜି ବ୍ୟବହାର କରି ଆପଣଙ୍କ କୃଷି ଉତ୍ପାଦର ଯାତ୍ରା ଟ୍ରେସ୍ କରନ୍ତୁ।' 
    }
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};