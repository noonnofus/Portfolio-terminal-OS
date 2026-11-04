import type { Metadata } from "next";
import type { Language } from "@/lib/i18n/language";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
if (!siteUrl) {
  throw new Error("NEXT_PUBLIC_SITE_URL is required");
}
export const SITE_URL = new URL(siteUrl).origin;

export const SEO_COPY = {
  ko: {
    authorName: "김현호",
    title: "김현호 | 소프트웨어 엔지니어 포트폴리오",
    description: "사용자 화면부터 서버와 AI 연동까지 제품의 흐름을 연결하는 소프트웨어 엔지니어 김현호의 포트폴리오입니다.",
    locale: "ko_KR",
    desktop: {
      title: "김현호 | Software Engineer Portfolio",
      description: "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
    },
  },
  en: {
    authorName: "Hyunho Kim",
    title: "Hyunho Kim | Software Engineer Portfolio",
    description: "Hyunho Kim's software engineering portfolio, connecting user interfaces, backend services, and AI into working products.",
    locale: "en_US",
    desktop: {
      title: "Desktop Portfolio | Hyunho Kim",
      description: "Explore Hyunho Kim's projects, career, and resume in an interactive portfolio.",
    },
  },
} satisfies Record<Language, {
  authorName: string;
  title: string;
  description: string;
  locale: string;
  desktop: { title: string; description: string };
}>;

// Keep the existing exports for current consumers.
export const SITE_NAME = SEO_COPY.ko.title;
export const SITE_DESCRIPTION = SEO_COPY.ko.description;

export const SOCIAL_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Hyunho Kim, Software Engineer Portfolio",
};

export const SHARED_SOCIAL_METADATA = {
  openGraph: {
    type: "website",
    siteName: "Hyunho Kim Portfolio",
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    images: [SOCIAL_IMAGE.url],
  },
} satisfies Pick<Metadata, "openGraph" | "twitter">;
