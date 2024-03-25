import Container from "@/components/container";
import { OrderDetails } from "./_components/order-details";
import { getOrderById } from "@/actions/getOrderById";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";

interface IParams {
  orderId?: string;
}

const OrderPage = async ({ params }: { params: IParams }) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  const order = await getOrderById(params);

  if (!order) {
    return <NullData title="No orders yet..." />;
  }
  return (
    <div className="p-8">
      <Container>
        <OrderDetails order={order!} />
      </Container>
    </div>
  );
};

export default OrderPage;
