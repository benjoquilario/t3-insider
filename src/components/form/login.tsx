import { signIn } from "next-auth/react";
import React, { useState } from "react";
import FormContainer from "./container";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import Loader from "../shared/loader";
import Link from "next/link";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  console.log(errors);
  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    try {
      await signIn("credentials", {
        ...data,
        callbackUrl: "/",
      });
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormContainer title="Welcome to Insider!" type="Sign in to your account">
      <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          labelClassName="sr-only"
          label="email"
          type="email"
          className=""
          placeholder="Email"
          {...register("email", { required: true })}
        />
        <Input
          labelClassName="sr-only"
          label="password"
          type="password"
          className=""
          placeholder="Password"
          {...register("password", { required: true })}
        />
        <Button
          type="submit"
          className="flex h-10 w-full items-center justify-center rounded bg-primary text-sm font-medium leading-snug text-white shadow-md transition duration-150 ease-in-out focus:shadow-lg focus:outline-none focus:ring-0 hover:bg-secondary hover:shadow-lg active:bg-[#5f4ce1] active:shadow-lg"
        >
          {isLoading ? (
            <Loader
              classNameIcon="animate-spin w-6 h-6"
              classNameContainer="text-white"
            />
          ) : (
            "Login"
          )}
        </Button>
        <div className="text-left text-sm">
          <span className="text-zinc-900">Don't have an account? </span>
          <Link
            className="text-primary transition duration-200 ease-in-out focus:text-primary hover:text-secondary "
            href="/register"
          >
            Register
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
