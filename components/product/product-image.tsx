"use client";

import { SelectedImgType } from "@/types";
import { CartProductType } from "@prisma/client";
import Image from "next/image";

interface ProductImageProps {
  cartProduct: CartProductType;
  product: any;
  handleColorSelect: (value: SelectedImgType) => void;
}

export const ProductImage = ({
  cartProduct,
  product,
  handleColorSelect,
}: ProductImageProps) => {
  return (
    <div className="grid grid-cols-6 gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex flex-col items-center justify-start gap-4 cursor-pointer h-full max-h-[500px] min-h-[300px] sm:min-h-[400px] pt-2">
        {product.images.map((image: SelectedImgType) => (
          <div
            key={image.color}
            onClick={() => handleColorSelect(image)}
            className={`relative w-[80%] aspect-square rounded ${
              cartProduct.selectedImg.color === image.color && "border-[1.5px]"
            }`}
          >
            <Image
              src={image.image}
              alt={image.color}
              fill
              className="object-contain p-0 md:p-2"
            />
          </div>
        ))}
      </div>
      <div className="col-span-5 relative aspect-square">
        <Image
          src={cartProduct.selectedImg.image}
          alt={cartProduct.name}
          fill
          className="w-full h-full max-h-[400px] min-h-[300px] sm:min-h-[400px] object-contain"
        />
      </div>
    </div>
  );
};
