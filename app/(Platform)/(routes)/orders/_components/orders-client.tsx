"use client";
import { Heading } from "@/components/heading";
import { ActionBtn } from "@/components/inputs/action-btn";
import { Status } from "@/components/status";
import { formatter } from "@/utils/formatter";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Order, User } from "@prisma/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdRemoveRedEye } from "react-icons/md";

type ExtendedOrder = Order & {
  user: User;
};

interface OrdersClientProps {
  orders: ExtendedOrder[];
}

export const OrdersClient = ({ orders }: OrdersClientProps) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: { reset: boolean; dispatch: boolean; deliver: boolean };
  }>({});
  const router = useRouter();
  let rows: any = [];

  if (orders) {
    rows = orders.map((order) => {
      return {
        id: order.id,
        customer: order.user.name,
        amount: formatter(order.amount / 100),
        date: moment(order.createDate).fromNow(),
        paymentStatus: order.status,
        deliveryStatus: order.deliveryStatus,
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 220,
    },
    {
      field: "customer",
      headerName: "Customer Name",
      width: 130,
    },
    {
      field: "amount",
      headerName: "Amount(USD)",
      width: 130,
      renderCell: (params) => (
        <div className="font-bold text-sky-800">{params.row.amount}</div>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment Status",
      width: 130,
      renderCell: (params) => (
        <div>
          {params.row.paymentStatus === "pending" ? (
            <Status text="pending" bg="bg-zinc-200" color="text-zinc-700" />
          ) : params.row.paymentStatus === "complete" ? (
            <Status text="completed" bg="bg-green-200" color="text-green-700" />
          ) : null}
        </div>
      ),
    },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 130,
      renderCell: (params) => (
        <div>
          {params.row.deliveryStatus === "pending" ? (
            <Status
              text="pending"
              bg="bg-zinc-200"
              color="text-zinc-700"
              isLoading={
                loadingStates[params.row.id]?.reset ||
                loadingStates[params.row.id]?.dispatch ||
                loadingStates[params.row.id]?.deliver
              }
            />
          ) : params.row.deliveryStatus === "dispatched" ? (
            <Status
              text="dispatched"
              bg="bg-purple-200"
              color="text-purple-700"
              isLoading={
                loadingStates[params.row.id]?.dispatch ||
                loadingStates[params.row.id]?.reset
              }
            />
          ) : params.row.deliveryStatus === "delivered" ? (
            <Status
              text="delivered"
              bg="bg-green-200"
              color="text-green-700"
              isLoading={
                loadingStates[params.row.id]?.deliver ||
                loadingStates[params.row.id]?.reset
              }
            />
          ) : null}
        </div>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      width: 130,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <div className="flex items-center mt-2.5 justify-between gap-4 w-full">
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/order/${params.row.id}`)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="my-12">
        <Heading title="Orders" center />
      </div>
      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 9 },
            },
          }}
          pageSizeOptions={[10, 20]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};
