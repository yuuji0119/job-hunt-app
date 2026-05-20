import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "就活管理アプリ",
  description: "就活企業管理アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}