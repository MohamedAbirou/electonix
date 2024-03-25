import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { id, deliveryStatus } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const order = await db.order.update({
      where: {
        id,
      },
      data: {
        deliveryStatus,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.log("[ORDER_DELIVERY_STATUS]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
