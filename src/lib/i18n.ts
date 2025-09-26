import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import koCommon from '../../public/locales/ko/common.json';
import enCommon from '../../public/locales/en/common.json';
import koWCHMS from '../../public/locales/ko/WCHMS.json';
import enWCHMS from '../../public/locales/en/WCHMS.json';
import koPageSsence from '../../public/locales/ko/PageSsence.json';
import enPageSsence from '../../public/locales/en/PageSsence.json';
import koDiceRoller from '../../public/locales/ko/DiceRoller.json';
import enDiceRoller from '../../public/locales/en/DiceRoller.json';
import koFlare from '../../public/locales/ko/Flare.json';
import enFlare from '../../public/locales/en/Flare.json';
import koMejubot from '../../public/locales/ko/Mejubot.json';
import enMejubot from '../../public/locales/en/Mejubot.json';
import koWeConnect from '../../public/locales/ko/WeConnect.json';
import enWeConnect from '../../public/locales/en/WeConnect.json';
import koWebPiano from '../../public/locales/ko/WebPiano.json';
import enWebPiano from '../../public/locales/en/WebPiano.json';

const resources = {
  ko: {
    common: koCommon,
    WCHMS: koWCHMS,
    PageSsence: koPageSsence,
    DiceRoller: koDiceRoller,
    Flare: koFlare,
    Mejubot: koMejubot,
    WeConnect: koWeConnect,
    WebPiano: koWebPiano,
  },
  en: {
    common: enCommon,
    WCHMS: enWCHMS,
    PageSsence: enPageSsence,
    DiceRoller: enDiceRoller,
    Flare: enFlare,
    Mejubot: enMejubot,
    WeConnect: enWeConnect,
    WebPiano: enWebPiano,
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