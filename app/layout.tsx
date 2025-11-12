import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Navam Marketer - Marketing Automation MLP",
  description: "Turn existing content into social promotions automatically",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-2xl font-bold">Navam Marketer</h1>
              <p className="text-sm text-muted-foreground">Marketing Automation for Bootstrapped Founders</p>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
