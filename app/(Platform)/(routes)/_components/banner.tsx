import Image from "next/image";

export const Banner = () => {
  return (
    <div className="relative bg-gradient-to-r from-sky-500 to-sky-700 mb-8">
      <div className="mx-auto px-8 py-12 flex flex-col gap-2 md:flex-row items-center justify-evenly">
        <div className="mb-8 md:mb-0 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Summer Sale
          </h1>
          <p className="text-xl text-white mb-2">
            Enjoy discount on selected items
          </p>
          <p className="uppercase text-2xl text-yellow-400 font-bold">
            get 50% off
          </p>
        </div>
        <div className="w-1/3 relative aspect-video">
          <Image
            src="/banner.png"
            alt="banner-img"
            className="object-contain"
            fill
          />
        </div>
      </div>
    </div>
  );
};
