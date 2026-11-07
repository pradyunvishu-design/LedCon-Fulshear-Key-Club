import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Fulshear Key Club | 2026–2027",
  description: "Fulshear High School Key Club: club meetings, volunteer opportunities, officer contacts, and service-hour resources for 2026–2027.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col pt-16">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
