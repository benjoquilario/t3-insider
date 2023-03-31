import Layout from "@/components/layout";
import Section from "@/components/shared/section";
import { trpc } from "@/lib/utils/trpc";
import { MdPersonAddDisabled } from "react-icons/md";
import React from "react";

const Followers = () => {
  const { data: followers, isLoading } = trpc.follow.getFollowers.useQuery();

  console.log(followers);
  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          Followers
          <div className="mt-4 flex flex-col items-center justify-center">
            <MdPersonAddDisabled className="h-12 w-12" />
            <span className="text-center">
              You don't have any followers ☹️. The trick is to follow someone
              and then wait for them to follow you back.
            </span>
          </div>
        </div>
      </Section>
    </Layout>
  );
};

export default Followers;
