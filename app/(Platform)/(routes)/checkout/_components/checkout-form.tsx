"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/inputs/button";
import { useCart } from "@/hooks/use-cart";
import { formatter } from "@/utils/formatter";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  clientSecret: string;
  handleSetPaymentSuccess: (value: boolean) => void;
}

export const CheckoutForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: CheckoutFormProps) => {
  const { cartTotalAmount, handleClearCart, handleSetPaymentIntent } =
    useCart();
  const [isLoading, setIsLoading] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const formattedPrice = formatter(cartTotalAmount);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    if (!clientSecret) {
      return;
    }

    handleSetPaymentSuccess(false);
  }, [clientSecret, handleSetPaymentSuccess, stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    stripe
      .confirmPayment({
        elements,
        redirect: "if_required",
      })
      .then((result) => {
        if (!result.error) {
          toast.success("Payment successful!");

          handleClearCart();
          handleSetPaymentSuccess(true);
          handleSetPaymentIntent(null);
        }

        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <div className="mb-6">
        <Heading title="Enter your details to complete checkout" />
      </div>
      <h2 className="font-semibold mt-10 mb-7">Address Information</h2>
      <AddressElement options={{ mode: "shipping" }} />
      <h2 className="font-semibold mt-10 mb-7">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <hr className="mt-10 h-px" />
      <div className="flex items-center justify-between pt-8 mb-10 text-sky-700 text-xl">
        <p>Total:</p>
        <p className="font-semibold">{formattedPrice}</p>
      </div>
      <Button
        label={isLoading ? "Processing..." : "Pay now"}
        disabled={isLoading || !stripe || !elements}
        onClick={() => {}}
      />
    </form>
  );
};
