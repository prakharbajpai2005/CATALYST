import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skill-Bridge | Learn by Doing",
  description: "AI-driven Interactive Simulation Platform for practical skill development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
