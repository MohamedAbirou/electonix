"use client";
import { Heading } from "@/components/heading";
import { Button } from "@/components/inputs/button";
import { Input } from "@/components/inputs/input";
import { SafeUser } from "@/types";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineGoogle } from "react-icons/ai";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

export const LoginForm = ({ currentUser }: LoginFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push("/");
      router.refresh();
    }
  }, [currentUser, router]);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await signIn("credentials", {
        ...data,
        redirect: false,
      }).then((callback) => {
        setIsSubmitting(false);

        if (callback?.ok) {
          router.push("/");
          router.refresh();
          toast.success("Logged In!");
        }

        if (callback?.error) {
          toast.error(callback.error);
        }
      });
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentUser) {
    return <p className="text-center">Logged in. Redirecting...</p>;
  }

  return (
    <>
      <Heading title="Sign in to E-Shop" />
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => signIn("google")}
      />
      <hr className="bg-sky-300 w-full h-px" />
      <Input
        id="email"
        label="Email"
        type="email"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
      <Button
        label={isSubmitting ? "Loading..." : "Sign In"}
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="hover:underline">
          Sign Up
        </Link>
      </p>
    </>
  );
};
