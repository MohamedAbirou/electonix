import { getCurrentUser } from "@/actions/getCurrentUser";
import { NullData } from "@/components/NullData";
import { AdminSummary } from "./_components/admin-summary";
import { getProducts } from "@/actions/getProducts";
import { getOrders } from "@/actions/getOrders";
import { getUsers } from "@/actions/getUsers";
import Container from "@/components/container";
import { AdminBarGraph } from "./_components/admin-bar-graph";
import { getGraphData } from "@/actions/getGraphData";

const AdminPage = async () => {
  const currentUser = await getCurrentUser();
  const products = await getProducts({ category: null });
  const orders = await getOrders();
  const users = await getUsers();
  const graphData = await getGraphData(new Date().getFullYear());

  if (!currentUser || currentUser.role !== "ADMIN") {
    return <NullData title="Oops! Access Denied!" redirect={true} />;
  }

  return (
    <div className="pt-8">
      <Container>
        <AdminSummary products={products!} orders={orders!} users={users!} />
        <div className="mt-20 mx-auto max-w-[1150px]">
          <AdminBarGraph initialData={graphData!} />
        </div>
      </Container>
    </div>
  );
};

export default AdminPage;
