"use client";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export const CartCount = () => {
  const { cartTotalQty } = useCart();
  const router = useRouter();

  return (
    <div
      className="relative cursor-pointer"
      onClick={() => router.push("/cart")}
    >
      <ShoppingCart className="w-[1.6rem] h-[1.6rem]" />
      {cartTotalQty > 0 && (
        <span className="absolute top-[-10px] right-[-10px] bg-slate-700 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs">
          {cartTotalQty}
        </span>
      )}
    </div>
  );
};
