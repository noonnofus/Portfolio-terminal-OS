import {
    publicAssetPath,
    type GuiAppCatalog,
} from "@/features/gui-v2/apps/appTypes";

export const appCatalog = {
    about: {
        appId: "about",
        url: { app: "about" },
        titles: { ko: "나에 대해서", en: "About" },
        icon: publicAssetPath("/icons/main.png"),
        order: 10,
    },
    projects: {
        appId: "projects",
        url: { app: "projects" },
        titles: { ko: "프로젝트", en: "Projects" },
        icon: publicAssetPath("/icons/projects.png"),
        order: 20,
    },
    resume: {
        appId: "resume",
        url: { app: "resume" },
        titles: { ko: "이력서", en: "Resume" },
        icon: publicAssetPath("/icons/info.png"),
        order: 30,
    },
    terminal: {
        appId: "terminal",
        url: { app: "terminal" },
        titles: { ko: "터미널", en: "Terminal" },
        icon: publicAssetPath("/icons/terminal.png"),
        order: 40,
    },
    contact: {
        appId: "contact",
        url: { app: "contact" },
        titles: { ko: "연락처", en: "Contact" },
        icon: publicAssetPath("/icons/contact.png"),
        order: 50,
    },
    "project:wchms": {
        appId: "project:wchms",
        url: { app: "project", slug: "wchms" },
        titles: { ko: "WCHMS", en: "WCHMS" },
        icon: publicAssetPath("/icons/wchms.png"),
        order: 110,
    },
    "project:flare": {
        appId: "project:flare",
        url: { app: "project", slug: "flare" },
        titles: { ko: "Flare", en: "Flare" },
        icon: publicAssetPath("/icons/flare.png"),
        order: 120,
    },
    "project:weconnect": {
        appId: "project:weconnect",
        url: { app: "project", slug: "weconnect" },
        titles: { ko: "WeConnect", en: "WeConnect" },
        icon: publicAssetPath("/icons/weconnect.svg"),
        order: 130,
    },
    "project:pagessence": {
        appId: "project:pagessence",
        url: { app: "project", slug: "pagessence" },
        titles: { ko: "pageSsence", en: "PageSsence" },
        icon: publicAssetPath("/icons/pagessence.png"),
        order: 140,
    },
    "project:diceroller": {
        appId: "project:diceroller",
        url: { app: "project", slug: "diceroller" },
        titles: { ko: "다이스롤러", en: "DiceRoller" },
        icon: publicAssetPath("/icons/diceroller.png"),
        order: 150,
    },
    "project:mejubot": {
        appId: "project:mejubot",
        url: { app: "project", slug: "mejubot" },
        titles: { ko: "디스코드 봇", en: "Discord Bot" },
        icon: publicAssetPath("/icons/mejubot.png"),
        order: 160,
    },
    "project:webpiano": {
        appId: "project:webpiano",
        url: { app: "project", slug: "webpiano" },
        titles: { ko: "웹 피아노", en: "WebPiano" },
        icon: publicAssetPath("/icons/webpiano.png"),
        order: 170,
    },
} satisfies GuiAppCatalog;

export const appCatalogKeys = Object.keys(appCatalog).sort();
