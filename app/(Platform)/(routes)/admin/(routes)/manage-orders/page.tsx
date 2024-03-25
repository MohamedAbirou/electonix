import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";
import { ManageOrdersClient } from "./_components/manage-orders-client";
import Container from "@/components/container";
import { getOrders } from "@/actions/getOrders";

const ManageOrders = async () => {
  const orders = await getOrders();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageOrdersClient orders={orders!} />
      </Container>
    </div>
  );
};

export default ManageOrders;
