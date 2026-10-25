import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { TroviaProvider } from "@/lib/store";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Trovia — Thrift live shopping for India",
  description:
    "Watch curated thrift shows, bid live, and pay with UPI. Pan-India preloved fashion — collector energy, not mass discount commerce.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TroviaProvider>{children}</TroviaProvider>
      </body>
    </html>
  );
}
