import React, { useContext, useEffect, useState } from "react";
import { FcLikePlaceholder } from "react-icons/fc";
import { IoSendSharp } from "react-icons/io5";
import { UserDetailContext } from "../context/UseDetailContext";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CommentAndLikesPage = () => {
  const [postDetails, setPostDetails] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { commentPageId, userDetails } = useContext(UserDetailContext);
  const navigate = useNavigate();
  const postRef = doc(db, "posts", commentPageId && commentPageId);
  const fetchPostData = async () => {
    const postSnap = await getDoc(postRef);
    console.log(postSnap.data());
    setPostDetails(postSnap.data());
  };
  useEffect(() => {
    fetchPostData();
  }, [commentPageId]);
  console.log(postDetails);
  const { likes, image } = postDetails;
  const handleComment = async () => {
    if (!commentText.trim("")) return;
    try {
      updateDoc(postRef, {
        comment: arrayUnion({ name: userDetails?.userName, commentText }),
      });
      toast.success("comment added");
      setCommentText("");
      fetchPostData();
    } catch (error) {
      console.log(error);
    }
  };

  console.log(postDetails);
  return (
    <div className="max-w-3xl mx-auto mt-20 xs:mt-10 2xl:mt-36 md:mt-20 rounded-lg xs:shadow-md p-1  xs:p-4 bg-white relative">
      <button
        onClick={() => {
          navigate("/dash");
        }}
        className="text-sm text-[#784bdb] absolute -top-7 xs:top-5 left-0 xs:left-2"
      >
        <FaArrowLeft className="h-4 xs:h-6 2xl:h-9 w-4 xs:w-6 2xl:w-9"/>
      </button>
      {/* Post Image */}
      <div className="flex justify-center">
        <img
          src={image}
          alt="Post"
          className="rounded-lg object-cover h-[260px] 2xl:h-[600px] w-[350px] 2xl:w-[622px]"
        />
      </div>

      {/* Likes Section */}
      <div className="mt-4 flex items-center gap-2">
        <FcLikePlaceholder className="text-red-500 cursor-pointer" />
        <p className="text-sm lg:text-base 2xl:text-2xl font-semibold cursor-default">
          {likes?.length} like
        </p>
      </div>
      <div className="mt-6">
        <p className="font-semibold text-lg xl:text-3xl text-[#784bdb]">
          Comments
        </p>
        <div className="space-y-1 max-h-[200px] overflow-y-auto">
          {postDetails?.comment?.length > 0 ? (
            postDetails.comment.map((com, index) => (
              <div key={index} className="bg-gray-100 p-1 2xl:p-2 rounded-md">
                <p className="text-lg">
                  <span className="font-semibold text-base lg:text-lg 2xl:text-[21px] text-gray-800">
                    {com.name}:
                  </span>{" "}
                  <span className="text-base lg:2xl:text-[23px] text-gray-600">
                    {com.commentText}
                  </span>
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm md:text-base xl:text-xl text-gray-600">
              No comments yet
            </p>
          )}
        </div>
      </div>

      {/* Add Comment Input */}
      <div className="mt-4 flex items-center border rounded-lg overflow-hidden">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          onKeyDown={(e) => {
            if (e == "Enter") {
              fetchPostData();
            }
          }}
          className="flex-1 text-sm px-4 py-1 xs:py-2 2xl:text-[22px] text-gray-700 focus:outline-none border border-gray-400 focus:ring-2 focus:ring-[#42307D]/50"
        />
        <button
          className="px-2 xs:px-4 py-[3px] xs:py-2 2xl:py-3 bg-[#42307D] text-white hover:bg-[#5B42A0]"
          onClick={() => handleComment()}
        >
          <IoSendSharp fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default CommentAndLikesPage;
