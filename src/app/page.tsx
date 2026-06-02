'use client';

import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("@/features/Apps/Terminal").then(m => m.TerminalPage), { ssr: false });

export default function Page() {
  return (
    <TerminalPage />
  )
}