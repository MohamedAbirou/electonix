"use client";

import {
  CartProductType,
  SelectedImgType,
} from "@/app/(Platform)/(routes)/product/[productId]/_components/product-details";

interface ProductColorProps {
  images: SelectedImgType[];
  cartProduct: CartProductType;
  handleColorSelect: (value: SelectedImgType) => void;
}

export const ProductColor = ({
  images,
  cartProduct,
  handleColorSelect,
}: ProductColorProps) => {
  return (
    <div className="flex items-center gap-4">
      <div>
        <span className="uppercase font-semibold">color:</span>
      </div>
      <div className="flex items-center gap-1">
        {images.map((image, index) => (
          <div
            key={index}
            className={`h-7 w-7 rounded-full border-black flex items-center justify-center ${
              cartProduct.selectedImg.color === image.color
                ? "border-[1.5px]"
                : "border-none"
            }`}
            onClick={() => handleColorSelect(image)}
          >
            <div
              style={{ background: image.colorCode }}
              className="h-6 w-6 rounded-full border-[1.2px] border-slate-300 cursor-pointer"
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};
