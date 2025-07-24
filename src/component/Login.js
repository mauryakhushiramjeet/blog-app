import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { UserDetailContext } from "../context/UseDetailContext";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoding, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { setUserAuth } = useContext(UserDetailContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = UserCredential.user;
      setUserAuth(user);
      toast.success("User login successfully!!");
      navigate("/dash");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="min-h-screen bg-[#42307D]/15 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">
        <div className="mb-8 text-center">
          <p className="text-sm text-[#42307D] font-semibold uppercase">
            Ink Insight
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
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

          <div>
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
          </div>

          <div className="flex items-center justify-between text-sm">
            <span />
            <a
              href="#"
              className="text-[#42307D]/60 text-semibold hover:underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#42307D]/80 hover:bg-[#42307D] text-white py-2 rounded-lg font-medium transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <span
            className="text-[#42307D] hover:underline font-medium cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
