import TerminalRouteClient from "@/features/terminal/components/TerminalRouteClient";

export default function Page() {
  return (
    <main className="h-dvh w-dvw overflow-hidden bg-black">
      <section className="sr-only">
        <h1>김현호 소프트웨어 엔지니어 포트폴리오</h1>
        <p>
          사용자 화면부터 서버와 AI 연동까지 제품의 흐름을 연결하는
          소프트웨어 엔지니어 김현호의 포트폴리오입니다.
        </p>
        <a href="/desktop">포트폴리오 열기</a>
      </section>
      <TerminalRouteClient />
    </main>
  );
}
