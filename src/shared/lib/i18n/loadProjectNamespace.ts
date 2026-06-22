import i18n from "@/shared/lib/i18n";

const projectNamespaceLoaders = {
    WCHMS: {
        ko: () => import("../../../../public/locales/ko/WCHMS.json"),
        en: () => import("../../../../public/locales/en/WCHMS.json"),
    },
    Flare: {
        ko: () => import("../../../../public/locales/ko/Flare.json"),
        en: () => import("../../../../public/locales/en/Flare.json"),
    },
    WeConnect: {
        ko: () =>
            import("../../../../public/locales/ko/WeConnect.json"),
        en: () =>
            import("../../../../public/locales/en/WeConnect.json"),
    },
    PageSsence: {
        ko: () =>
            import("../../../../public/locales/ko/PageSsence.json"),
        en: () =>
            import("../../../../public/locales/en/PageSsence.json"),
    },
    DiceRoller: {
        ko: () =>
            import("../../../../public/locales/ko/DiceRoller.json"),
        en: () =>
            import("../../../../public/locales/en/DiceRoller.json"),
    },
    Mejubot: {
        ko: () => import("../../../../public/locales/ko/Mejubot.json"),
        en: () => import("../../../../public/locales/en/Mejubot.json"),
    },
    WebPiano: {
        ko: () =>
            import("../../../../public/locales/ko/WebPiano.json"),
        en: () =>
            import("../../../../public/locales/en/WebPiano.json"),
    },
} as const;

export type ProjectNamespace = keyof typeof projectNamespaceLoaders;

export async function ensureProjectNamespace(
    namespace: ProjectNamespace,
): Promise<void> {
    if (
        i18n.hasResourceBundle("ko", namespace) &&
        i18n.hasResourceBundle("en", namespace)
    ) {
        return;
    }

    const loaders = projectNamespaceLoaders[namespace];
    const [ko, en] = await Promise.all([loaders.ko(), loaders.en()]);

    i18n.addResourceBundle("ko", namespace, ko.default, true, true);
    i18n.addResourceBundle("en", namespace, en.default, true, true);
}
