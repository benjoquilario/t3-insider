import React from "react";
import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import { getServerAuthSession } from "@/server/auth";
import { prisma } from "@/server/db";
import Layout from "@/components/layout";
import Section from "@/components/shared/section";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { trpc } from "@/utils/trpc";
import PostItem from "@/components/posts/post-item";
import type { Post as PostType, User } from "@/types/types";
import { InView } from "react-intersection-observer";
import { ToastContainer } from "react-toastify";
import CreateForm from "@/components/form/post";
import usePostStore from "@/store/post";
import CreateButton from "@/components/posts/create-button";
import ProfilePhoto from "@/components/profile/profile-photo";
import CoverPhoto from "@/components/profile/cover";
import { useRouter } from "next/router";

interface ProfileProps {
  user: User;
}

const Profile: NextPage<ProfileProps> = () => {
  const router = useRouter();
  const userId = router.query?.id as string;

  const { data: user, isLoading: isUserLoading } =
    trpc.user.getUserById.useQuery({
      id: userId,
    });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = trpc.post.getPostsById.useInfiniteQuery(
    { id: userId, limit: 3 },
    {
      getNextPageParam: (lastPage) => lastPage.nextSkip,
      refetchOnWindowFocus: false,
    }
  );

  const postOpen = usePostStore((store) => store.postOpen);

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <div className="mt-1">
            <CoverPhoto userId={user?.id || ""} coverPhoto={user?.coverPhoto} />
            <div className="space-y-4">
              <div className="flex flex-col justify-center bg-white shadow md:flex-row md:justify-between">
                <div className="flex flex-col items-center justify-center gap-3 px-5 pt-2 pb-2 md:flex-row md:pb-5">
                  <ProfilePhoto
                    userId={user?.id || ""}
                    image={user?.image || ""}
                  />
                  <div className="text-center sm:text-left">
                    <div>
                      <h1 className="text-lg font-semibold capitalize text-black">
                        Benjo Quilario
                      </h1>
                      <p className="text-sm text-gray-700">
                        benjoquilario@gmail.om
                      </p>
                      <span className="text-sm text-gray-600">
                        21 Followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-center p-3">
                  <button className="flex items-center justify-center gap-2  rounded-full bg-[#6a55fa] px-6 py-1 text-sm font-light text-white transition duration-100 ease-out hover:bg-opacity-100 active:bg-opacity-80">
                    <div className="flex-shrink-0">
                      <BsFillPersonPlusFill aria-hidden="true" size={15} />
                    </div>
                    <span>Unfollow</span>
                  </button>

                  <button className="flex items-center justify-center gap-2  rounded-full bg-[#6a55fa] px-6 py-1 text-sm font-light text-white transition duration-100 ease-out hover:bg-opacity-100 active:bg-opacity-80">
                    <div className="flex-shrink-0">
                      <BsFillPersonPlusFill aria-hidden="true" size={15} />
                    </div>
                    <span>Follow</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <CreateButton />

          <div>
            <ul className="flex flex-col">
              <React.Fragment>
                {isLoading ? (
                  <div>loading...</div>
                ) : (
                  data?.pages.map((page) =>
                    page.posts.map((post) => (
                      <PostItem post={post as PostType<User>} key={post.id} />
                    ))
                  )
                )}
                {postOpen && <CreateForm />}
                <InView
                  fallbackInView
                  onChange={async (InView) => {
                    if (InView && hasNextPage && !isFetchingNextPage) {
                      await fetchNextPage();
                    }
                  }}
                >
                  {({ ref }) => (
                    <div ref={ref} className="mt-4 w-full">
                      {isFetchingNextPage && <span>Loading...</span>}
                    </div>
                  )}
                </InView>
                <ToastContainer />
              </React.Fragment>
            </ul>

            <p className="text-center text-sm text-gray-300">
              There are no more posts to show right now
            </p>
          </div>
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

export default Profile;
