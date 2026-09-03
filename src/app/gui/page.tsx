import type { Metadata } from "next";
import { GuiClient } from "@/app/gui/GuiClient";

export const metadata: Metadata = {
  title: "GUI 포트폴리오",
  description:
    "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
  alternates: {
    canonical: "/gui",
    languages: {
      ko: "/gui",
      en: "/en/gui",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/gui",
    siteName: "Hyunho Kim Portfolio",
    title: "GUI 포트폴리오 | 김현호",
    description:
      "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hyunho Kim, Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUI 포트폴리오 | 김현호",
    description:
      "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
    images: ["/opengraph-image"],
  },
};

export default function GuiPage() {
  return <GuiClient />;
}
