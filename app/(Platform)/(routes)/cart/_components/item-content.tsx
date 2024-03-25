"use client";

import { formatter } from "@/utils/formatter";
import { CartProductType } from "../../product/[productId]/_components/product-details";
import Link from "next/link";
import { truncateText } from "@/utils/truncate-text";
import Image from "next/image";
import { ProductQuantity } from "@/components/product/product-quantity";
import { useCart } from "@/hooks/use-cart";

interface ItemContentProps {
  item: CartProductType;
}

export const ItemContent = ({ item }: ItemContentProps) => {
  const {
    handleRemoveProductFromCart,
    handleProductIncrease,
    handleProductDecrease,
  } = useCart();

  return (
    <div className="grid grid-cols-5 text-xs md:text-sm lg:text-lg gap-4 border-b-[1.5px] border-slate-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <Link href={`/product/${item.id}`}>
          <div className="relative w-[70px] aspect-square">
            <Image
              src={item.selectedImg.image}
              alt={item.name}
              fill
              className="object-contain"
            />
          </div>
        </Link>
        <div className="flex flex-col justify-between">
          <Link href={`/product/${item.id}`}>{truncateText(item.name)}</Link>
          <div>{item.selectedImg.color}</div>
          <div className="w-[70px]">
            <button
              className="text-slate-500 underline"
              onClick={() => handleRemoveProductFromCart(item)}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      <div className="justify-self-center">{formatter(item.price)}</div>
      <div className="justify-self-center">
        <ProductQuantity
          cartCounter
          cartProduct={item}
          handleQtyIncrease={() => handleProductIncrease(item)}
          handleQtyDecrease={() => handleProductDecrease(item)}
        />
      </div>
      <div className="justify-self-end font-semibold">
        {formatter(item.price * item.quantity)}
      </div>
    </div>
  );
};
