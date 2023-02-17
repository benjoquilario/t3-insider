import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPage,
} from "next";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { getServerAuthSession } from "@/server/auth";
import Layout from "@/components/layout";
import Section from "@/components/shared/section";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { AiFillCheckCircle } from "react-icons/ai";
import { trpc } from "@/lib/utils/trpc";
import PostItem from "@/components/posts/post-item";
import type { Post as PostType, User } from "@/types/types";
import { InView } from "react-intersection-observer";
import { ToastContainer } from "react-toastify";
import usePostStore from "@/store/post";
import CreateButton from "@/components/posts/create-button";
import ProfilePhoto from "@/components/profile/profile-photo";
import CoverPhoto from "@/components/profile/cover";
import { useRouter } from "next/router";
import ProfileSkeleton from "@/components/skeleton/profile-skeleton";
import PostSkeleton from "@/components/skeleton/post-skeleton";
import Delete from "@/components/delete";
import Loader from "@/components/shared/loader";
import {
  useInfinitePostsByIdQuery,
  useUserByIdQuery,
} from "@/lib/hooks/useQuery";
import { DEFAULT_SEO_PROPS } from "@/lib/seo";
import { NextSeo, type NextSeoProps } from "next-seo";
import React from "react";
import { capitalizeName } from "@/lib/utils";
import classNames from "classnames";

const CreateForm = dynamic(() => import("@/components/form/post"), {
  ssr: false,
});

const Profile: NextPage = () => {
  const router = useRouter();
  const utils = trpc.useContext();
  const { data: session } = useSession();
  const userId = router.query?.id as string;
  const { data: user, isLoading: isUserLoading } = useUserByIdQuery(userId);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfinitePostsByIdQuery(userId);

  const { mutate: mutateFollowUser, isLoading: isFollowLoading } =
    trpc.follow.followUser.useMutation({
      onSuccess: async () => {
        await utils.user.getUserById.invalidate({ id: userId });
      },
    });

  const handleFollowUser = () => {
    mutateFollowUser({
      followingId: userId,
    });
  };

  const meta: NextSeoProps = {
    ...DEFAULT_SEO_PROPS,
    title: capitalizeName(user?.name as string),
    description: user?.name as string,
    openGraph: {
      ...((user?.coverPhoto || user?.image) && {
        images: [
          {
            url: (user?.coverPhoto as string) || (user?.image as string),
          },
        ],
      }),
    },
  };

  const postOpen = usePostStore((store) => store.postOpen);

  return (
    <React.Fragment>
      <NextSeo {...meta} />
      <Layout>
        <Section>
          <div className="col-span-full lg:col-span-9 xl:col-span-6">
            {isUserLoading ? (
              <ProfileSkeleton />
            ) : (
              <div className="mt-1 mb-2">
                <CoverPhoto
                  userId={user?.id || ""}
                  coverPhoto={user?.coverPhoto}
                />
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
                            {user?.name}
                          </h1>
                          <p className="text-sm text-gray-700">{user?.email}</p>
                          <span className="text-sm text-gray-600">
                            {user?._count.followers} Followers
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start justify-center p-3">
                      {userId !== session?.user?.id && (
                        <button
                          onClick={handleFollowUser}
                          className={classNames(
                            "flex h-8 w-28 items-center justify-center gap-2 rounded-full bg-primary text-sm font-light text-white transition duration-100 ease-out",
                            "outline-offset-2 focus:outline-none focus:ring focus:ring-offset-2 hover:bg-secondary active:scale-110 active:bg-primary"
                          )}
                        >
                          {!isFollowLoading ? (
                            user?.followedByMe ? (
                              <React.Fragment>
                                <div className="flex-shrink-0">
                                  <AiFillCheckCircle
                                    aria-hidden="true"
                                    size={15}
                                  />
                                </div>
                                <span>Following</span>
                              </React.Fragment>
                            ) : (
                              <React.Fragment>
                                <div className="flex-shrink-0">
                                  <BsFillPersonPlusFill
                                    aria-hidden="true"
                                    size={15}
                                  />
                                </div>
                                <span>Follow</span>
                              </React.Fragment>
                            )
                          ) : (
                            <Loader
                              classNameContainer="relative text-white"
                              classNameIcon="h-4 w-4 animate-spin"
                            />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {userId === session?.user?.id && <CreateButton />}

            <ul className="space-y-2">
              <React.Fragment>
                {isLoading
                  ? Array.from(Array(2), (_, i) => <PostSkeleton key={i} />)
                  : data?.pages.map((page) =>
                      page.posts.map((post) => (
                        <PostItem post={post as PostType<User>} key={post.id} />
                      ))
                    )}
                <Delete />
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
                    <li ref={ref} className="mt-4 w-full">
                      {isFetchingNextPage &&
                        Array.from(Array(2), (_, i) => (
                          <PostSkeleton key={i} />
                        ))}
                    </li>
                  )}
                </InView>
              </React.Fragment>
            </ul>
            <ToastContainer />
            {!hasNextPage && isFetchingNextPage ? (
              <p className="text-center text-sm text-gray-300">
                There are no more posts to show right now
              </p>
            ) : null}
          </div>
        </Section>
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
