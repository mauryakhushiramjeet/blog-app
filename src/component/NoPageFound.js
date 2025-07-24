import React from "react";
import { useNavigate } from "react-router-dom";

const NoPageFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-gray-50">
      <h1 className="text-6xl md:text-8xl font-bold text-[#42307D]">404</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mt-4">
        Page Not Found
      </h2>
      <p className="text-gray-600 mt-2 text-sm md:text-base max-w-md">
        Sorry, the page you're looking for doesn’t exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/dash")}
        className="mt-6 px-6 py-2 text-white bg-[#42307D] hover:bg-[#42307D]/80 rounded-lg transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default NoPageFound;
