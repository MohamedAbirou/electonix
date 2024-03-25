import { CartProductType } from "@prisma/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import toast from "react-hot-toast";

type CartContextType = {
  cartTotalQty: number;
  cartTotalAmount: number;
  cartItems: CartProductType[] | null;
  handleAddProductToCart: (item: CartProductType) => void;
  handleRemoveProductFromCart: (item: CartProductType) => void;
  handleProductIncrease: (item: CartProductType) => void;
  handleProductDecrease: (item: CartProductType) => void;
  handleClearCart: () => void;
  paymentIntent: string | null;
  handleSetPaymentIntent: (val: string | null) => void;
};

export const CartContext = createContext<CartContextType | null>(null);

interface Props {
  [propName: string]: any;
}

export const CartContextProvider = (props: Props) => {
  const [cartTotalQty, setCartTotalQty] = useState(0);
  const [cartItems, setCartItems] = useState<CartProductType[] | null>(null);
  const [cartTotalAmount, setCartTotalAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const cartProducts: any = localStorage.getItem("eShopCartItems");
    const cItems: CartProductType[] | null = JSON.parse(cartProducts);
    const eShopPaymentIntent: any = localStorage.getItem("eShopPaymentIntent");
    const paymentIntent: string | null = JSON.parse(eShopPaymentIntent);

    setCartItems(cItems);
    setPaymentIntent(paymentIntent);
  }, []);

  useEffect(() => {
    const getTotals = () => {
      if (cartItems) {
        const { total, qty } = cartItems?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;

            return acc;
          },
          {
            total: 0,
            qty: 0,
          }
        );

        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };

    getTotals();
  }, [cartItems]);

  const handleAddProductToCart = useCallback((item: CartProductType) => {
    setCartItems((prev) => {
      let updatedCart;

      if (prev) {
        updatedCart = [...prev, item];
      } else {
        updatedCart = [item];
      }

      localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      toast.success("Product added to cart 🛒");

      return updatedCart;
    });
  }, []);

  const handleRemoveProductFromCart = useCallback(
    (product: CartProductType) => {
      if (cartItems) {
        const filteredProducts = cartItems.filter(
          (item) => item.id !== product.id
        );

        setCartItems(filteredProducts);
        localStorage.setItem(
          "eShopCartItems",
          JSON.stringify(filteredProducts)
        );
        toast.success("Product removed from cart 🛒");
      }
    },
    [cartItems]
  );

  const handleProductIncrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 99)
        return toast.error("Whoops! Maximum reached!");

      if (cartItems) {
        updatedCart = [...cartItems];

        const existingIndex = cartItems.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity += 1;
        }

        setCartItems(updatedCart);
        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartItems]
  );

  const handleProductDecrease = useCallback(
    (product: CartProductType) => {
      let updatedCart;

      if (product.quantity === 1)
        return toast.error("Whoops! Minimum reached!");

      if (cartItems) {
        updatedCart = [...cartItems];

        const existingIndex = cartItems.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex].quantity -= 1;
        }

        setCartItems(updatedCart);
        localStorage.setItem("eShopCartItems", JSON.stringify(updatedCart));
      }
    },
    [cartItems]
  );

  const handleClearCart = useCallback(() => {
    setCartItems(null);
    setCartTotalQty(0);
    localStorage.setItem("eShopCartItems", JSON.stringify(null));
    toast.success("Cart cleared!");
  }, []);

  const handleSetPaymentIntent = useCallback((val: string | null) => {
    setPaymentIntent(val);
    localStorage.setItem("eShopPaymentIntent", JSON.stringify(val));
  }, []);

  const value = {
    cartTotalQty,
    cartTotalAmount,
    cartItems,
    paymentIntent,
    handleAddProductToCart,
    handleRemoveProductFromCart,
    handleProductIncrease,
    handleProductDecrease,
    handleClearCart,
    handleSetPaymentIntent,
  };

  return <CartContext.Provider value={value} {...props} />;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }

  return context;
};
