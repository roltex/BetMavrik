import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stake Casino",
  description: "Play the best casino games online",
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
