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

    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[GET_USER]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { id, name, email } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[UPDATE_USER]", error);
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

    // Delete all related orders
    await db.order.deleteMany({
      where: {
        userId: id,
      },
    });

    const user = await db.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[DELETE_USER]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
