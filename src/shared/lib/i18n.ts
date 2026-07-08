import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import koCommon from '../../../public/locales/ko/common.json';
import enCommon from '../../../public/locales/en/common.json';
import koAboutSite from '../../../public/locales/ko/AboutSite.json';
import enAboutSite from '../../../public/locales/en/AboutSite.json';
import koAbout from '../../../public/locales/ko/About.json';
import enAbout from '../../../public/locales/en/About.json';
import koContact from '../../../public/locales/ko/Contact.json';
import enContact from '../../../public/locales/en/Contact.json';
import koNotes from '../../../public/locales/ko/Notes.json';
import enNotes from '../../../public/locales/en/Notes.json';
import koSettings from '../../../public/locales/ko/Settings.json';
import enSettings from '../../../public/locales/en/Settings.json';
import koTerminal from '../../../public/locales/ko/Terminal.json';
import enTerminal from '../../../public/locales/en/Terminal.json';

const resources = {
  ko: {
    common: koCommon,
    AboutSite: koAboutSite,
    About: koAbout,
    Contact: koContact,
    Notes: koNotes,
    Settings: koSettings,
    Terminal: koTerminal,
  },
  en: {
    common: enCommon,
    AboutSite: enAboutSite,
    About: enAbout,
    Contact: enContact,
    Notes: enNotes,
    Settings: enSettings,
    Terminal: enTerminal,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
