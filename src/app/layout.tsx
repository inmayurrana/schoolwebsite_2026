import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { UiEffectsProvider } from "@/components/providers/UiEffectsProvider";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import NoticeTicker from "@/components/ui/NoticeTicker";
import PageVisibilityGuard from "@/components/ui/PageVisibilityGuard";
import InstantNavigation from "@/components/navigation/InstantNavigation";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

import { prisma } from "@/lib/prisma";
import { appCache } from "@/lib/cache";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A2540",
};

export const metadata: Metadata = {
  title: "Cambridge International School, Mandi | Best CBSE School in Himachal Pradesh",
  description:
    "Cambridge International School Mandi is a premier CBSE day & residential school in Himachal Pradesh offering world-class smart classrooms, STEM robotics labs, Olympic sports complex, and boarding.",
  keywords: [
    "Cambridge International School Mandi",
    "Best School in Mandi Himachal Pradesh",
    "CBSE School Mandi",
    "Boarding School Himachal",
    "CIS Mandi Admissions 2025-26",
    "Top International School Himachal",
  ],
  authors: [{ name: "Cambridge International School Mandi" }],
  icons: {
    icon: [
      { url: "/api/favicon", sizes: "any", type: "image/png" },
      { url: "/icon.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: ["/api/favicon"],
    apple: [
      { url: "/api/favicon?size=180", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Cambridge International School, Mandi",
    description: "Empowering Global Minds Amidst Himalayan Serenity • CBSE Affiliated No. 630198",
    url: "https://cismandi.edu.in",
    siteName: "Cambridge International School Mandi",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "Cambridge International School Mandi Campus",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let faviconUrl = "/api/favicon";
  try {
    const v = await appCache.getOrSet(
      "site:favicon_version",
      async () => {
        const versionSetting = await prisma.siteSetting.findUnique({
          where: { key: "favicon_version" },
        });
        return versionSetting?.value || "1";
      },
      1800
    );
    faviconUrl = `/api/favicon?v=${v}`;
  } catch (e) {}

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href={faviconUrl} sizes="any" type="image/png" />
        <link rel="shortcut icon" href={faviconUrl} />
        <link rel="apple-touch-icon" href={`${faviconUrl}&size=180`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} min-h-screen flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950`}>
        <ThemeProvider>
          <UiEffectsProvider>
            <InstantNavigation />
            <NoticeTicker />
            <Navbar />
            <main className="flex-1">
              <PageVisibilityGuard>{children}</PageVisibilityGuard>
            </main>
            <Footer />
          </UiEffectsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
