import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Dashboard = () => {
  const [allPost, setAllPost] = useState([]);
  const fetchPosts = async () => {
    try {
      const postSnap = await getDocs(collection(db, "posts"));
      const allPost = postSnap.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        };
      });

      const latestPostByUser = {};
      allPost.forEach((post) => {
        const { userId, createdAt } = post;
        if (
          !latestPostByUser[userId] ||
          new Date(createdAt) > new Date(latestPostByUser[userId].createdAt)
        ) {
          latestPostByUser[userId] = post;
        }
      });

      setAllPost(Object.values(latestPostByUser));
      // console.log("Latest posts per user:", Object.values(latestPostByUser));
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  return (
    <div className="mt-10 2xl:mt-36 md:mt-20">
      <div className="p-4 my-2">
        <div className="flex justify-center">
          <h1 className="text-xl xs:text-2xl md:text-3xl font-semibold font-cursive text-[#42307D]">
            Whispers Blogs
          </h1>
        </div>
      </div>
      <Cards allPost={allPost} />
    </div>
  );
};

export default Dashboard;
