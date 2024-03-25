"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface NullDataProps {
  title: string;
  redirect?: boolean;
}

export const NullData = ({ title, redirect }: NullDataProps) => {
  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [router, redirect]);

  return (
    <div className="w-full h-[50vh] flex flex-col items-center justify-center text-xl">
      <p className="font-medium text-red-500">{title}</p>
      {redirect && (
        <p className="inline text-sm">
          Redirecting
          <span className="inline animate-ping">.</span>
          <span className="inline animate-ping delay-100">.</span>
          <span className="inline animate-ping delay-200">.</span>
        </p>
      )}
    </div>
  );
};
