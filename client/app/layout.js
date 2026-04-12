"use client";
import { Outfit, Ovo } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const ovo = Ovo({
  variable: "--font-ovo",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable} ${ovo.variable}`}>
      <head>
        <link href="https://cdn.boxicons.com/3.0.8/fonts/basic/boxicons.min.css" rel="stylesheet"></link>
      </head>
      <body className="font-outfit">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
