import { db } from "@/lib/db";

export async function getOrdersByUserId(userId: string) {
  try {
    const orders = await db.order.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createDate: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.log("[GET_USER_ORDERS]", error);
    return null;
  }
}
