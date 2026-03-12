import type { Metadata } from "next";
import "./globals.css";
import AgentChat from "@/components/common/AgentChat/AgentChat";

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
      <body>
        {children}
        <AgentChat />
      </body>
    </html>
  );
}
