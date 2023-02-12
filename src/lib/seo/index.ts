import type { NextSeoProps } from "next-seo";

export const DEFAULT_SEO_PROPS: NextSeoProps = {
  title: "Home",
  description:
    "A Fullstack social media application intended to make a community, friends, and make the world more open and connected.",
  titleTemplate: "%s | Insider",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://insider.vercel.app/",
    title: "Insider",
    description:
      "A Fullstack social media application intended to make a community, friends, and make the world more open and connected.",
    siteName: "Insider",
  },
  twitter: {
    cardType: "summary_large_image",
  },
};
