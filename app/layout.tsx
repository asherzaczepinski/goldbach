import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const mont = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mont",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Goldbach Blocks — an exploration of primes",
  description:
    "An interactive hub for exploring the Goldbach conjecture and the primes: pairings, the comet, the Ulam spiral, prime differences, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={mont.variable}>
      <body>{children}</body>
    </html>
  );
}
