import React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerAuthSession } from "@/server/auth";
import Layout from "@/components/layout";
import LoginForm from "@/components/form/login";

const Login: NextPage = () => {
  return (
    <Layout isHome={false}>
      <LoginForm />
    </Layout>
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
