/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import FormContainer from "./container";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import { useForm, type SubmitHandler } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
};

const RegisterForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");

  const mutation = trpc.auth.register.useMutation({
    onError: (e) => setErrorMessage(e.message),
    onSuccess: () => router.push("/login"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleOnSubmit: SubmitHandler<FormValues> = async (data) => {
    setErrorMessage(undefined);
    await mutation.mutateAsync(data);
  };

  return (
    <FormContainer title="Welcome to Insider!" type="Create an Account">
      <form className="w-full" onSubmit={handleSubmit(handleOnSubmit)}>
        <Input
          type="text"
          {...register("firstName", { required: true })}
          placeholder="FirstName"
        />
        <Input
          type="text"
          {...register("lastName", { required: true })}
          placeholder="LastName"
        />
        <Input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
        />
        <Input
          type="password"
          {...register("password", { required: true })}
          placeholder="Password"
        />
        <Input
          type="password"
          {...register("confirmPassword", { required: true })}
          placeholder="Confirm Password"
        />
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
