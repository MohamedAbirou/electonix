import { FaSpinner } from "react-icons/fa";

interface StatusProps {
  text: string;
  bg: string;
  color: string;
  isLoading?: boolean;
}

export const Status = ({ text, bg, color, isLoading }: StatusProps) => {
  return (
    <div
      className={`${bg} ${color} h-7 mt-[0.66rem] rounded flex items-center justify-center`}
    >
      {isLoading ? (
        <FaSpinner size={15} className="animate-spin" />
      ) : (
        <p>{text}</p>
      )}
    </div>
  );
};
