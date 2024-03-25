import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

export const Avatar = ({ src }: { src?: string | null | undefined }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        height={30}
        width={30}
      />
    );
  }

  return <FaUserCircle size={24} />;
};
