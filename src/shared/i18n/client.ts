import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enAbout from "@/shared/i18n/resources/en/About.json";
import enAppShell from "@/shared/i18n/resources/en/appShell.json";
import enCommon from "@/shared/i18n/resources/en/common.json";
import enContact from "@/shared/i18n/resources/en/Contact.json";
import enNotes from "@/shared/i18n/resources/en/Notes.json";
import enResume from "@/shared/i18n/resources/en/Resume.json";
import enSettings from "@/shared/i18n/resources/en/Settings.json";
import enTerminal from "@/shared/i18n/resources/en/Terminal.json";
import koAbout from "@/shared/i18n/resources/ko/About.json";
import koAppShell from "@/shared/i18n/resources/ko/appShell.json";
import koCommon from "@/shared/i18n/resources/ko/common.json";
import koContact from "@/shared/i18n/resources/ko/Contact.json";
import koNotes from "@/shared/i18n/resources/ko/Notes.json";
import koResume from "@/shared/i18n/resources/ko/Resume.json";
import koSettings from "@/shared/i18n/resources/ko/Settings.json";
import koTerminal from "@/shared/i18n/resources/ko/Terminal.json";

const resources = {
  ko: {
    common: koCommon,
    About: koAbout,
    Contact: koContact,
    Notes: koNotes,
    Resume: koResume,
    Settings: koSettings,
    Terminal: koTerminal,
    appShell: koAppShell,
  },
  en: {
    common: enCommon,
    About: enAbout,
    Contact: enContact,
    Notes: enNotes,
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
