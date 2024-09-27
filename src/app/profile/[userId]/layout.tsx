import React, { Suspense } from "react"
import Layout from "@/components/layout"
import Section from "@/components/section"
import type { Metadata } from "next"
import { getUserById } from "@/lib/metrics"

interface ProfileLayoutProps {
  children: React.ReactNode
  params: {
    userId: string
  }
}

export async function generateMetadata({
  params,
}: {
  params: {
    userId: string
  }
}): Promise<Metadata | undefined> {
  const userId = params.userId

  const profile = await getUserById({ userId })
  if (!profile) {
    return
  }

  const title = profile.name
  const imageUrl = profile.image

  return {
    title: `${title} - Insider`,
    openGraph: {
      title: `@${profile.username} - Insider`,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/${userId}`,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      images: [
        {
          url: `${imageUrl}`,
          width: 600,
          height: 400,
        },
      ],
    },
  }
}

const ProfileLayout = async (props: ProfileLayoutProps) => {
  const { children } = props

  return (
    <Layout>
      <Section>{children}</Section>
    </Layout>
  )
}

export default ProfileLayout
