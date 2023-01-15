import type { GetServerSideProps, NextPage } from "next";
import { getServerAuthSession } from "@/server/auth";
import { trpc } from "../utils/trpc";
import Header from "@/components/layout/header";
import Layout from "@/components/layout";
import CreatePost from "@/components/posts/create-post";
import { useSession } from "next-auth/react";
import Posts from "@/components/posts";
import PostForm from "@/components/form/post";
import Main from "@/components/layout/main";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const { data: secret } = trpc.example.getSecretMessage.useQuery();
  const session = useSession();
  // const newProcedures = trpc.newProcedures.useQuery();

  return (
    <Layout>
      <div className="mx-auto grid h-full min-h-screen w-full max-w-screen-2xl grid-cols-12 gap-6 p-3 md:p-5">
        <Header />
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <Main />
        </div>
        <div className="hidden xl:col-span-3 xl:block">
          <div className="sticky top-0">
            <div className="flex items-center justify-between"></div>
          </div>
        </div>
      </div>
    </Layout>
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
