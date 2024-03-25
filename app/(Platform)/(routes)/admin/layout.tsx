import { Metadata } from "next";
import { AdminNav } from "./_components/admin-nav";

export const metadata: Metadata = {
  title: "E-Shop Admin",
  description: "E-Shop Admin Dashboard",
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AdminNav />
      {children}
    </div>
  );
};

export default AdminLayout;
