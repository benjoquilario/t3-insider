import NextAuth, { type NextAuthOptions } from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { env } from "@/env/server.mjs"
import { prisma } from "@/server/db"
import bcrpyt from "bcryptjs"
import { loginSchema } from "@/server/schema/auth"

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }

      return session
    },
    // eslint-disable-next-line @typescript-eslint/require-await
    jwt: async ({ token, user }) => {
      if (user?.id) {
        token.id = user.id
        token.email = user.email
      }

      return token
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  secret: env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: {
          label: "password",
          type: "password",
          placeholder: "password",
        },
      },
      async authorize(credentials) {
        const cred = await loginSchema.parseAsync(credentials)
        const user = await prisma.user.findFirst({
          where: {
            email: cred.email,
          },
        })

        if (!user) return null

        const isValidPassword = bcrpyt.compareSync(cred.password, user.password)

        if (!isValidPassword) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          coverPhoto: user.image,
        }
      },
    }),
  ],
}

export default NextAuth(authOptions)
