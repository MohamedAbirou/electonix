import { db } from "@/lib/db";

export interface IParams {
  productId?: string;
}

export async function getProductById(params: IParams) {
  try {
    const { productId } = params;

    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        reviews: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!product) {
      return null;
    }

    return product;
  } catch (error) {
    console.log("[GET_PRODUCT]", error);
    return null;
  }
}
