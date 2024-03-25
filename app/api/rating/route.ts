import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { Review } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { comment, rating, product, userId } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const deliveredOrder = currentUser?.orders.some(
      (order) =>
        order.products.find((item) => item.id === product.id) &&
        order.deliveryStatus === "delivered"
    );

    const userReview = product?.reviews.find(
      (review: Review) => review.userId === currentUser.id
    );

    if (userReview || !deliveredOrder) {
      return NextResponse.json("Already rated or Not delivered yet!", {
        status: 401,
      });
    }

    const review = await db.review.create({
      data: {
        comment,
        rating,
        productId: product.id,
        userId,
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.log("[CREATE_REVIEW]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
