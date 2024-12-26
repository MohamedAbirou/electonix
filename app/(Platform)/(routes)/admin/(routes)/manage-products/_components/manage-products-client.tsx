"use client";
import { CategoryItem } from "@/components/categories/categoryItem";
import { Heading } from "@/components/heading";
import { ActionBtn } from "@/components/inputs/action-btn";
import { Button } from "@/components/inputs/button";
import { Checkbox } from "@/components/inputs/checkbox";
import { Input } from "@/components/inputs/input";
import { TextArea } from "@/components/inputs/textarea";
import { Status } from "@/components/status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { categories } from "@/constants/categories";
import { app } from "@/lib/firebase";
import { formatter } from "@/utils/formatter";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Order, Product } from "@prisma/client";
import axios from "axios";
import { deleteObject, getStorage, ref } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MdCached, MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";

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

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isDialogLoading, setIsDialogLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      category: "",
      inStock: false,
      price: "",
    },
  });
  const router = useRouter();
  const storage = getStorage(app);
  let rows: any = [];
  const category = watch("category");

  useEffect(() => {
    if (editingProduct) {
      reset({
        name: editingProduct.name,
        description: editingProduct.description,
        brand: editingProduct.brand,
        category: editingProduct.category,
        inStock: editingProduct.inStock,
        price: editingProduct.price,
      });
    }
  }, [editingProduct, reset]);

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      setValue(id, value, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    },
    [setValue]
  );

  if (products) {
    rows = products.map((product) => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: formatter(product.price),
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        createdAt: product.createdAt
          ? new Date(product.createdAt).toLocaleDateString("en-US")
          : "N/A", // Fallback if createdAt is null
      };
    });
  }

  const handleEdit = async (productId: string) => {
    try {
      setIsDialogLoading(true);
      if (!productId) return;
      const response = await axios.get(`/api/product/${productId}`);

      // Ensure the response data conforms to SafeUser
      const userData: Product = {
        ...response.data,
        // Ensure non-nullable fields are set correctly, if needed
        name: response.data.name || "",
        price: response.data.price || "",
        category: response.data.category || "",
        brand: response.data.brand || "",
        inStock: response.data.inStock || false,
        images: response.data.images || [],
      };

      setEditingProduct(userData);
    } catch (error) {
      toast.error("Failed to load product data.");
    } finally {
      setIsDialogLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);

    if (!data.category) {
      setIsSubmitting(false);
      return toast.error("Category is not selected!");
    }

    try {
      if (!editingProduct?.id) return;
      await axios.put(`/api/product/${editingProduct?.id}`, {
        ...data,
        id: editingProduct?.id,
      });

      toast.success("Product updated successfully!");
      setEditingProduct(null);
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

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
      width: 145,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <div className="font-bold text-sky-800">{params.row.price}</div>
      ),
    },
    {
      field: "category",
      headerName: "Category",
      align: "center",
      width: 130,
    },
    {
      field: "brand",
      headerName: "Brand",
      align: "center",
      width: 120,
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
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
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center mt-2.5 justify-between gap-4 w-full">
          <ActionBtn
            icon={MdCached}
            onClick={() => handleToggleStock(params.row.id, params.row.inStock)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <ActionBtn
                icon={MdEdit}
                onClick={() => handleEdit(params.row.id)}
              />
            </DialogTrigger>
            <DialogContent className="max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogDescription>
                  Update product details below. Click update when you&apos;re
                  done.
                </DialogDescription>
              </DialogHeader>
              {isDialogLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="loader border-t-4 border-b-4 border-blue-500 w-8 h-8 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <Input
                    id="name"
                    label="Name"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    required
                  />
                  <Input
                    id="price"
                    label="Price"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    type="number"
                    required
                  />
                  <Input
                    id="brand"
                    label="Brand"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    required
                  />
                  <TextArea
                    id="description"
                    label="Description"
                    disabled={isSubmitting}
                    register={register}
                    errors={errors}
                    required
                  />
                  <Checkbox
                    id="inStock"
                    register={register}
                    label="This product is in stock"
                  />
                  <div className="w-full font-medium">
                    <div className="mt-10 mb-5 font-semibold">
                      Select a Category
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh]">
                      {categories.map((item) => {
                        if (item.label === "All") {
                          return null;
                        }

                        return (
                          <div key={item.label} className="col-span">
                            <CategoryItem
                              onClick={(category) =>
                                setCustomValue("category", category)
                              }
                              selected={category === item.label}
                              label={item.label}
                              icon={item.icon}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  label={isSubmitting ? "Updating..." : "Update"}
                  disabled={isSubmitting || isDialogLoading}
                  onClick={handleSubmit(onSubmit)}
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
    [orders, router, storage]
  );

  return (
    <div className="max-w-[1290px] m-auto text-xl">
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
