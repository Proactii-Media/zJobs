import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Z jobs | Job Search Platform",
  description:
    "Find your dream job with our advanced job search platform. Search by location, job type, and more.",
  metadataBase: new URL("https://zjobs-nine.vercel.app"),
  keywords:
    "job search, online job search, remote jobs, on-site jobs, job postings, job board, career opportunities",
  icons: {
    icon: "/favicon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} ${poppins.style} antialiased`}>
        {children}
      </body>
    </html>
  );
}
