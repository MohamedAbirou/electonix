"use client";
import { Heading } from "@/components/heading";
import { ActionBtn } from "@/components/inputs/action-btn";
import { Button } from "@/components/inputs/button";
import { Input } from "@/components/inputs/input";
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
import { SafeUser } from "@/types";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  MdAdminPanelSettings,
  MdDelete,
  MdEdit,
  MdOutlinePerson,
} from "react-icons/md";

interface ManageUsersClientProps {
  users: User[];
  currentUser: SafeUser;
}

export const ManageUsersClient = ({
  users,
  currentUser,
}: ManageUsersClientProps) => {
  const [isLoading, setIsLoading] = useState<{
    [key: string]: { role: boolean };
  }>({});
  const [editingUser, setEditingUser] = useState<SafeUser | null>(null);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Add this
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        name: editingUser.name || "",
        email: editingUser.email || "",
      });
    }
  }, [editingUser, reset]);

  const router = useRouter();
  let rows: any = [];

  if (users) {
    rows = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US")
          : "N/A", // Fallback if createdAt is null
        updatedAt: user.updatedAt
          ? new Date(user.updatedAt).toLocaleDateString("en-US")
          : "N/A", // Fallback if updatedAt is null
      };
    });
  }

  const handleEdit = async (userId: string) => {
    try {
      setIsDialogLoading(true);
      if (!userId) return;
      const response = await axios.get(`/api/user/${userId}`);

      // Ensure the response data conforms to SafeUser
      const userData: SafeUser = {
        ...response.data,
        // Ensure non-nullable fields are set correctly, if needed
        name: response.data.name || "",
        email: response.data.email || "",
        role: response.data.role || "USER", // or a default value as per your enum
      };

      setEditingUser(userData);
      setIsDialogOpen(true); // Open the dialog
    } catch (error) {
      toast.error("Failed to load user data.");
    } finally {
      setIsDialogLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      if (!editingUser) return;
      await axios.put(`/api/user/${editingUser.id}`, {
        ...data,
        id: editingUser.id,
      });
      toast.success("User updated successfully!");
      setEditingUser(null);
      setIsDialogOpen(false); // Close the dialog
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
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "role",
      headerName: "Role",
      width: 105,
      renderCell: (params) => (
        <div>
          {params.row.role === "ADMIN" ? (
            <Status
              text="Admin"
              bg="bg-emerald-200"
              color="text-emerald-700"
              isLoading={isLoading[params.row.id]?.role}
            />
          ) : (
            <Status
              text="User"
              bg="bg-sky-200"
              color="text-sky-700"
              isLoading={isLoading[params.row.id]?.role}
            />
          )}
        </div>
      ),
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
      field: "updatedAt",
      headerName: "Updated At",
      width: 150,
      align: "center",
      renderCell: (params) => (
        <div className="font-bold text-sky-800">{params.row.updatedAt}</div>
      ),
    },
    {
      field: "action",
      headerName: "Actions",
      headerAlign: "center",
      width: 200,
      renderCell: (params) => (
        <div className="flex items-center mt-2.5 justify-around w-full">
          <ActionBtn
            icon={
              params.row.role === "ADMIN"
                ? MdAdminPanelSettings
                : MdOutlinePerson
            }
            onClick={() => handleToggleRole(params.row.id, params.row.role)}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <ActionBtn
                icon={MdEdit}
                onClick={() => handleEdit(params.row.id)}
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Update user details below. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              {isDialogLoading ? (
                <div className="flex justify-center items-center h-[200px]">
                  <div className="loader border-t-4 border-b-4 border-blue-500 w-8 h-8 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid gap-4 py-4">
                  <div>
                    <Input
                      id="name"
                      label="Name"
                      type="text"
                      disabled={isSubmitting}
                      register={register}
                      errors={errors}
                    />
                  </div>
                  <div>
                    <Input
                      id="email"
                      label="Email"
                      type="email"
                      disabled={isSubmitting}
                      register={register}
                      errors={errors}
                    />
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
            onClick={() => handleDelete(params.row.id)}
          />
        </div>
      ),
    },
  ];

  const handleToggleRole = useCallback(
    async (id: string, role: string) => {
      try {
        setIsLoading((prevLoadingState) => ({
          ...prevLoadingState,
          [id]: { ...prevLoadingState[id], role: true },
        }));

        await axios.put("/api/user", {
          id,
          role,
        });

        toast.success("User role changed!");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong!");
      } finally {
        setIsLoading((prevLoadingState) => ({
          ...prevLoadingState,
          [id]: { ...prevLoadingState[id], role: false },
        }));
      }
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        toast("Deleting user, please wait!");

        // Cannot delete a user if it is the current user
        if (id === currentUser?.id) {
          toast.error("Cannot delete yourself!");
          return;
        }

        await axios.delete(`/api/user/${id}`);
        toast.success("User deleted!");
        router.refresh();
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    [currentUser?.id, router]
  );

  return (
    <div className="max-w-[1250px] m-auto text-xl">
      <div className="my-12">
        <Heading title="Manage Users" center />
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
