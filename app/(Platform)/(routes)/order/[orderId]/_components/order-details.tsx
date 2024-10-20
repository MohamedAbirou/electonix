"use client";
import { Heading } from "@/components/heading";
import { Status } from "@/components/status";
import { formatter } from "@/utils/formatter";
import { Order } from "@prisma/client";
import moment from "moment";
import { OrderItem } from "./order-item";

interface OrderDetailsProps {
  order: Order;
}

export const OrderDetails = ({ order }: OrderDetailsProps) => {
  return (
    <div className="max-w-[1150px] m-auto flex flex-col space-y-5 gap-2">
      <div className="mt-8">
        <Heading title="Order Details" />
      </div>
      <div>Order ID: {order.id}</div>
      <div>
        Total Amount:{" "}
        <span className="font-bold">{formatter(order.amount / 100)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div>Payment status:</div>
        <div>
          {order.status === "pending" ? (
            <Status
              text="pending"
              bg="bg-zinc-200 px-2 mt-0"
              color="text-zinc-700"
            />
          ) : order.status === "complete" ? (
            <Status
              text="completed"
              bg="bg-green-200 px-2 mt-0"
              color="text-green-700"
            />
          ) : null}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <div>Delivery status:</div>
        <div>
          {order.deliveryStatus === "pending" ? (
            <Status
              text="pending"
              bg="bg-zinc-200 px-2 mt-0"
              color="text-zinc-700"
            />
          ) : order.deliveryStatus === "dispatched" ? (
            <Status
              text="dispatched"
              bg="bg-purple-200 px-2 mt-0"
              color="text-purple-700"
            />
          ) : order.deliveryStatus === "delivered" ? (
            <Status
              text="delivered"
              bg="bg-green-200 px-2 mt-0"
              color="text-green-700"
            />
          ) : null}
        </div>
      </div>
      <div>Date: {moment(order.createDate).fromNow()}</div>
      <div>
        <h2 className="font-semibold text-md mt-4 mb-2">Products ordered</h2>
        <div className="grid grid-cols-5 text-sm gap-4 pb-2 items-center">
          <div className="col-span-2 justify-self-start">PRODUCT</div>
          <div className=" justify-self-center">PRICE</div>
          <div className=" justify-self-center">QTY</div>
          <div className=" justify-self-end">TOTAL</div>
        </div>
        {order.products &&
          order.products.map((item) => <OrderItem key={item.id} item={item} />)}
      </div>
    </div>
  );
};
