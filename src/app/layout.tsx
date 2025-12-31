import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'About Me | Personal Site',
  description: '나를 소개하는 포트폴리오 스타일의 웹사이트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="antialiased">{children}</body>
    </html>
  );
}
