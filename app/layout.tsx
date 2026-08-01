import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ReportStoreProvider } from "@/lib/report-store";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talent Genome — Talent Intelligence Reports",
  description:
    "Understand the people behind your talent pool. Talent Genome turns a difficult, niche or senior role into a confidential talent intelligence brief before you open the search.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <ReportStoreProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </ReportStoreProvider>
      </body>
    </html>
  );
}
