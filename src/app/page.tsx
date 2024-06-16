import Layout from "@/components/layout"
import Posts from "@/components/posts"
import CreateButton from "@/components/posts/create-buttons"
import Section from "@/components/section"
import { SignOut } from "@/components/sign-out"

export default function Home() {
  return (
    <Layout>
      <Section>
        <div className="col-span-full lg:col-span-9 xl:col-span-6">
          <CreateButton />
          <SignOut />
          <Posts />
        </div>
      </Section>
    </Layout>
  )
}
