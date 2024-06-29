"use client"

import React from "react"
import { CiAt, CiMail, CiCalendar, CiPhone, CiGlobe } from "react-icons/ci"
import { IoMdPerson } from "react-icons/io"
import { MdOutlineTransgender } from "react-icons/md"
import { FaRegHeart, FaAddressBook } from "react-icons/fa"
import { User } from "@prisma/client"

type AboutProps = {
  user?: User
}

const About = (props: AboutProps) => {
  const { user } = props

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2">
        <AboutItem
          Icon={<CiAt />}
          itemName="username"
          itemValue={`${user?.name?.split(" ").join("").toLowerCase()}`}
        />
        <AboutItem
          Icon={<CiMail />}
          itemName="email"
          itemValue={user?.email ?? "not set"}
        />
        <AboutItem
          Icon={<IoMdPerson />}
          itemName="name"
          itemValue={user?.name ?? "not set"}
        />
        <AboutItem
          Icon={<CiCalendar />}
          itemName="birth date"
          itemValue={user?.birthDate ?? "not set"}
        />
        <AboutItem
          Icon={<MdOutlineTransgender />}
          itemName="gender"
          itemValue={user?.gender ?? "not set"}
        />
        <AboutItem
          Icon={<FaRegHeart />}
          itemName="relationship status"
          itemValue={user?.relationshipStatus ?? "not set"}
        />
        <AboutItem
          Icon={<CiPhone />}
          itemName="phone number"
          itemValue={`${user?.phoneNumber ?? "not set"}`}
        />
        <AboutItem
          Icon={<CiGlobe />}
          itemName="website"
          itemValue={user?.website ?? "not set"}
        />
        <AboutItem
          Icon={<FaAddressBook />}
          itemName="address"
          itemValue={user?.address ?? "not set"}
        />
      </div>
    </div>
  )
}

type AboutItemProps = {
  Icon: any
  itemName: string
  itemValue: string | Date
}

const AboutItem = (props: AboutItemProps) => {
  const { Icon, itemName, itemValue } = props

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2 rounded-l-3xl bg-input p-2 sm:gap-3 sm:p-4">
        {Icon}
        <p className="font-medium capitalize">{itemName}</p>
      </div>
      <p className="flex flex-1 items-center self-stretch rounded-r-3xl border border-border pl-4">
        {itemValue.toString()}
      </p>
    </div>
  )
}

export default About
