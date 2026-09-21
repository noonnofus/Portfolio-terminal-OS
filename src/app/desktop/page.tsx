import type { Metadata } from "next";
import { DesktopClient } from "@/app/desktop/DesktopClient";

export const metadata: Metadata = {
  title: "Full-Stack Developer Portfolio",
  description:
    "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
  alternates: {
    canonical: "/desktop",
    languages: {
      ko: "/desktop",
      en: "/en/desktop",
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/desktop",
    siteName: "Hyunho Kim Portfolio",
    title: "Full-Stack Developer Portfolio",
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
    title: "Full-Stack Developer Portfolio",
    description:
      "김현호의 프로젝트, 커리어, 이력서를 둘러볼 수 있는 인터랙티브 포트폴리오입니다.",
    images: ["/opengraph-image"],
  },
};

export default function DesktopPage() {
  return <DesktopClient />;
}
