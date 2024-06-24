"use client"

import React from "react"
import Layout from "@/components/layout"
import Section from "@/components/section"
import { cn } from "@/lib/utils"
import { AiFillCheckCircle } from "react-icons/ai"
import ProfilePhoto from "@/components/profile/profile-photo"
import CoverPhoto from "@/components/profile/cover-photo"
import ProfileSkeleton from "@/components/skeleton/profile-skeleton"
import TabsProfile from "@/components/profile/tabs"
import { useQueryUserById } from "@/hooks/queries/useQueryUserById"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

const Profile = ({ params }: { params: { userId: string } }) => {
  const userId = params.userId
  const { data: session } = useSession()
  const { data: user, isPending } = useQueryUserById(userId)

  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          {/*  */}
          {isPending ? (
            <ProfileSkeleton />
          ) : (
            <div className="mb-2 mt-0">
              <CoverPhoto userId={userId} photoUrl={user?.cover!} />
              <div className="space-y-4">
                <div className="flex flex-col justify-center shadow md:flex-row md:justify-between">
                  <div className="flex flex-col items-center justify-center gap-3 px-5 pb-2 pt-2 md:flex-row md:pb-5">
                    <ProfilePhoto userId={userId} photoUrl={user?.image!} />
                    <div className="text-center sm:text-left">
                      <div>
                        <h1 className="text-lg font-semibold capitalize text-foreground">
                          {user?.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        <span className="text-sm text-muted-foreground/90">
                          12 Followers
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-center p-3">
                    {userId !== session?.user.id ? (
                      <Button
                        // onClick={handleFollowUser}
                        variant="default"
                        className="flex items-center gap-1 rounded-full"
                      >
                        {/* {!isFollowLoading ? (
                        user?.followedByMe ? ( */}
                        <React.Fragment>
                          <div className="flex-shrink-0">
                            <AiFillCheckCircle aria-hidden="true" size={15} />
                          </div>
                          <span>Following</span>
                        </React.Fragment>
                        {/* ) : (
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
                      ) */}
                      </Button>
                    ) : (
                      <Button variant="outline">Edit Profile</Button>
                    )}

                    {/* )} */}
                  </div>
                </div>
              </div>
            </div>
          )}
          <TabsProfile userId={userId} />
        </div>
      </Section>
    </Layout>
  )
}

export default Profile
