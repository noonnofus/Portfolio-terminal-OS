'use client';

import dynamic from 'next/dynamic';

const TerminalPage = dynamic(() => import("./terminal/TerminalPage"), { ssr: false });

export default function Page() {

  return (
    <TerminalPage />
  )
}