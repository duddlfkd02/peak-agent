import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "PEAK AGENT",
  description: "PEAK Agent Service"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-darkgray font-pretendard text-background">
        <Header />
        {children}
      </body>
    </html>
  );
}
