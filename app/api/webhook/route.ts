import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParse: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  if (!signature) {
    return NextResponse.json("Missing the stripe signature!", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "charge.succeeded":
      const charge: any = event.data.object as Stripe.Charge;

      if (typeof charge.payment_intent === "string") {
        await db?.order.update({
          where: {
            paymentIntentId: charge.payment_intent,
          },
          data: {
            status: "complete",
            address: charge.shipping?.address,
          },
        });
      }
      break;
    default:
      console.log("Unhandled event type: " + event.type);
  }

  return new NextResponse(null, { status: 200 });
}
