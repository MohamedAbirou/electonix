import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";
import Container from "@/components/container";
import { ManageProductsClient } from "./_components/manage-products-client";
import { getProducts } from "@/actions/getProducts";
import { getOrders } from "@/actions/getOrders";

const ManageProducts = async () => {
  const products = await getProducts({ category: null });
  const orders = await getOrders();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageProductsClient products={products!} orders={orders!} />
      </Container>
    </div>
  );
};

export default ManageProducts;
