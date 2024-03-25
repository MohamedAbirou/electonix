import {
  MdDashboard,
  MdDns,
  MdFormatListBulleted,
  MdLibraryAdd,
} from "react-icons/md";

export const adminRoutes = [
  {
    href: "/admin",
    label: "Summary",
    icon: MdDashboard,
  },
  {
    href: "/admin/add-products",
    label: "Add Products",
    icon: MdLibraryAdd,
  },
  {
    href: "/admin/manage-products",
    label: "Manage Products",
    icon: MdDns,
  },
  {
    href: "/admin/manage-orders",
    label: "Manage Orders",
    icon: MdFormatListBulleted,
  },
];
