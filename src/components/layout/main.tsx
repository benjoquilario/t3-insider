import React from "react";
import CreatePost from "@/components/posts/create-post";
import Posts from "@/components/posts";

const Main = () => {
  return (
    <React.Fragment>
      <CreatePost />
      <Posts type="getPosts" />
    </React.Fragment>
  );
};

export default Main;
