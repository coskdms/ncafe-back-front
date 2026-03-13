import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AgentChat from "@/components/common/AgentChat/AgentChat";
import ToastContainer from "@/components/common/Toast/Toast";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "고라파덕 카페 ☕🐤",
  description: "고라파덕이 서빙해주는 세상에서 가장 귀여운 포켓몬 카페!",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐥</text></svg>',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" strategy="afterInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <AgentChat />
        <ToastContainer />
      </body>
    </html>
  );
}
