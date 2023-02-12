import type { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession } from "@/server/auth";
import { DEFAULT_SEO_PROPS } from "@/lib/seo";
import { NextSeo } from "next-seo";
import Layout from "@/components/layout";
import Main from "@/components/layout/main";
import Section from "@/components/shared/section";
import React from "react";

const Home: NextPage = () => {
  return (
    <React.Fragment>
      <NextSeo {...DEFAULT_SEO_PROPS} />
      <Layout>
        <Section>
          <div className="col-span-full lg:col-span-9 xl:col-span-6">
            <Main />
          </div>
        </Section>
      </Layout>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home;
