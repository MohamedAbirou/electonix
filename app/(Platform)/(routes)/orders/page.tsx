import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";
import Container from "@/components/container";
import { getOrdersByUserId } from "@/actions/getOrdersByUserId";
import { OrdersClient } from "./_components/orders-client";

const Orders = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  const orders = await getOrdersByUserId(currentUser.id);

  if (!orders) {
    return <NullData title="No orders yet..." />;
  }

  return (
    <div className="pt-8">
      <Container>
        <OrdersClient orders={orders!} />
      </Container>
    </div>
  );
};

export default Orders;
