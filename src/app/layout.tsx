import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Siteline',
  description: 'Organize job site photos and documents by job.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Siteline',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
     className={`${geist.className} antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
