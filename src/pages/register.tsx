import RegisterForm from "@/components/form/register";
import Layout from "@/components/layout";
import React from "react";

const Register = () => {
  return (
    <Layout isHome={false}>
      <RegisterForm />
    </Layout>
  );
};

export default Register;
