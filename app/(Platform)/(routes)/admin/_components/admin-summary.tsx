"use client";

import { Heading } from "@/components/heading";
import { formatter } from "@/utils/formatter";
import { numberFormatter } from "@/utils/numberFormatter";
import { Order, Product, User } from "@prisma/client";
import { useEffect, useState } from "react";

interface AdminSummaryProps {
  products: Product[];
  orders: Order[];
  users: User[];
}

type SummaryDataType = {
  [key: string]: {
    label: string;
    digit: number;
  };
};

export const AdminSummary = ({
  products,
  orders,
  users,
}: AdminSummaryProps) => {
  const [summaryData, setSummaryData] = useState<SummaryDataType>({
    sale: {
      label: "Total Sales",
      digit: 0,
    },
    products: {
      label: "Total Products",
      digit: 0,
    },
    orders: {
      label: "Total Orders",
      digit: 0,
    },
    paidOrders: {
      label: "Paid Orders",
      digit: 0,
    },
    unpaidOrders: {
      label: "Unpaid Orders",
      digit: 0,
    },
    users: {
      label: "Total Users",
      digit: 0,
    },
  });

  useEffect(() => {
    setSummaryData((prev) => {
      let tempData: any = { ...prev };

      const totalSale = orders?.reduce((acc, item) => {
        if (item.status === "complete") {
          return acc + (item.amount / 100);
        } else return acc;
      }, 0);

      const paidOrders = orders?.filter((order) => order.status === "complete");

      const unpaidOrders = orders?.filter(
        (order) => order.status === "pending"
      );

      tempData.sale.digit = totalSale ?? 0;
      tempData.orders.digit = orders?.length ?? 0;
      tempData.paidOrders.digit = paidOrders?.length ?? 0;
      tempData.unpaidOrders.digit = unpaidOrders?.length ?? 0;
      tempData.products.digit = products.length;
      tempData.users.digit = users.length;

      return tempData;
    });
  }, [orders, products.length, users.length]);

  const summaryKeys = Object.keys(summaryData);

  return (
    <div className="max-w-[1150px] m-auto">
      <div className="mb-4 mt-8">
        <Heading title="Stats" center />
      </div>
      <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto">
        {summaryKeys &&
          summaryKeys.map((key) => (
            <div
              key={key}
              className="rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition"
            >
              <div className="text-xl md:text-4xl font-bold">
                {summaryData[key].label === "Total Sales" ? (
                  <>{formatter(summaryData[key].digit)}</>
                ) : (
                  <>{numberFormatter(summaryData[key].digit)}</>
                )}
              </div>
              <div>{summaryData[key].label}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
