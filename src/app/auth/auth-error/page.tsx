import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AuthErrorPage() {
  return (
    <main>
      <h1>로그인에 실패했습니다.</h1>
      <p>GitHub 로그인을 다시 시도해 주세요.</p>
      <Link href="/gui">포트폴리오로 돌아가기</Link>
    </main>
  );
}
