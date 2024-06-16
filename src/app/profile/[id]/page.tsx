import React from "react"
import Layout from "@/components/layout"
import Section from "@/components/section"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { AiFillCheckCircle } from "react-icons/ai"
import ProfilePhoto from "@/components/profile/profile-photo"
import CoverPhoto from "@/components/profile/cover-photo"

const Profile = () => {
  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          {/*  */}
          <div className="mb-2 mt-0">
            <CoverPhoto />
            <div className="space-y-4">
              <div className="flex flex-col justify-center bg-white shadow md:flex-row md:justify-between">
                <div className="flex flex-col items-center justify-center gap-3 px-5 pb-2 pt-2 md:flex-row md:pb-5">
                  <ProfilePhoto />
                  <div className="text-center sm:text-left">
                    <div>
                      <h1 className="text-lg font-semibold capitalize text-black">
                        Benjo
                      </h1>
                      <p className="text-sm text-gray-700">
                        benjoquilario@gmail.com
                      </p>
                      <span className="text-sm text-gray-600">
                        12 Followers
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-center p-3">
                  <button
                    // onClick={handleFollowUser}
                    className={cn(
                      "flex h-8 w-28 items-center justify-center gap-2 rounded-full bg-primary text-sm font-light text-white transition duration-100 ease-out",
                      "outline-offset-2 hover:bg-secondary focus:outline-none focus:ring focus:ring-offset-2 active:scale-110 active:bg-primary"
                    )}
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
                  </button>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  )
}

export default Profile
