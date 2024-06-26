"use client"

import React from "react"
import { CiAt, CiMail, CiCalendar, CiPhone, CiGlobe } from "react-icons/ci"
import { IoMdPerson } from "react-icons/io"
import { MdOutlineTransgender } from "react-icons/md"
import { FaRegHeart, FaAddressBook } from "react-icons/fa"

const About = () => {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2">
        <AboutItem
          Icon={<CiAt />}
          itemName="username"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<CiMail />}
          itemName="email"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<IoMdPerson />}
          itemName="name"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<CiCalendar />}
          itemName="birth date"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<MdOutlineTransgender />}
          itemName="gender"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<FaRegHeart />}
          itemName="relationship status"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<CiPhone />}
          itemName="phone number"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<CiGlobe />}
          itemName="website"
          itemValue="benjoquilario"
        />
        <AboutItem
          Icon={<FaAddressBook />}
          itemName="address"
          itemValue="benjoquilario"
        />
      </div>
    </div>
  )
}

type AboutItemProps = {
  Icon: any
  itemName: string
  itemValue: string
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
        {itemValue}
      </p>
    </div>
  )
}

export default About
