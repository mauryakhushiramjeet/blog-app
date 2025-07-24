import React, { useContext, useState } from "react";
import { FcLikePlaceholder } from "react-icons/fc";
import { FaRegCommentAlt } from "react-icons/fa";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { UserDetailContext } from "../context/UseDetailContext";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import likeIcon from "../Assets/heart.jpg";
import { db } from "../firebase";
const Card = ({ item }) => {
  const [like, setLike] = useState(item.likes || []);
  const { setProfileViewId, userAuth, setCommentPageId } =
    useContext(UserDetailContext);
  const hasLiked = userAuth ? like.includes(userAuth.uid) : false;
  const { image, content, createdAt, name, prifileImage, userId, id, likes } =
    item;
  const navigate = useNavigate();
  const handleProfileView = async () => {
    setProfileViewId(userId);
    navigate("/view-profile");
  };
  const handleLike = async () => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(userAuth?.uid) : arrayUnion(userAuth?.uid),
    });
    setLike((prev) =>
      hasLiked
        ? prev.filter((uid) => uid !== userAuth.uid)
        : [...prev, userAuth.uid]
    );
  };
  const handleComment = () => {
    setCommentPageId(id);
    navigate("/Comment-likes");
  };

  return (
    <div className="sm:p-3 border">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div>
            <img
              src={prifileImage}
              className="rounded-full w-[60px] sm:w-[50px] xl:w-[70px] 2xl:w-[80px] h-[60px] sm:h-[50px] xl:h-[70px] 2xl:h-[80px] cursor-pointer object-cover"
              onClick={handleProfileView}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm lg:text-base xl:text-lg 2xl:text-2xl font-semibold">
              {name}
            </p>
            <p className="text-xs  xl:text-lg 2xl:text-xl font-normal">
              {" "}
              {createdAt && moment(createdAt).fromNow()}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img
            src={image}
            className="object-cover h-[241px] xs:w-[241px] 2xl:w-[432px]"
          />
        </div>
        <div className="flex gap-2 items-center justify-between">
          <span className="cursor-pointer" onClick={handleLike}>
            {!hasLiked ? (
              <span className="text-sm lg:text-base 2xl:text-2xl flex items-center gap-1">
                <FcLikePlaceholder className="w-6 h-6" /> {likes?.length} like
              </span>
            ) : (
              <div className="flex items-center">
                <img src={likeIcon} alt="like-icon" className="h-8 w-8" />
                <p className="text-sm lg:text-base 2xl:text-2xl font-semibold cursor-default">
                  {likes?.length} like
                </p>
              </div>
            )}
          </span>
          <span className="cursor-pointer" onClick={handleComment}>
            <FaRegCommentAlt />
          </span>
        </div>
        <div className="flex mt-1 text-sm sm:text-base 2xl:text-xl text-left justify-start">
          <p> {content}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
