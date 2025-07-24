import React, { useContext, useEffect } from "react";
import Card from "./Card";
import { UserDetailContext } from "../context/UseDetailContext";

const Cards = ({ allPost }) => {
  const { setDashPosts } = useContext(UserDetailContext);

  useEffect(() => {
    if (allPost) {
      setDashPosts(allPost);
    }
  }, [allPost]);
  allPost.sort((a, b) => b.createdAt - a.createdAt);
  if (!allPost || allPost.length == 0) {
    return <span className="loading loading-dots loading-xl"></span>;
  }
  return (
    <div className="grid grid-cols-1  xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {(allPost || []).map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </div>
  );
};

export default Cards;
