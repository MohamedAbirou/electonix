import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id } = params;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const order = await db.order.findMany({
      where: {
        products: {
          some: {
            id,
          },
        },
      },
    });

    // Cannot delete a product if it is being ordered
    if (order.length > 0) {
      return NextResponse.json(
        "Cannot delete product while it is being ordered",
        { status: 400 }
      );
    }

    const product = await db.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[DELETE_PRODUCT]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
