"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostsUser from "./posts-user"
import About from "./about"
import ActivityUser from "./activity"
import type { User } from "@prisma/client"

type TabsProfileProps = {
  userId: string
  user?: User
}

const TabsProfile = (props: TabsProfileProps) => {
  const { userId, user } = props

  return (
    <Tabs defaultValue="post" className="flex w-full flex-col">
      <TabsList className="flex w-full justify-start bg-background p-0">
        <TabsTrigger value="post" className="h-full">
          Posts
        </TabsTrigger>
        <TabsTrigger value="about" className="h-full">
          About
        </TabsTrigger>
        <TabsTrigger value="activity" className="h-full">
          Activity
        </TabsTrigger>
      </TabsList>
      <TabsContent value="post" className="mt-0">
        <PostsUser userId={userId} />
      </TabsContent>
      <TabsContent value="about">
        <About user={user} />
      </TabsContent>
      <TabsContent value="activity">
        <ActivityUser userId={userId} />
      </TabsContent>
    </Tabs>
  )
}

export default TabsProfile
