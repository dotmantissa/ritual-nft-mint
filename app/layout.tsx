import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ritual Genesis — NFT Mint",
  description:
    "Mint your Ritual Genesis NFT. 99 unique artifacts forged on Ritual Chain — the first L1 with enshrined AI precompiles.",
  keywords: ["NFT", "Ritual Chain", "mint", "blockchain", "web3"],
  openGraph: {
    title: "Ritual Genesis — NFT Mint",
    description: "99 unique genesis artifacts forged on Ritual Chain.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Barlow:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-gray-300 font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
