import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FINN — Less noise. Better questions.",
  description: "Your portfolio, in perspective. Source-grounded investment intelligence by Ishaan Bansal.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
