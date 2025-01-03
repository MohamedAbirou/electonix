import { getCurrentUser } from "@/actions/getCurrentUser";
import { Redressed } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { CartCount } from "./cart-count";
import { Categories } from "./categories/categories";
import Container from "./container";
import { SearchBar } from "./inputs/search-bar";
import { UserMenu } from "./user-menu";

const redressed = Redressed({ subsets: ["latin"], weight: ["400"] });

export const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <div className="top-0 w-full bg-sky-100 z-30 shadow-sm">
      <div className="py-4 px-3 border-b-[1px]">
        <Container>
          <div className="flex items-center justify-between gap-3 md:gap-0">
            <Link
              href="/"
              className={`${redressed.className} font-bold text-2xl`}
            >
              ElectroniX
            </Link>
            <div className="hidden md:block">
              <SearchBar />
            </div>
            <div className="flex items-center gap-8 md:gap-12">
              <CartCount />
              <UserMenu currentUser={currentUser} />
            </div>
          </div>
        </Container>
      </div>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-[100vh]">
            Loading...
          </div>
        }
      >
        <Categories />
      </Suspense>
    </div>
  );
};
