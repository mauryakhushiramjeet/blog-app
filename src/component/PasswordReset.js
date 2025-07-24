import React from "react";

const PasswordReset = () => {
  return (
    <div className="min-h-screen bg-[#42307D]/15 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10">
        <div className="mb-8 text-center">
          <p className="text-sm text-[#42307D] font-semibold uppercase">
            Reset Password
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#42307D]/50"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#42307D]/80 hover:bg-[#42307D] text-white py-2 rounded-lg font-medium transition"
          >
            Save password
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
