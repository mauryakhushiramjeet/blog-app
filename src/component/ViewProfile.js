import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { UserDetailContext } from "../context/UseDetailContext";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaRegCommentAlt } from "react-icons/fa";

import likeIcon from "../Assets/heart.jpg";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
const ViewProfile = () => {
  const [detail, setDetail] = useState("");
  const [postData, setPostData] = useState([]);
  const [expand, setExpand] = useState(null);
  const [like, setLike] = useState([]);
  const navigate = useNavigate();
  const { profileViewId, setProfileViewId, setCommentPageId, userAuth } =
    useContext(UserDetailContext);
  const handleProfileView = async () => {
    const viewRef = query(
      collection(db, "posts"),
      where("userId", "==", profileViewId)
    );
    const viewSnap = await getDocs(viewRef);
    viewSnap.docs.forEach((doc) => {
      // console.log(doc.data());
    });
    const data = viewSnap.docs.map((doc) => ({
      ...doc.data(),
    }));
    setPostData(data);
  };
  const viewProfileDtails = async () => {
    try {
      const detailsRef = await getDoc(doc(db, "user", profileViewId));
      const detailSnap = detailsRef.data();
      setDetail(detailSnap);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleProfileView();
    viewProfileDtails();
  }, [profileViewId]);
  const handleComment = (id) => {
    setCommentPageId(id);
    navigate("/Comment-likes");
  };
  const handleLike = async (userId, postId) => {
    console.log(userId);
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      const onePostData = postSnap.data();
      const hashLiked = onePostData?.likes?.includes(userAuth?.uid);
      await updateDoc(postRef, {
        likes: hashLiked ? arrayRemove(userId) : arrayUnion(userId),
      });

      setPostData((post) =>
        post.map((p) =>
          p.id == postId
            ? {
                ...p,
                likes: hashLiked
                  ? p.likes.filter((uid) => uid !== userId)
                  : [...(p.likes || []), userId],
              }
            : p
        )
      );
    }
  };
  console.log(postData?.likes);
  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] px-4 md:px-10 py-[5px] xs:py-8 relative mt-20 xs:mt-10 2xl:mt-36 md:mt-20">
        <button
          onClick={() => {
            navigate("/dash");
            setProfileViewId(null);
          }}
          className="text-sm text-[#784bdb] absolute top-[-10px] xs:top-5 left-0 md:left-2"
        >
          <FaArrowLeft className="h-4 xs:h-6 2xl:h-9 w-4 xs:w-6 2xl:w-9" />
        </button>
        <div className="flex flex-row items-center gap-2 sm:gap-6 mb-10">
          {/* Profile Image */}
          <img
            src={detail?.image}
            alt="user"
            className="w-[70px] xs:w-24 sm:w-28 h-[70px] xs:h-24 sm:h-28 rounded-full border-4 p-[3px] border-[#42307D]/60 object-cover"
          />

          {/* Profile Info + Buttons */}
          <div className="flex flex-col items-start w-full">
            <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-[#42307D] sm:mb-2 md:mb-0">
              {detail.userName}
            </h2>

            <p className="text-sm md:text-base 2xl:text-2xl text-gray-600 text-left  font-semibold">
              {detail?.bio || "Write your bio...."}
            </p>
            <p className="text-sm md:text-base 2xl:text-xl text-gray-500 mt-1">
              {postData.length} Posts
            </p>
          </div>
        </div>
        {postData.length == 0 && (
          <div className=" flex items-center pt-20 justify-center text-5xl text-gray-500/60 font-semibold">
            <p>No post !!</p>
          </div>
        )}
        <div className="grid grid-cols-1  xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:p-4">
          {(postData || []).map((post, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-md transition-all duration-300 flex flex-col "
            >
              <div className="flex items-center justify-center">
                <img
                  src={post.image}
                  className="object-cover h-[241px] w-[450px] xs:w-[241px] 2xl:w-[432px]"
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className="cursor-pointer"
                  onClick={() => handleLike(userAuth.uid, post.id)}
                >
                  {!post?.likes?.includes(userAuth?.uid) ? (
                    <span className="text-sm lg:text-base 2xl:text-2xl font-semibold cursor-default flex items-center gap-1">
                      <FcLikePlaceholder className="h-6 w-6" />{" "}
                      {post?.likes?.length} like
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <img src={likeIcon} alt="like-icon" className="h-8 w-8" />
                      <p className="text-sm lg:text-base 2xl:text-2xl font-semibold cursor-default">
                        {post?.likes?.length} like
                      </p>
                    </div>
                  )}
                </span>
                <span
                  className="cursor-pointer"
                  onClick={() => handleComment(post.id)}
                >
                  <FaRegCommentAlt />
                </span>
              </div>
              <div className="flex pb-4">
                <p
                  className={`2xl:text-xl text-pink-4004 cursor-pointer ${
                    expand == post.id ? "" : "line-clamp-2"
                  } `}
                  onClick={() =>
                    setExpand((prev) => (prev == post.id ? null : post.id))
                  }
                >
                  {post?.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ViewProfile;
