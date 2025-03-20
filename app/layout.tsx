import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getJupiterPrice } from "./utils/getJupiterPrice";
import Script from "next/script";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const price = await getJupiterPrice()

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
      <Head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6202902142885850"
          crossOrigin="anonymous" />
      </Head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
