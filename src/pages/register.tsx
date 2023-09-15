import RegisterForm from "@/components/form/register";
import Layout from "@/components/layout";
import { NextSeo } from "next-seo";
import React from "react";

const Register = () => {
  return (
    <React.Fragment>
    <NextSeo title="Insider - login or sign up"/>
      <Layout isHome={false}>
        <RegisterForm />
      </Layout>
    </React.Fragment>
  );
};

export default Register;
