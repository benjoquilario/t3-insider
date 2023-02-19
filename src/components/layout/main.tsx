import React from "react";
import CreateButton from "@/components/posts/create-button";
import Posts from "@/components/posts";
import NavBar from "./navbar";
import { isMobile } from "react-device-detect";
import { useAuthQuery } from "@/lib/hooks/useQuery";
import type { User } from "@/types/types";

const Main = () => {
  const { data: auth, isLoading } = useAuthQuery();

  return (
    <React.Fragment>
      {isMobile && <NavBar auth={auth as User} isLoading={isLoading} />}
      <CreateButton />
      <Posts />
    </React.Fragment>
  );
};

export default Main;
