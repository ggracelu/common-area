import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { CrumbsLabPortal } from "@/components/app/CrumbsLabPortal";
import "./globals.css";

export const metadata: Metadata = {
  title: "Common Area",
  description: "Turn your city into a campus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body className="min-h-full flex flex-col">
          {children}
          {/* TODO: remove — temp mascot lab entry (portal = above Clerk / headers) */}
          <CrumbsLabPortal />
        </body>
      </html>
    </ClerkProvider>
  );
}
