import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";
import Container from "@/components/container";
import { getOrders } from "@/actions/getOrders";
import { getUsers } from "@/actions/getUsers";
import { ManageUsersClient } from "./_components/manage-users-client";

const ManageProducts = async () => {
  const users = await getUsers();
  const orders = await getOrders();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageUsersClient
          users={users!}
          orders={orders!}
          currentUser={currentUser!}
        />
      </Container>
    </div>
  );
};

export default ManageProducts;
