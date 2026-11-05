import TerminalRouteClient from "@/features/terminal/components/TerminalRouteClient";
import { SEO_COPY } from "@/lib/seo/siteMetadata";

export default function Page() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-black">
      <section className="sr-only">
        <h1>{SEO_COPY.ko.title}</h1>
        <p>{SEO_COPY.ko.description}</p>
        <a href="/desktop">포트폴리오 열기</a>
      </section>
      <TerminalRouteClient />
    </main>
  );
}
