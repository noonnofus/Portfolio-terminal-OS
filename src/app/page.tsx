'use client';

import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("@/features/Apps/Terminal/TerminalPage"), { ssr: false });

export default function Page() {
  return (
    <TerminalPage />
  )
}