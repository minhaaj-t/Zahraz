import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { BottomNavbar } from "@/components/bottom-navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZAHRA'Z Collections - Modern E-commerce Store",
  description: "Discover premium products at ZAHRA'Z Collections. Shop the latest trends with seamless checkout via WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <BottomNavbar />
      </body>
    </html>
  );
}
