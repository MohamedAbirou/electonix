import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name, description, price, brand, category, inStock, images } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const product = await db.product.create({
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
    console.log("REGISTER_USER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { id, inStock } = body;

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
        inStock,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_STATUS]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
