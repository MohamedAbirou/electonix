import { db } from "@/lib/db";

export async function getOrders() {
  try {
    const orders = await db.order.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createDate: "desc",
      },
    });

    return orders;
  } catch (error) {
    console.log("[GET_ORDERS]", error);
    return null;
  }
}
