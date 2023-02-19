import React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerAuthSession } from "@/server/auth";
import { useRouter } from "next/router";
import { trpc } from "@/lib/utils/trpc";
import type { Post as PostType, User } from "@/types/types";
import PostItem from "@/components/posts/post-item";
import Layout from "@/components/layout";
import Section from "@/components/shared/section";

const Post: NextPage = () => {
  const router = useRouter();
  const postId = router.query?.id as string;

  const { data, isLoading } = trpc.post.getPostById.useQuery(
    {
      id: postId,
    },
    {
      enabled: !!postId,
    }
  );

  console.log(data, isLoading);

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <PostItem post={data as PostType<User>} />
        </div>
      </Section>
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

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default Post;
