import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  TRANSLATIONS,
  type Language,
  type TranslationKey,
} from '@/localization/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const STORAGE_LANG_KEY = '@stickersmash_app_language';

const LanguageContext = createContext<LanguageContextType>({
  language: 'uz',
  setLanguage: async () => {},
  t: (key) => TRANSLATIONS.uz[key] || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('uz');

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_LANG_KEY).then((stored) => {
      if (stored && (stored === 'uz' || stored === 'ru' || stored === 'ja' || stored === 'en')) {
        setLanguageState(stored as Language);
      }
    });
  }, []);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    await AsyncStorage.setItem(STORAGE_LANG_KEY, newLang);
  };

  const t = (key: TranslationKey): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.uz;
    return dict[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

