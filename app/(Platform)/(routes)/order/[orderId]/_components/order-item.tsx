import { formatter } from "@/utils/formatter";
import { truncateText } from "@/utils/truncate-text";
import { CartProductType } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderItemProps {
  item: CartProductType;
}

export const OrderItem = ({ item }: OrderItemProps) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-5 overflow-x-scroll text-xs md:text-sm gap-4 border-t-[1.5px] border-sky-200 py-4 items-center">
      <div className="col-span-2 justify-self-start flex gap-2 md:gap-4">
        <div className="relative w-[70px] aspect-square">
          <Image
            src={item.selectedImg.image}
            alt={item.name}
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div
            onClick={() => router.push(`/product/${item.id}`)}
            className="cursor-pointer hover:underline"
          >
            {truncateText(item.name)}
          </div>
          <div>{item.selectedImg.color}</div>
        </div>
      </div>
      <div className="justify-self-center">{formatter(item.price)}</div>
      <div className="justify-self-center">{item.quantity}</div>
      <div className="justify-self-end font-semibold">
        {formatter(item.price * item.quantity)}
      </div>
    </div>
  );
};
