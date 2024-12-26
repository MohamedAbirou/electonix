import { getCurrentUser } from "@/actions/getCurrentUser";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { name, email, password } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("REGISTER_USER", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await req.json();
    const { id, role } = body;

    if (!currentUser) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    const updatedRole = role === "ADMIN" ? "USER" : "ADMIN";

    const user = await db.user.update({
      where: {
        id,
      },
      data: {
        role: updatedRole,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[UPDATE_USER_ROLE]", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}
