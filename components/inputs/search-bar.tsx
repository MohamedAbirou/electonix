"use client";

import { useRouter } from "next/navigation";
import qs from "query-string";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export const SearchBar = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      searchTerm: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    if (!data.searchTerm) return router.push("/");

    const url = qs.stringifyUrl(
      {
        url: "/",
        query: {
          searchTerm: data.searchTerm,
        },
      },
      { skipNull: true }
    );

    router.push(url);
    reset();
  };

  return (
    <div className="flex items-center">
      <input
        {...register("searchTerm")}
        type="text"
        className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-[0.5px] focus:border-sky-500 w-80"
        placeholder="Explore E-Shop"
        autoComplete="off"
      />
      <button
        onClick={handleSubmit(onSubmit)}
        className="bg-sky-700 hover:opacity-80 text-white p-2 rounded-r-md"
      >
        Search
      </button>
    </div>
  );
};
