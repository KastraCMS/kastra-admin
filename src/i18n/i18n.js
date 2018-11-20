import i18next from 'i18next';
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
  .use(LanguageDetector)
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    //lng: 'fr', // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: {
      'en': {
        translation: en,
      },
      'es': {
        translation: es,
      },
      'fr': {
        translation: fr,
      }
    },
  })

export default i18next