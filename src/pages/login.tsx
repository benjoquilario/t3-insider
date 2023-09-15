import React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerAuthSession } from "@/server/auth";
import Layout from "@/components/layout";
import LoginForm from "@/components/form/login";
import { NextSeo } from "next-seo";

const Login: NextPage = () => {
  return (
    <React.Fragment>
      <NextSeo title="Insider - login or sign up"/>
      <Layout isHome={false}>
        <LoginForm />
      </Layout>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });
  const redirect = "/";

  if (session) {
    return {
      redirect: {
        destination: redirect,
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Login;
