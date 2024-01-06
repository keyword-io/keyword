import i18next, { InitOptions, Module } from 'i18next';

export enum SupportLanguage {
  zh = 'zh-CN',
  en = 'en-US',
}

export function initI18n<T extends Module>(initOptions: InitOptions) {
  i18next.init({
    nsSeparator: '.',
    keySeparator: false,
    lng: 'zh-CN',
    load: 'currentOnly',
    fallbackLng: [SupportLanguage.en, SupportLanguage.zh],
    fallbackNS: ['common'],
    interpolation: {
      prefix: '{',
      suffix: '}',
      escapeValue: false,
    },
    updateMissing: true,
    parseMissingKeyHandler(key: string) {
      // const [ns] = key.split('.');
      // if (i18next.hasResourceBundle('zh-CN', ns)) {
      //   return i18next.td(key);
      // }
      return key;
    },
    ...initOptions,
  });
  // i18next.td = i18next.t;
}

i18next.t = i18next.t.bind(i18next);

export { i18next };
