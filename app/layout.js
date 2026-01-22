import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { CartProvider } from "@/components/providers/CartProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { NotificationProvider } from "@/components/providers/NotificationProvider";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";
import '@/lib/init'; // Auto-initialize database

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata = {
  title: "DressStore - Modern Fashion E-Commerce",
  description: "Shop the latest trends in dresses with our curated collection. Free delivery on COD orders.",
  keywords: "dresses, fashion, online shopping, women's clothing, COD",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <NotificationProvider>
                  <Header />
                  <main className="min-h-screen">
                    {children}
                  </main>
                  <Footer />
                  <BottomNav />
                </NotificationProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
