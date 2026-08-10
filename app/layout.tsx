import { Noto_Sans_KR } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import Nav from "./components/common/Nav";
import Footer from "./components/common/Footer";
import { Toaster } from "./components/ui/sonner";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interior Portfolio",
  description: "인테리어 시공사례 포트폴리오",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={notoSansKR.className}>
      <body className="min-h-screen flex flex-col">
        <Nav />
        <main className="flex-1 px-24">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}