import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '마케팅 문구 생성기 | Supabase + OpenAI',
  description: 'Supabase Edge Function과 OpenAI ChatGPT로 채널별 카피라이팅 패턴 문구를 생성하는 Next.js 데모',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  );
}
