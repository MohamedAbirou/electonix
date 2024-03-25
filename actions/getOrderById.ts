import { db } from "@/lib/db";

export interface IParams {
  orderId?: string;
}

export async function getOrderById(params: IParams) {
  try {
    const { orderId } = params;

    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) return null;

    return order;
  } catch (error) {
    console.log("[GET_ORDER_BY_ID]", error);
    return null;
  }
}
