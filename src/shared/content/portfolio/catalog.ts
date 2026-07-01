import {
    externalUrl,
    publicAssetPath,
    type ProjectSlug,
} from "@/features/gui/registry/appTypes";
import type { ProjectCatalogEntry } from "@/shared/content/portfolio/types";

export const projectCatalog = {
    wchms: {
        slug: "wchms",
        order: 10,
        status: "live",
        stack: ["Next.js", "TypeScript", "MySQL", "OpenAI"],
        icon: publicAssetPath("/icons/wchms.png"),
        links: {
            live: externalUrl("https://wchms-idsp4.fly.dev/"),
        },
        media: [publicAssetPath("/videos/wchms-walkthrough.mp4")],
    },
    flare: {
        slug: "flare",
        order: 20,
        status: "live",
        stack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
        icon: publicAssetPath("/icons/flare.png"),
        links: {
            live: externalUrl("https://www.flare-bc.com/"),
            source: externalUrl(
                "https://github.com/noonnofus/Flare_IDSP",
            ),
        },
        media: [
            publicAssetPath("/videos/flare-walkthrough-web.mp4"),
            publicAssetPath("/videos/flare-walkthrough-app.mp4"),
        ],
    },
    weconnect: {
        slug: "weconnect",
        order: 30,
        status: "live",
        stack: ["TypeScript", "WebRTC", "WebSocket", "OpenAI"],
        icon: publicAssetPath("/icons/weconnect.svg"),
        links: {
            live: externalUrl(
                "https://idsp-weconnect-1.onrender.com",
            ),
        },
        media: [],
    },
    pagessence: {
        slug: "pagessence",
        order: 40,
        status: "archived",
        stack: ["Laravel", "Vue.js", "Inertia.js", "MySQL"],
        icon: publicAssetPath("/icons/pagessence.png"),
        links: {
            source: externalUrl(
                "https://github.com/noonnofus/PageSsence",
            ),
        },
        media: [],
    },
    diceroller: {
        slug: "diceroller",
        order: 50,
        status: "live",
        stack: ["React Native", "Expo", "TypeScript", "Cannon.js"],
        icon: publicAssetPath("/icons/diceroller.png"),
        links: {
            live: externalUrl("https://diceroller-jet.vercel.app/"),
            source: externalUrl(
                "https://github.com/noonnofus/diceRoller",
            ),
        },
        media: [
            publicAssetPath("/videos/diceroller-walkthrough-app.MP4"),
        ],
    },
    mejubot: {
        slug: "mejubot",
        order: 60,
        status: "live",
        stack: ["Discord.js", "JavaScript", "MongoDB", "PUBG API"],
        icon: publicAssetPath("/icons/mejubot.png"),
        links: {
            live: externalUrl(
                "https://discord.com/oauth2/authorize?client_id=1263899843055583254&permissions=8&integration_type=0&scope=bot",
            ),
        },
        media: [],
    },
    webpiano: {
        slug: "webpiano",
        order: 70,
        status: "live",
        stack: ["JavaScript", "EJS", "CSS3", "Tone.js"],
        icon: publicAssetPath("/icons/webpiano.png"),
        links: {
            live: externalUrl(
                "https://play-piano-project.onrender.com",
            ),
            source: externalUrl(
                "https://github.com/noonnofus/play_piano_project",
            ),
        },
        media: [
            publicAssetPath("/videos/webpiano-walkthrough.mp4"),
        ],
    },
} satisfies Record<ProjectSlug, ProjectCatalogEntry>;
