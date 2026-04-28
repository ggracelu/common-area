import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhyNot",
  description: "No swiping. Just sign up and show up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
