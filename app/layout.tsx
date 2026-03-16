import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "National Talent Development Initiative",
  description: "Platform helping talented young Nigerians access education while ensuring transparent funding and measurable national impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
