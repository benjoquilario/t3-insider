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
import { AiFillCamera } from "react-icons/ai";
import Image from "@/components/shared/image";
import { trpc } from "@/utils/trpc";
import PostItem from "@/components/posts/post-item";
import type { Post as PostType, User } from "@/types/types";

interface ProfileProps {
  user: User;
}

const Profile: NextPage<ProfileProps> = ({ user }) => {
  const { data, isLoading, refetch } = trpc.post.getPostsById.useQuery({
    limit: 3,
    id: user.id,
  });

  console.log(user);

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <div className="mt-1">
            <div className="relative h-56 w-full overflow-hidden bg-white shadow">
              <div className="h-full w-full">
                <div className="absolute inset-0 -z-10 bg-[#0f1624] shadow-xl"></div>
                <Image
                  src=""
                  alt="profile"
                  layout="fill"
                  objectFit="cover"
                  containerclassnames="h-full w-full relative"
                />
                <button className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 shadow-md">
                  <AiFillCamera size={20} />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col justify-center bg-white shadow md:flex-row md:justify-between">
                <div className="flex flex-col items-center justify-center gap-3 px-5 pt-2 pb-2 md:flex-row md:pb-5">
                  <div className="relative -mt-20 flex-shrink-0">
                    <Image
                      className="relative rounded-full border-4 border-gray-800 bg-gray-900"
                      src="/default-image.png"
                      alt=""
                      objectFit="cover"
                      layout="fill"
                      containerclassnames="relative h-28 w-28"
                    />

                    <button className="absolute right-0 bottom-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-[#6a55fa] shadow-md">
                      <AiFillCamera size={20} />
                    </button>
                  </div>
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

          <div className="mt-3">
            <div>
              <ul className="mt-4 flex flex-col gap-4">
                {/* {data?.posts.map((post) => (
                  <PostItem key={post.id} post={post as PostType<User>} />
                ))} */}
              </ul>

              <p className="text-center text-sm text-gray-300">
                There are no more posts to show right now
              </p>
            </div>
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

  try {
    const id = context.params?.id as string;

    if (!id) throw new Error();

    const user = await prisma.user.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        coverPhoto: true,
        image: true,
      },
    });

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    return {
      props: {},
      notFound: true,
    };
  }
};

export default Profile;
