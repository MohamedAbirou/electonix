"use client";

import { Button } from "@/components/inputs/button";
import { Heading } from "@/components/heading";
import { useCart } from "@/hooks/use-cart";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { ItemContent } from "./item-content";
import { formatter } from "@/utils/formatter";
import { SafeUser } from "@/types";
import { useRouter } from "next/navigation";

interface CartClientProps {
  currentUser: SafeUser | null;
}

export const CartClient = ({ currentUser }: CartClientProps) => {
  const { cartItems, cartTotalAmount, handleClearCart } = useCart();
  const router = useRouter();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-2xl">Your cart is empty!</div>
        <div>
          <Link
            href="/"
            className="group text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition duration-300" />
            <span>Start Shopping</span>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="px-5">
      <Heading title="Shopping Cart" center />
      <div className="grid grid-cols-5 text-xs gap-4 pb-2 items-center uppercase mt-20 border-b-[1.5px] border-slate-200">
        <div className="col-span-2 justify-self-start">product</div>
        <div className="justify-self-center">price</div>
        <div className="justify-self-center">quantity</div>
        <div className="justify-self-end">total</div>
      </div>
      <div>
        {cartItems &&
          cartItems.map((item) => <ItemContent key={item.id} item={item} />)}
      </div>
      <div className="flex justify-between gap-4 mt-16 py-4">
        <div className="w-[90px]">
          <Button label="Clear Cart" onClick={handleClearCart} small outline />
        </div>
        <div className="text-sm flex flex-col items-start gap-1 space-y-2">
          <div className="flex items-center justify-between w-full text-base font-semibold">
            <span>Subtotal</span>
            <span>{formatter(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">
            Taxes and shipping calculated at checkout
          </p>
          <Button
            label={currentUser ? "Checkout" : "Login To Checkout"}
            outline={currentUser ? false : true}
            onClick={() => {
              currentUser ? router.push("/checkout") : router.push("/login");
            }}
          />
          <Link
            href="/"
            className="group text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack className="group-hover:-translate-x-1 transition duration-300" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
