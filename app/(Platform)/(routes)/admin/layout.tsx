import { Metadata } from "next";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = {
  title: "ElectroniX Admin",
  description: "ElectroniX Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-">
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
