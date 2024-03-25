"use client";

import { CartProductType } from "@/app/(Platform)/(routes)/product/[productId]/_components/product-details";

interface ProductQuantityProps {
  cartCounter?: boolean;
  cartProduct: CartProductType;
  handleQtyIncrease: () => void;
  handleQtyDecrease: () => void;
}

export const ProductQuantity = ({
  cartProduct,
  cartCounter,
  handleQtyIncrease,
  handleQtyDecrease,
}: ProductQuantityProps) => {
  return (
    <div className="flex gap-8 items-center">
      {!cartCounter && <div className="uppercase font-semibold">quantity:</div>}
      <div className="flex items-center gap-4 text-base">
        <button
          onClick={handleQtyDecrease}
          className="border-[1.2px] border-slate-300 px-2 rounded"
        >
          -
        </button>
        <div>{cartProduct.quantity}</div>
        <button
          onClick={handleQtyIncrease}
          className="border-[1.2px] border-slate-300 px-2 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};
