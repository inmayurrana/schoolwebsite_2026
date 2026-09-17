import type { Metadata, Viewport } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} min-h-screen flex flex-col font-sans antialiased selection:bg-amber-400 selection:text-slate-950`}>
        <ThemeProvider>
          <InstantNavigation />
          <NoticeTicker />
          <Navbar />
          <main className="flex-1">
            <PageVisibilityGuard>{children}</PageVisibilityGuard>
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
