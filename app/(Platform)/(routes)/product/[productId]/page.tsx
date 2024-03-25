import Container from "@/components/container";
import { ProductDetails } from "./_components/product-details";
import { ListRating } from "./_components/list-rating";
import { getProductById } from "@/actions/getProductById";
import { NullData } from "@/components/NullData";
import { AddRating } from "./_components/add-rating";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface IParams {
  productId?: string;
}

const ProductPage = async ({ params }: { params: IParams }) => {
  const product = await getProductById(params);
  const user = await getCurrentUser();

  if (!product)
    return (
      <NullData
        title="Oops! Product with the given id does not exist"
        redirect={true}
      />
    );
  return (
    <div className="p-8">
      <Container>
        <ProductDetails product={product} />
        <div className="flex flex-col mt-20 gap-4">
          <AddRating product={product} user={user} />
          {product.reviews.length > 0 && <ListRating product={product} />}
        </div>
      </Container>
    </div>
  );
};

export default ProductPage;
