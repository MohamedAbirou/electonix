"use client";
import { Button } from "@/components/inputs/button";
import { ProductColor } from "@/components/product/product-color";
import { ProductImage } from "@/components/product/product-image";
import { ProductQuantity } from "@/components/product/product-quantity";
import { useCart } from "@/hooks/use-cart";
import { CartProductType, SelectedImgType } from "@/types";
import { Rating } from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";

interface ProductDetailsProps {
  product: any;
}

export const ProductDetails = ({ product }: ProductDetailsProps) => {
  const { handleAddProductToCart, cartItems } = useCart();
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartProduct, setCartProduct] = useState<CartProductType>({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    brand: product.brand,
    selectedImg: { ...product.images[0] },
    quantity: 1,
    price: product.price,
  });
  const router = useRouter();

  useEffect(() => {
    setIsProductInCart(false);

    if (cartItems) {
      const existingIndex = cartItems.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        setIsProductInCart(true);
      }
    }
  }, [cartItems, product.id]);

  const productRating =
    product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    product.reviews.length;

  const handleColorSelect = useCallback((value: SelectedImgType) => {
    setCartProduct((prev) => {
      return { ...prev, selectedImg: value };
    });
  }, []);

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.quantity === 99) {
      return;
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, [cartProduct.quantity]);

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.quantity === 1) {
      return;
    }

    setCartProduct((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [cartProduct.quantity]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />
      <div className="flex flex-col gap-1 text-slate-500 text-sm">
        <h2 className="text-2xl md:text-3xl font-medium text-slate-700">
          {product?.name}
        </h2>
        <div className="text-slate-400 pl-0.5 pt-1">{product.category}</div>
        <div
          className={`${
            product.inStock ? "text-green-500" : "text-rose-500"
          } pl-0.5`}
        >
          {product.inStock ? "In Stock" : "Out of stock"}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Rating value={productRating} readOnly />
          <div>{product.reviews.length} reviews</div>
        </div>
        <hr className="my-5" />
        <div className="text-justify">{product.description}</div>
        <hr className="my-5" />
        <div className="space-x-2">
          <span className="uppercase font-semibold">brand:</span>
          <span>{product.brand}</span>
        </div>
        <hr className="my-5" />
        {isProductInCart ? (
          <>
            <p className="mb-2 text-slate-500 flex items-center gap-1">
              <MdCheckCircle className="text-teal-400" size={20} />
              <span>Product added to cart</span>
            </p>
            <div>
              <Button
                label="View Cart"
                outline
                onClick={() => router.push("/cart")}
              />
            </div>
          </>
        ) : (
          <>
            <ProductColor
              cartProduct={cartProduct}
              images={product.images}
              handleColorSelect={handleColorSelect}
            />
            {product.inStock && (
              <>
                <hr className="my-5" />
                <ProductQuantity
                  cartProduct={cartProduct}
                  handleQtyIncrease={handleQtyIncrease}
                  handleQtyDecrease={handleQtyDecrease}
                />
              </>
            )}
            <hr className="my-5" />
            <div>
              <Button
                label="Add To Cart"
                disabled={!product.inStock}
                onClick={() => handleAddProductToCart(cartProduct)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
