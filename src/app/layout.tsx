import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI 문구 생성기(샘플 기반)',
  description: '서버리스 샘플 데이터로 빠르게 문구를 만들어보는 Next.js 데모',
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
