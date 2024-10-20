import { IconType } from "react-icons";

interface AdminNavItemProps {
  selected?: boolean;
  icon: IconType;
  label: string;
}

export const AdminNavItem = ({
  selected,
  icon: Icon,
  label,
}: AdminNavItemProps) => {
  return (
    <div
      className={`flex items-center justify-center text-center gap-1 p-2 border-b-2 hover:text-sky-800 transition cursor-pointer ${
        selected
          ? "border-b-sky-800 text-sky-800"
          : "border-transparent text-sky-500"
      }`}
    >
      <Icon size={20} />
      <div className="font-medium text-sm text-center break-normal">
        {label}
      </div>
    </div>
  );
};
