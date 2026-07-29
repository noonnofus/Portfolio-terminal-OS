import i18n from "@/shared/i18n/client";

const projectNamespaceLoaders = {
    Portfolio: {
        ko: () => import("@/shared/i18n/resources/ko/Portfolio.json"),
        en: () => import("@/shared/i18n/resources/en/Portfolio.json"),
    },
    Optigen: {
        ko: () => import("@/shared/i18n/resources/ko/Optigen.json"),
        en: () => import("@/shared/i18n/resources/en/Optigen.json"),
    },
    Kepco: {
        ko: () => import("@/shared/i18n/resources/ko/Kepco.json"),
        en: () => import("@/shared/i18n/resources/en/Kepco.json"),
    },
    WCHMS: {
        ko: () => import("@/shared/i18n/resources/ko/WCHMS.json"),
        en: () => import("@/shared/i18n/resources/en/WCHMS.json"),
    },
    Flare: {
        ko: () => import("@/shared/i18n/resources/ko/Flare.json"),
        en: () => import("@/shared/i18n/resources/en/Flare.json"),
    },
} as const;

export type ProjectNamespace = keyof typeof projectNamespaceLoaders;

export async function ensureProjectNamespace(
    namespace: ProjectNamespace,
): Promise<void> {
    if (
        process.env.NODE_ENV === "production" &&
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
