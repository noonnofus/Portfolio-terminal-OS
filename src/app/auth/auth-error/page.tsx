import Link from "next/link";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "로그인 오류",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthErrorPage() {
  return (
    <main>
      <h1>로그인에 실패했습니다.</h1>
      <p>GitHub 로그인을 다시 시도해 주세요.</p>
      <Link href="/gui">포트폴리오로 돌아가기</Link>
    </main>
  );
}
