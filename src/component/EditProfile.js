import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { UserDetailContext } from "../context/UseDetailContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import imageCompression from "browser-image-compression";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [editImage, setEditImage] = useState(null);
  const navigate = useNavigate();
  const { userDetails, setUserDetails, userAuth } =
    useContext(UserDetailContext);
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const compressedImage = await imageCompression(file);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onload = () => {
        setEditImage(reader.result);
        // console.log(reader.result);
      };
    } catch (erro) {
      console.log(erro.message);
    }
  };
  useEffect(() => {
    setUsername(userDetails.userName);
    setBio(userDetails.bio);
  }, [userDetails]);
  // console.log(userAuth.uid);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "user", userAuth.uid), {
        userName: username,
        bio,
        image: editImage ? editImage : userDetails.image,
      });
      const updatedDoc = await getDoc(doc(db, "user", userAuth.uid));
      console.log(updatedDoc.data());
      setUserDetails(updatedDoc.data());

      toast.success("Profile updated successfully!!");
      navigate("/profile");
    } catch (error) {
      console.log(error);
      toast.error(error.mesage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 relative py-10 flex mt-11 justify-center">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-[#784bdb] left-0 absolute"
      >
        <FaArrowLeft className="h-4 xs:h-6 2xl:h-9 w-4 xs:w-6 2xl:w-9"/>
      </button>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-[#42307D] mb-6 text-center">
          Edit Profile
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={userDetails?.image || editImage}
            alt="User Preview"
            className="w-24 h-24 rounded-full border-4 p-[3px] object-cover border-[#42307D] mb-2"
          />
          <label className="cursor-pointer text-sm text-[#42307D] hover:underline">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Username */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ring-[#42307D]/50"
        />

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="w-full mb-6 px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 ring-[#42307D]/50"
        ></textarea>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-[#42307D] text-white py-2 rounded-lg hover:bg-[#5e44aa] transition-all"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
