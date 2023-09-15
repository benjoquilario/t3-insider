import Layout from "@/components/layout"
import Section from "@/components/shared/section"
import { trpc } from "@/lib/utils/trpc"
import { MdPersonAddDisabled } from "react-icons/md"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getServerAuthSession } from "@/server/auth"
import type { User as UserType } from "@/types/types"
import FollowerItem from "@/components/shared/follower-item"
import Loader from "@/components/shared/loader"
import { NextSeo } from "next-seo"
import React from "react"

const Followers = () => {
  const { data: followers, isLoading } = trpc.follow.getFollowers.useQuery()

  console.log(followers)

  return (
    <Layout>
      <NextSeo title="Followers" />
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          Followers
          <div className="mt-4 flex flex-col items-center justify-center">
            {isLoading && (
              <Loader
                classNameIcon="animate-spin w-6 h-6"
                classNameContainer="text-white"
              />
            )}
            {followers ? (
              followers?.map((follower) => (
                <FollowerItem key={follower.id} user={follower as UserType} />
              ))
            ) : (
              <>
                <MdPersonAddDisabled className="h-12 w-12" />
                <span className="text-center">
                  You don't have any followers ☹️. The trick is to follow
                  someone and then wait for them to follow you back.
                </span>
              </>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const session = await getServerAuthSession({
    req: context.req,
    res: context.res,
  })

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return {
    props: {
      session,
    },
  }
}

export default Followers
