import React from "react";

const Model = ({ isOpen, onClose, OnDeletePost }) => {
  if (!isOpen) return;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 shadow-lg">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-lg relative">
        <p className="font-bold text-2xl">
          Are You sure ? you want to delete
        </p>
        <div className="flex justify-around pt-6">
          <button
            className="py-[2px] px-5 rounded-xl bg-red-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="py-[2px] px-5 rounded-xl bg-[#5e44aa]"
            onClick={OnDeletePost}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model;
