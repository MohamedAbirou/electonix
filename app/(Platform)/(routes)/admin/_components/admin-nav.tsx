"use client";
import Container from "@/components/container";
import Link from "next/link";
import { AdminNavItem } from "./admin-nav-item";
import { usePathname } from "next/navigation";
import { adminRoutes } from "@/constants/admin-routes";

export const AdminNav = () => {
  const pathname = usePathname();

  return (
    <div className="w-full shadow-sm top-20 border-b-[1px] pt-4">
      <Container>
        <div className="flex flex-nowrap items-center justify-between md:justify-center gap-8 md:gap-12 overflow-x-auto">
          {adminRoutes.map((route, index) => (
            <Link key={index} href={route.href}>
              <AdminNavItem
                label={route.label}
                icon={route.icon}
                selected={pathname === route.href}
              />
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
};
