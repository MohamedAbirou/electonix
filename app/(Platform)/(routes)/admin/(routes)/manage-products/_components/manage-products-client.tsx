"use client";
import { Heading } from "@/components/heading";
import { ActionBtn } from "@/components/inputs/action-btn";
import { Status } from "@/components/status";
import { app } from "@/lib/firebase";
import { formatter } from "@/utils/formatter";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Order, Product } from "@prisma/client";
import axios from "axios";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { MdCached, MdDelete, MdRemoveRedEye } from "react-icons/md";

interface ManageProductsClientProps {
  products: Product[];
  orders: Order[];
}

export const ManageProductsClient = ({
  products,
  orders,
}: ManageProductsClientProps) => {
  const [isLoading, setIsLoading] = useState<{
    [key: string]: { inStock: boolean };
  }>({});
  const router = useRouter();
  const storage = getStorage(app);
  let rows: any = [];

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        price: formatter(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        images: product.images,
        createdAt: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString("en-US")
          : "N/A", // Fallback if createdAt is null
      };
    });
  }

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 150,
    },
    {
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 100,
      renderCell: (params) => (
        <div className="font-bold text-sky-800">{params.row.price}</div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 100,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 100,
      align: "center",
      renderCell: (params) => (
        <div className="font-bold text-sky-800">{params.row.createdAt}</div>
      ),
    },
    {
      field: "inStock",
      headerName: "InStock",
      width: 120,
      renderCell: (params) => (
        <div>
          {params.row.inStock === true ? (
            <Status
              text="in stock"
              bg="bg-emerald-200"
              color="text-emerald-700"
              isLoading={isLoading[params.row.id]?.inStock}
            />
          ) : (
            <Status
              text="out of stock"
              bg="bg-rose-200"
              color="text-rose-700"
              isLoading={isLoading[params.row.id]?.inStock}
            />
          )}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center mt-2.5 justify-between gap-4 w-full">
          <ActionBtn
            icon={MdCached}
            onClick={() => handleToggleStock(params.row.id, params.row.inStock)}
          />
          <ActionBtn
            icon={MdDelete}
            onClick={() => handleDelete(params.row.id, params.row.images)}
          />
          <ActionBtn
            icon={MdRemoveRedEye}
            onClick={() => router.push(`/product/${params.row.id}`)}
          />
        </div>
      ),
    },
  ];

  const handleToggleStock = useCallback(
    async (id: string, inStock: boolean) => {
      try {
        setIsLoading((prevLoadingState) => ({
          ...prevLoadingState,
          [id]: { ...prevLoadingState[id], inStock: true },
        }));

        await axios.put("/api/product", {
          id,
          inStock: !inStock,
        });

        toast.success("Product status changed!");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setIsLoading((prevLoadingState) => ({
          ...prevLoadingState,
          [id]: { ...prevLoadingState[id], inStock: false },
        }));
      }
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string, images: any[]) => {
      try {
        toast("Deleting product, please wait!");

        // Cannot delete a product if it is being ordered
        const order = orders.filter((order) =>
          order.products.some((p) => p.id === id)
        );

        if (order.length > 0) {
          toast.error("Cannot delete product while it is being ordered");
          return;
        }

        const handleImageDelete = async () => {
          try {
            for (const item of images) {
              if (item.image) {
                const imageRef = ref(storage, item.image);
                await deleteObject(imageRef);
                console.log("image deleted", item.image);
              }
            }
          } catch (error) {
            toast.error("Could not delete image from storage!");
          }
        };

        await handleImageDelete();

        await axios.delete(`/api/product/${id}`);
        toast.success("Product deleted!");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    [router, storage, products]
  );

  return (
    <div className="max-w-[1150px] m-auto text-xl">
      <div className="my-12">
        <Heading title="Manage Products" center />
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
