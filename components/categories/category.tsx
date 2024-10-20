import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useCallback } from "react";
import { IconType } from "react-icons";

interface CategoryProps {
  label: string;
  icon: IconType;
  selected?: boolean;
}

export const Category = ({ label, icon: Icon, selected }: CategoryProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    if (label === "All") {
      router.push("/");
    } else {
      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString());
      }

      const updatedQuery: any = {
        ...currentQuery,
        category: label,
      };

      const url = qs.stringifyUrl(
        {
          url: "/",
          query: updatedQuery,
        },
        {
          skipNull: true,
        }
      );

      router.push(url);
    }
  }, [label, params, router]);

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 hover:text-sky-800 transition cursor-pointer ${
        selected
          ? "border-b-sky-800 text-sky-800"
          : "border-transparent text-sky-500"
      }`}
    >
      <Icon size={20} />
      <div className="font-medium">{label}</div>
    </div>
  );
};
