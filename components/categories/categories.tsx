"use client";

import { categories } from "@/constants/categories";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "../container";
import { Category } from "./category";

export const Categories = () => {
  const params = useSearchParams();
  const category = params?.get("category");

  const pathname = usePathname();

  const isMainPage = pathname === "/";

  if (!isMainPage) return null;

  return (
    <div className="bg-white">
      <Container>
        <div className="pt-4 px-3 flex flex-row items-center justify-between overflow-x-auto">
          {categories.map((item) => (
            <Suspense
              key={item.label}
              fallback={
                <div className="flex items-center justify-center h-[100vh]">
                  Loading...
                </div>
              }
            >
              <Category
                label={item.label}
                icon={item.icon}
                selected={
                  category === item.label ||
                  (category === null && item.label === "All")
                }
              />
            </Suspense>
          ))}
        </div>
      </Container>
    </div>
  );
};
