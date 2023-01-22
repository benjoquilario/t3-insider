import React from "react";
import CreateButton from "@/components/posts/create-button";
import Posts from "@/components/posts";

const Main = () => {
  return (
    <React.Fragment>
      <CreateButton />
      <Posts type="getPosts" />
    </React.Fragment>
  );
};

export default Main;
