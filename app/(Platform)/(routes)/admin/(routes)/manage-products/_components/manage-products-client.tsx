"use client";
import { Product } from "@prisma/client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { formatter } from "@/utils/formatter";
import { Heading } from "@/components/heading";
import { Status } from "@/components/status";
import { ActionBtn } from "@/components/inputs/action-btn";
import { MdCached, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { app } from "@/lib/firebase";

interface ManageProductsClientProps {
  products: Product[];
}

export const ManageProductsClient = ({
  products,
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
      field: "name",
      headerName: "Name",
      width: 220,
    },
    {
      field: "price",
      headerName: "Price(USD)",
      width: 100,
      renderCell: (params) => (
        <div className="font-bold text-slate-800">{params.row.price}</div>
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
      field: "inStock",
      headerName: "InStock",
      width: 120,
      renderCell: (params) => (
        <div>
          {params.row.inStock === true ? (
            <Status
              text="in stock"
              bg="bg-teal-200"
              color="text-teal-700"
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
    [router, storage]
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
