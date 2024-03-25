"use client";

import { CartContextProvider } from "@/hooks/use-cart";

interface CartProviderProps {
  children: React.ReactNode;
}

const CartProvider = ({ children }: CartProviderProps) => {
  return <CartContextProvider>{children}</CartContextProvider>;
};

export default CartProvider;
