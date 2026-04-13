import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "National Talent Development Initiative",
  description: "Platform helping talented young Nigerians access education while ensuring transparent funding and measurable national impact.",
};

import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <body className="font-sans antialiased">
           <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        
      </body>
    </html>
  );
}
