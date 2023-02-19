import React from "react";
import FormContainer from "./container";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import { useRouter } from "next/router";
import { trpc } from "@/lib/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import Loader from "../shared/loader";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const RegisterForm = () => {
  const router = useRouter();

  const { mutateAsync, isLoading } = trpc.auth.register.useMutation({
    onError: (e) => console.log(e.message),
    onSuccess: () => router.push("/login"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  console.log(errors);

  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    await mutateAsync(data);
  };

  return (
    <FormContainer title="Welcome to Insider!" type="Create an Account">
      <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
        <div className="flex gap-2">
          <Input
            {...register("firstName", { required: true })}
            type="text"
            placeholder="FirstName"
          />
          <Input
            {...register("lastName", { required: true })}
            type="text"
            placeholder="LastName"
          />
        </div>

        <Input
          {...register("email", { required: true })}
          type="email"
          placeholder="Email"
        />
        <Input
          {...register("password", { required: true })}
          type="password"
          placeholder="Password"
        />
        <Input
          {...register("confirmPassword", { required: true })}
          type="password"
          placeholder="Confirm Password"
        />
        <Button
          disabled={isLoading}
          type="submit"
          className="flex h-10 w-full items-center justify-center rounded bg-primary text-sm font-medium leading-snug text-white shadow-md transition duration-150 ease-in-out focus:shadow-lg focus:outline-none focus:ring-0 hover:bg-secondary hover:shadow-lg active:bg-[#5f4ce1] active:shadow-lg"
        >
          {isLoading ? (
            <Loader
              classNameIcon="animate-spin w-6 h-6"
              classNameContainer="text-white"
            />
          ) : (
            "Register"
          )}
        </Button>
        <div className="text-left text-sm">
          <span className="text-zinc-900">Have already and account? </span>
          <Link
            className="text-primary transition duration-200 ease-in-out focus:text-primary hover:text-secondary"
            href="/login"
          >
            Login Here
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
