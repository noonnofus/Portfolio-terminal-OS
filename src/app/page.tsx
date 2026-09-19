import TerminalRouteClient from "@/features/terminal/components/TerminalRouteClient";

export default function Page() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-black">
      <section className="sr-only">
        <h1>김현호 프론트엔드 개발자 포트폴리오</h1>
        <p>
          Next.js와 TypeScript 기반 웹 애플리케이션을 설계하고 구현하는
          프론트엔드 개발자 김현호의 포트폴리오입니다.
        </p>
        <a href="/gui">GUI 포트폴리오 열기</a>
      </section>
      <TerminalRouteClient />
    </main>
  );
}
