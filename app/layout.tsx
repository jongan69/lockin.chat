import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const price = await fetch('https://lockin.chat/api/price', { 
    cache: 'no-store',
    next: { revalidate: 60 } // Revalidate every 60 seconds
  }).then(res => res.json());

  return {
    title: `Lockin ${price.uiFormmatted || ''}`,
    description: "Lock Chat",
    icons: {
      icon: "/profile.png",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
