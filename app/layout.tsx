import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // 모노스페이스 폰트는 필요할 때만 로드
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bumaview.com'),
  title: {
    default: "BumaView - 개발자 면접 질문 공유 플랫폼",
    template: "%s | BumaView"
  },
  description: "실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요. 함께 성장하는 개발 문화를 만들어갑니다.",
  keywords: ["개발자", "면접", "질문", "답변", "취업", "프로그래밍", "개발", "IT", "코딩테스트", "기술면접"],
  authors: [{ name: "BumaView Team" }],
  creator: "BumaView Team",
  publisher: "BumaView",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://bumaview.com",
    siteName: "BumaView",
    title: "BumaView - 개발자 면접 질문 공유 플랫폼",
    description: "실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BumaView - 개발자 면접 질문 공유 플랫폼",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BumaView - 개발자 면접 질문 공유 플랫폼",
    description: "실제 면접에서 받은 질문들을 공유하고, 다른 개발자들과 함께 답변을 준비하세요.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-verification-code',
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "BumaView",
              "description": "개발자 면접 질문 공유 플랫폼",
              "url": "https://bumaview.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://bumaview.com/questions?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "BumaView",
                "url": "https://bumaview.com"
              }
            })
          }}
        />
        {children}
        <Toaster
          position="bottom-right"
          closeButton
          richColors
          theme="dark"
        />
      </body>
    </html>
  );
}
