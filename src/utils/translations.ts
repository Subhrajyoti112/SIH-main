import { Translation } from '@/types';

export const translations: Translation = {
  // Navigation
  home: {
    en: 'Home',
    hi: 'होम',
    od: 'ଘର'
  },
  farmer: {
    en: 'Farmer',
    hi: 'किसान',
    od: 'କୃଷକ'
  },
  fpo: {
    en: 'FPO',
    hi: 'एफपीओ',
    od: 'ଏଫପିଓ'
  },
  retailer: {
    en: 'Retailer',
    hi: 'खुदरा विक्रेता',
    od: 'ଖୁଚୁରା ବ୍ୟବସାୟୀ'
  },
  consumer: {
    en: 'Consumer',
    hi: 'उपभोक्ता',
    od: 'ଗ୍ରାହକ'
  },
  government: {
    en: 'Government',
    hi: 'सरकार',
    od: 'ସରକାର'
  },
  blockchain_explorer: {
    en: 'Blockchain Explorer',
    hi: 'ब्लॉकचेन एक्सप्लोरर',
    od: 'ବ୍ଲକଚେନ୍ ଏକ୍ସପ୍ଲୋରର'
  },
  
  // Common
  login: {
    en: 'Login',
    hi: 'लॉगिन',
    od: 'ଲଗଇନ୍'
  },
  signup: {
    en: 'Sign Up',
    hi: 'साइन अप',
    od: 'ସାଇନ୍ ଅପ୍'
  },
  dashboard: {
    en: 'Dashboard',
    hi: 'डैशबोर्ड',
    od: 'ଡ୍ୟାସବୋର୍ଡ'
  },
  submit: {
    en: 'Submit',
    hi: 'जमा करें',
    od: 'ଦାଖଲ କରନ୍ତୁ'
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
    od: 'ବାତିଲ୍ କରନ୍ତୁ'
  },
  approve: {
    en: 'Approve',
    hi: 'स्वीकृत',
    od: 'ଅନୁମୋଦନ'
  },
  reject: {
    en: 'Reject',
    hi: 'अस्वीकार',
    od: 'ପ୍ରତ୍ୟାଖ୍ୟାନ'
  },
  
  // Hero Section
  hero_title: {
    en: 'Farm-to-Consumer Transparency with Blockchain',
    hi: 'ब्लॉकचेन के साथ फार्म-से-उपभोक्ता पारदर्शिता',
    od: 'ବ୍ଲକଚେନ୍ ସହିତ ଫାର୍ମ-ରୁ-ଗ୍ରାହକ ସ୍ଵଚ୍ଛତା'
  },
  hero_description: {
    en: 'Trace every step of your agricultural produce journey from farm to your table using cutting-edge blockchain technology. Ensuring transparency, quality, and trust in the food supply chain.',
    hi: 'अत्याधुनिक ब्लॉकचेन तकनीक का उपयोग करके अपने कृषि उत्पादों की यात्रा के हर कदम को खेत से आपकी मेज तक ट्रेस करें।',
    od: 'ଅତ୍ୟାଧୁନିକ ବ୍ଲକଚେନ୍ ଟେକ୍ନୋଲୋଜି ବ୍ୟବହାର କରି ଆପଣଙ୍କ କୃଷି ଉତ୍ପାଦର ଯାତ୍ରାର ପ୍ରତ୍ୟେକ ପଦକ୍ଷେପ ଟ୍ରେସ୍ କରନ୍ତୁ।'
  },
  
  // Farmer Dashboard
  add_produce: {
    en: 'Add Produce',
    hi: 'उत्पाद जोड़ें',
    od: 'ଉତ୍ପାଦ ଯୋଗ କରନ୍ତୁ'
  },
  crop_name: {
    en: 'Crop Name',
    hi: 'फसल का नाम',
    od: 'ଫସଲର ନାମ'
  },
  quantity: {
    en: 'Quantity (kg)',
    hi: 'मात्रा (किलो)',
    od: 'ପରିମାଣ (କିଲୋ)'
  },
  location: {
    en: 'Location',
    hi: 'स्थान',
    od: 'ସ୍ଥାନ'
  },
  expected_price: {
    en: 'Expected Price (₹/kg)',
    hi: 'अपेक्षित मूल्य (₹/किलो)',
    od: 'ଆଶାକରାଯାଉଥିବା ମୂଲ୍ୟ (₹/କିଲୋ)'
  }
};

export const getTranslation = (key: string, language: 'en' | 'hi' | 'od'): string => {
  return translations[key]?.[language] || translations[key]?.en || key;
};