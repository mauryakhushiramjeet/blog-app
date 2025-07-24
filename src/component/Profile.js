import React, { useContext, useEffect, useRef, useState } from "react";
import userImage from "../Assets/user.png";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { UserDetailContext } from "../context/UseDetailContext";
import { HiDotsVertical } from "react-icons/hi";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaRegCommentAlt } from "react-icons/fa";
import likeIcon from "../Assets/heart.jpg";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import Model from "./Model";
import { RiFolderAddLine } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { UserAuthContext } from "../context/UserAuthContext";

const Profile = () => {
  const [postData, setPostData] = useState([]);
  const [expand, setExpand] = useState(null);
  const [dropdownRefs, setDropdownRefs] = useState([]);

  const navigate = useNavigate();
  const { userDetails, userAuth, setPostUpdateId, setCommentPageId } =
    useContext(UserDetailContext);
  const { setUserAuthenticated } = useContext(UserAuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dropDownId, setDropDownId] = useState(null);
  const dropDownRef = useRef(null);
  const fetchPosts = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", userAuth.uid)
      );
      const postSnapShort = await getDocs(q);
      // console.log(postSnapShort.docs);
      const allPostData = postSnapShort.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPostData(allPostData);
      allPostData.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (userAuth?.uid) {
      fetchPosts();
    }
  }, [userAuth]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Log out successfully");
      setUserAuthenticated(null);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };
  const handleDrop = (id) => {
    setDropDownId(id);
    // console.log(id)
  };
  const updatePost = (id) => {
    setPostUpdateId(id);
    navigate("/post");
    setDropDownId(null);
  };

  const handleDeletePost = async (id) => {
    console.log(id);
    if (!id) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      toast.success("Post deleted successfully");
      setDropDownId(false);
      setIsOpen(false);
      fetchPosts();
    } catch (eror) {
      toast.error(eror.message);
    }
  };
  const handleComment = (id) => {
    setCommentPageId(id);
    navigate("/Comment-likes");
  };
  console.log(postData);
  const handleLike = async (userId, postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      const postSnap = await getDoc(postRef);
      if (postSnap.exists()) {
        const postLikeData = postSnap.data();
        const hashLiked = postLikeData?.likes?.includes(userId);
        updateDoc(postRef, {
          likes: hashLiked ? arrayRemove(userId) : arrayUnion(userId),
        });
        setPostData((prevPost) =>
          prevPost.map((post) =>
            post.id == postId
              ? {
                  ...post,
                  likes: hashLiked
                    ? post.likes.filter((uid) => uid !== userId)
                    : [...(post.likes || []), userId],
                }
              : post
          )
        );
      }
    } catch (error) {
      console.log("Error in like procces in profile page", error);
    }
  };
  useEffect(() => {
    setDropdownRefs((prevRefs) =>
      Array(postData.length)
        .fill()
        .map((_, i) => prevRefs[i] || React.createRef())
    );
  }, [postData.length]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickOutSide = dropdownRefs.every(
        (ref) => !ref.current || !ref.current.contains(e.target)
      );
      if (clickOutSide) {
        setDropDownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRefs]);
  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] px-4 py-[5px] xs:py-8 relative mt-20 xs:mt-10 2xl:mt-36 md:mt-20">
        <button
          onClick={() => navigate("/dash")}
          className="text-sm text-[#784bdb] absolute top-[-10px] xs:top-5 left-0 xs:left-2"
        >
          <FaArrowLeft className="h-4 xs:h-6 2xl:h-9 w-4 xs:w-6 2xl:w-9"/>
        </button>
        <div className="flex flex-row items-start gap-2 sm:gap-6 mb-10">
          <img
            src={userDetails.image || userImage}
            alt="user"
            className="w-[70px] xs:w-24 sm:w-28 h-[70px] xs:h-24 sm:h-28 rounded-full border-4 p-[3px] border-[#42307D]/60 object-cover"
          />

          <div className="flex flex-col items-start w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl font-semibold text-[#42307D] sm:mb-2 md:mb-0">
                {userDetails.userName}
              </h2>
              <div className="flex gap-2 sm:gap-3">
                <button
                  className="bg-[#42307D]/80text-sm 2xl:text-[24px] px-4 2xl:px-6 py-1 2xl:py-5 bg-[#42307D] text-white rounded-lg hover:bg-[#5e44aa] text-sm hidden sm:block"
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </button>
                <button
                  className="sm:hidden block text-[#5e44aa]"
                  onClick={() => navigate("/post")}
                >
                  <RiFolderAddLine className="w-5 h-5 xs:w-6 xs:h-6" />
                </button>
                <button
                  className="bg-gray-300 text-gray-800  2xl:text-[24px] px-4 2xl:px-6 py-1 2xl:py-5 rounded-lg hover:bg-gray-400 text-sm hidden sm:block"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className="sm:hidden block text-[#5e44aa]"
                  onClick={() => navigate("/edit-profile")}
                >
                  <MdModeEdit className="w-5 h-5 xs:w-6 xs:h-6" />
                </button>
              </div>
            </div>

            <p className="text-sm md:text-base 2xl:text-2xl text-gray-600 text-left  font-semibold">
              {userDetails?.bio || " This is bio....."}
            </p>
            <p className="text-sm md:text-base 2xl:text-xl text-gray-500 mt-1">
              {postData.length} Posts
            </p>
            <button
              onClick={() => navigate("/post")}
              className="text-sm 2xl:text-[24px] px-4 2xl:px-6 py-1 2xl:py-5 bg-[#42307D] mt-2 text-white rounded-lg hover:bg-[#5e44aa] hidden sm:block"
            >
              + New Post
            </button>
            <button
              className="bg-[#5e44aa] text-white px-[10px] xs:px-4 py-[2px] xs:py-1 rounded-lg hover:bg-gray-400 text-sm block sm:hidden"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
        {postData.length == 0 && (
          <div className=" flex items-center pt-20 justify-center text-5xl text-gray-500/60 font-semibold">
            <p>Create your post here!!</p>
          </div>
        )}
        <div className="grid grid-cols-1  xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:p-4">
          {(postData || []).map((post, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center justify-center">
                <img
                  src={post?.image}
                  className="object-cover h-[241px] xs:w-[241px] 2xl:w-[432px]"
                />
              </div>
              <div className="mt-2 flex items-center justify-between">
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
              <div className="flex border">
                <span
                  className="text-[#5e44aa] cursor-pointer w-fit"
                  onClick={() => handleDrop(post.id)}
                >
                  <HiDotsVertical />
                </span>
                <div
                  ref={dropdownRefs[index]}
                  className={`${
                    dropDownId == post.id ? "block" : "hidden"
                  } flex flex-col gap-2 items-center absolute bottom-[36px] z-10`}
                >
                  <button
                    className="px-5 py-[2px] text-base rounded-lg bg-[#5e44aa]/80 hover:bg-[#5e44aa] text-white"
                    onClick={() => updatePost(post.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-[2px] text-base rounded-lg bg-red-600/80  hover:bg-red-600 text-white"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="">
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
            </div>
          ))}
          <Model
            isOpen={isOpen}
            onClose={() => {
              setIsOpen(false);
              setDropDownId(null);
            }}
            OnDeletePost={() => handleDeletePost(dropDownId)}
          />
        </div>
      </div>
    </>
  );
};

export default Profile;
