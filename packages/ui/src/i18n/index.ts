import resources from 'virtual:i18next-loader';
import { initI18n, i18next, SupportLanguage } from '@keyword/i18n';
import { initReactI18next } from 'react-i18next';

export function getDefaultLanguage() {
  const navigatorLanguage = window.navigator.language.toLowerCase() || 'en';
  let currentLanguage = SupportLanguage.zh;
  if (!navigatorLanguage.includes('zh-')) {
    currentLanguage = SupportLanguage.en;
  }
  return currentLanguage;
}

i18next.use(initReactI18next);
initI18n({
  debug: process.env.NODE_ENV === 'development',
  resources,
  react: {
    bindI18n: 'languageChanged addResource',
    transKeepBasicHtmlNodesFor: ['b'],
  },
});
