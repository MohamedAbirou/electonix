"use client";

import { Heading } from "@/components/heading";
import { Button } from "@/components/inputs/button";
import { Input } from "@/components/inputs/input";
import { SafeUser } from "@/types";
import axios from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { AiOutlineGoogle } from "react-icons/ai";

interface RegisterFormProps {
  currentUser: SafeUser | null;
}

export const RegisterForm = ({ currentUser }: RegisterFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
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
      // Perform your async operations here
      await axios.post("/api/register", data).then(() => {
        toast.success("User created!");

        signIn("credentials", {
          email: data.email,
          password: data.password,
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

  console.log("Is submitting: ", isSubmitting);

  return (
    <>
      <Heading title="Sign up for E-Shop" />
      <Button
        outline
        label="Continue with Google"
        icon={AiOutlineGoogle}
        onClick={() => signIn("google")}
      />
      <hr className="bg-sky-300 w-full h-px" />
      <Input
        id="name"
        label="Name"
        type="text"
        disabled={isSubmitting}
        register={register}
        errors={errors}
        required
      />
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
        label={isSubmitting ? "Loading..." : "Sign Up"}
        disabled={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Already have an account?{" "}
        <Link href="/login" className="hover:underline">
          Login
        </Link>
      </p>
    </>
  );
};
