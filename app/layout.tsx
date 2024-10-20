import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar";
import CartProvider from "@/providers/cart-provider";
import ToastProvider from "@/providers/toast-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "ElectroniX",
  description: "E-commerce App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} text-sky-700`}
        suppressHydrationWarning
      >
        <ToastProvider />
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
