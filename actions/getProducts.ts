import { db } from "@/lib/db";

export interface IProductParams {
  category?: string | null;
  searchTerm?: string | null;
}

export async function getProducts(params: IProductParams) {
  try {
    const { category, searchTerm } = params;
    let searchString = searchTerm;

    if (!searchTerm) {
      searchString = "";
    }

    let query: any = {};

    if (category) {
      query.category = category;
    }

    const products = await db.product.findMany({
      where: {
        ...query,
        OR: [
          {
            name: {
              contains: searchString,
              mode: "insensitive",
            },
            description: {
              contains: searchString,
              mode: "insensitive",
            },
          },
        ],
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

    return products;
  } catch (error) {
    console.log("[GET_PRODUCTS]", error);
    return null;
  }
}
