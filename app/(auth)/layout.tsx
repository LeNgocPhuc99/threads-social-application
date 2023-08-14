// specify different rules for the authentication route

import { ClerkProvider } from "@clerk/nextjs";

import { Inter } from "next/font/google";

// css import
import "../globals.css";

// for SEO
export const metadata = {
  title: "Threads",
  description: "A Meta Threads Clone Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
