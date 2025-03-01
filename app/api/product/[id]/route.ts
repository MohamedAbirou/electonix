import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
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

    const product = await db.product.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[GET_PRODUCT]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { id, name, description, price, brand, category, inStock, images } =
      body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const product = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        price: parseFloat(price),
        brand,
        category,
        inStock,
        images,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[UPDATE_PRODUCT]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}

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
