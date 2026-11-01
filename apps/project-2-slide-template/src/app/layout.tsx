import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import { UIProvider } from 'ui';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Presentation Template Library',
  description: 'Thư viện mẫu trình chiếu PowerPoint 16:9 chuyên nghiệp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${beVietnamPro.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
