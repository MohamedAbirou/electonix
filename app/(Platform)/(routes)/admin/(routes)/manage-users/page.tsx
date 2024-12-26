import { getCurrentUser } from "@/actions/getCurrentUser";
import { getUsers } from "@/actions/getUsers";
import { NullData } from "@/components/NullData";
import Container from "@/components/container";
import { ManageUsersClient } from "./_components/manage-users-client";

const ManageProducts = async () => {
  const users = await getUsers();

  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="pt-8">
      <Container>
        <ManageUsersClient users={users!} currentUser={currentUser!} />
      </Container>
    </div>
  );
};

export default ManageProducts;
