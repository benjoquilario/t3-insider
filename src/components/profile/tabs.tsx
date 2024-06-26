"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PostsUser from "./posts-user"
import About from "./about"

type TabsProfileProps = {
  userId: string
}

const TabsProfile = (props: TabsProfileProps) => {
  const { userId } = props

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
        <About />
      </TabsContent>
      <TabsContent value="activity">Activity</TabsContent>
    </Tabs>
  )
}

export default TabsProfile
