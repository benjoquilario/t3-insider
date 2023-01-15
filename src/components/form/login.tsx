/* eslint-disable @typescript-eslint/no-misused-promises */
import { useForm, type SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import React from "react";
import FormContainer from "./container";
import Input from "@/components/shared/input";
import Button from "@/components/shared/button";

type FormValues = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await signIn("credentials", {
        ...data,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormContainer title="Welcome to Insider!" type="Sign in to your account">
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button type="submit">Submit</Button>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
