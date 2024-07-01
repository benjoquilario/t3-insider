"use server"

import db from "@/lib/db"
import { auth } from "@/auth"
import { getCurrentUser } from "@/lib/metrics"
import { UserSchema, userSchema } from "@/lib/validations/user"

export const updateProfilePicture = async function ({ url }: { url: string }) {
  const session = await auth()

  if (!session) return

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      image: url,
    },
  })

  return {
    url,
    status: 200,
    ok: true,
  }
}

export const updateCoverPicture = async function ({ url }: { url: string }) {
  const session = await auth()

  if (!session) return

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      cover: url,
    },
  })

  return {
    url,
    status: 200,
    ok: true,
  }
}

export const updateUserInformation = async function (data: UserSchema) {
  const session = await auth()

  if (!session) return

  await db.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      username: data.username,
      name: data.name,
      relationshipStatus: data.relationshipStatus,
      address: data.address,
      bio: data.bio,
      birthDate: data.birthDate,
      phoneNumber: data.phoneNumber,
      gender: data.gender,
      website: data.website,
    },
  })

  return
}
