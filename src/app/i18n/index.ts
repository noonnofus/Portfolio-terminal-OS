import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAppShell from "@/app/i18n/resources/en/appShell.json";
import enCommon from "@/app/i18n/resources/en/common.json";
import koAppShell from "@/app/i18n/resources/ko/appShell.json";
import koCommon from "@/app/i18n/resources/ko/common.json";
import enGuestbook from "@/features/guestbook/i18n/en/Guestbook.json";
import koGuestbook from "@/features/guestbook/i18n/ko/Guestbook.json";
import enAbout from "@/features/portfolio/i18n/en/About.json";
import enContact from "@/features/portfolio/i18n/en/Contact.json";
import enResume from "@/features/portfolio/i18n/en/Resume.json";
import koAbout from "@/features/portfolio/i18n/ko/About.json";
import koContact from "@/features/portfolio/i18n/ko/Contact.json";
import koResume from "@/features/portfolio/i18n/ko/Resume.json";
import enSettings from "@/features/settings/i18n/en/Settings.json";
import koSettings from "@/features/settings/i18n/ko/Settings.json";
import enTerminal from "@/features/terminal/i18n/en/Terminal.json";
import koTerminal from "@/features/terminal/i18n/ko/Terminal.json";

const resources = {
  ko: {
    common: koCommon,
    About: koAbout,
    Contact: koContact,
    Notes: koGuestbook,
    Resume: koResume,
    Settings: koSettings,
    Terminal: koTerminal,
    appShell: koAppShell,
  },
  en: {
    common: enCommon,
    About: enAbout,
    Contact: enContact,
    Notes: enGuestbook,
    Resume: enResume,
    Settings: enSettings,
    Terminal: enTerminal,
    appShell: enAppShell,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ko",
  fallbackLng: "ko",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
