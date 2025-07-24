import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
import sigupUserImage from "../Assets/user.png";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
const Register = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fireBaseimage64, setFireBaseimage64] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoding, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const handleFile = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    if (!image) return;
    try {
      const compressedImage = await imageCompression(image);
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onload = () => {
        setFireBaseimage64(reader.result);
      };
    } catch (error) {
      console.log(image);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = UserCredential.user;
      await setDoc(doc(db, "user", user.uid), {
        userName,
        email,
        image: fireBaseimage64,
      });
      toast.success("User signup successfully!!");
      setEmail("");
      setPassword("");
      setUserName("");
      setFireBaseimage64(null);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#42307D]/15 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">
        <div className="mb-4 text-center">
          <p className="text-sm text-[#42307D] font-semibold uppercase">
            Ink Insight
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSignUp}>
          <div className="flex items-center justify-center">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleFile}
            />
            <label htmlFor="image">
              <div
                className={`${
                  fireBaseimage64
                    ? " border-[3px] border-[#42307D]/60 p-[2px] rounded-full"
                    : ""
                }`}
              >
                <img
                  src={fireBaseimage64 || sigupUserImage}
                  alt="user-image"
                  className="rounded-full h-32 w-32 object-cover cursor-pointer"
                />
              </div>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Username..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
            {password && (
              <p className="absolute top-8 right-2 text-gray-400">
                <span
                  onClick={() => setShowPassword(true)}
                  className={`${
                    showPassword ? "hidden" : "block"
                  } cursor-pointer`}
                >
                  <FiEyeOff />
                </span>
                <span
                  onClick={() => setShowPassword(false)}
                  className={`${showPassword ? "block" : "hidden"}`}
                >
                  <FiEye />
                </span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#42307D]/80 hover:bg-[#42307D] text-white py-2 rounded-lg font-medium transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?
          <span
            className="text-[#42307D] hover:underline font-medium cursor-pointer"
            onClick={() => navigate("/")}
          >
            Login now
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
