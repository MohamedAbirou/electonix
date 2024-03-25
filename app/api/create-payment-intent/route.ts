import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { CartProductType } from "@/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

const calculateOrderAmount = (items: CartProductType[]) => {
  const totalPrice = items.reduce((acc, item) => {
    const itemTotal = item.price * item.quantity;

    return acc + itemTotal;
  }, 0);

  return totalPrice;
};

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { items, payment_intent_id } = body;

    if (!currentUser) {
      return NextResponse.json("Unathorized", { status: 401 });
    }

    const total = calculateOrderAmount(items) * 100;
    const orderData = {
      user: { connect: { id: currentUser.id } },
      amount: total,
      currency: "usd",
      status: "pending",
      deliveryStatus: "pending",
      paymentIntentId: payment_intent_id,
      products: items,
    };

    if (payment_intent_id) {
      // update the payment intent
      const current_intent = await stripe.paymentIntents.retrieve(
        payment_intent_id
      );

      if (current_intent) {
        const updated_intent = await stripe.paymentIntents.update(
          payment_intent_id,
          {
            amount: total,
          }
        );

        // update the order
        const [existing_order, updated_order] = await Promise.all([
          db.order.findFirst({
            where: {
              paymentIntentId: payment_intent_id,
            },
          }),
          db.order.update({
            where: {
              paymentIntentId: payment_intent_id,
            },
            data: {
              amount: total,
              products: items,
            },
          }),
        ]);

        if (!existing_order) {
          return NextResponse.json("Invalid Payment Intent", { status: 400 });
        }

        return NextResponse.json({ paymentIntent: updated_intent });
      }
    } else {
      // create the intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
        automatic_payment_methods: { enabled: true },
      });

      //   create the order
      orderData.paymentIntentId = paymentIntent.id;

      await db.order.create({
        data: orderData,
      });

      return NextResponse.json({ paymentIntent });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
