import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import imageCompression from "browser-image-compression";
import { v4 as uuid4 } from "uuid";
import { toast } from "react-toastify";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { UserDetailContext } from "../context/UseDetailContext";
import { db } from "../firebase";
const CreatePost = () => {
  const [preview, setPreview] = useState(null);
  const [content, setContent] = useState("");
  const [updateData, setUpdateData] = useState(null);
  const navigate = useNavigate();
  const { userAuth, postUpdateId, setPostUpdateId, userDetails } =
    useContext(UserDetailContext);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const options = {
        maxWidthOrHeight: 300,
        useWebWorker: true,
      };
      const compressedImage = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onload = () => {
        console.log(reader.result);
        setPreview(reader.result);
      };
    } catch (error) {
      console.log(error.message);
    }
  };
  console.log(userDetails);
  const handlePost = async (e) => {
    e.preventDefault();
    if (content.trim("") === "") {
      toast.error("Please write something in content");
      return;
    }

    const postId = uuid4();
    try {
      if (postUpdateId) {
        const UpdatePostRef = doc(db, "posts", postUpdateId);
        await updateDoc(UpdatePostRef, {
          image: preview,
          content: content,
          createdAt: serverTimestamp(),
        });
        toast.success("Post updated successfully!");
        setPostUpdateId(null);
      } else {
        const postRef = doc(db, "posts", postId);
        await setDoc(postRef, {
          userId: userAuth.uid,
          id: postId,
          name: userDetails.userName,
          prifileImage: userDetails.image,
          image: preview,
          content: content,
          createdAt: serverTimestamp(),
        });

        toast.success("Post created successfully!");
      }
      navigate("/profile");
      setPreview(null);
      setContent("");
    } catch (error) {
      console.log(error.message);
    }
  };
  const loadUpdatePost = async () => {
    if (postUpdateId) {
      const snap = await getDoc(doc(db, "posts", postUpdateId));
      if (snap.exists()) {
        const data = snap.data();
        setUpdateData(data);
        setContent(data.content);
        setPreview(data.image);
      }
    }
  };

  useEffect(() => {
    loadUpdatePost();
  }, [postUpdateId]);

  return (
    <div className="min-h-screen bg-gray-100 sm:px-4 py-10 flex justify-center mt-16 relative">
      <button
        onClick={() => {
          navigate("/profile");
          setPostUpdateId(null);
        }}
        className="text-sm text-[#784bdb] left-[7px] xs:left-[17px] absolute"
      >
        <FaArrowLeft className="h-4 xs:h-6 2xl:h-9 w-4 xs:w-6 2xl:w-9" />
      </button>
      <form
        onSubmit={handlePost}
        className="bg-white p-2 xs:p-4 md:p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#42307D] mb-6 text-center">
          {postUpdateId ? "Update Post" : " Create New Post"}
        </h2>

        {/* Image Upload */}
        {preview ? (
          <div className="mb-4">
            <img
              src={preview || updateData?.image}
              alt="Preview"
              className="w-full rounded-lg object-contain"
            />
          </div>
        ) : (
          <label className="block mb-4 text-center cursor-pointer text-[#42307D] underline 2xl:text-2xl">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden "
            />
          </label>
        )}
        {postUpdateId && (
          <label className="block mb-4 text-center cursor-pointer text-[#42307D] underline 2xl:text-2xl">
            updateImage Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden "
            />
          </label>
        )}
        {/* Content */}
        <textarea
          placeholder="Write your thoughts or blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full mb-6 px-4 py-2 border text-base md:text-lg 2xl:text-2xl rounded-lg resize-none focus:outline-none focus:ring-2 ring-[#42307D]/50"
        ></textarea>

        {/* Post Button */}
        <button
          type="submit"
          className="w-full bg-[#42307D] text-white py-2 2xl:py-3 text-base lg:text-xl rounded-lg hover:bg-[#5e44aa] transition-all"
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
