import React, { useContext, useEffect, useState } from "react";
import userImage from "../Assets/user.png";
import logo from "../Assets/logo.png";
import { IoSearch } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { UserDetailContext } from "../context/UseDetailContext";
import { LuMenu } from "react-icons/lu";
const Navbar = () => {
  const [searchName, setSearchName] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);
  // const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isPathProfile = location.pathname.includes("/profile");
  const {
    userDetails,
    setUserDetails,
    setUserAuth,
    dashPosts,
    setProfileViewId,
  } = useContext(UserDetailContext);
  const fetchUserData = async () => {
    try {
      auth.onAuthStateChanged(async (user) => {
        // console.log(user);
        if (user && user.uid) {
          setUserAuth(user);
          const userRef = doc(db, "user", user?.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            // console.log(userSnap.data());
            setUserDetails(userSnap.data());
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
  const handleSearch = () => {
    if (!searchName.trim()) {
      setSearchUsers([]);
      return;
    }
    const fil = dashPosts.filter((dashname) =>
      dashname?.name?.toLowerCase().includes(searchName.toLowerCase())
    );
    console.log(fil);
    setSearchUsers(fil);
  };
  useEffect(() => {
    const setTimeOutId = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => {
      clearTimeout(setTimeOutId);
    };
  }, [searchName]);
  const handleVeiwProfile = (id) => {
    setProfileViewId(id);
    console.log(id);
    navigate("/view-profile");
    setSearchName("");
  };
  return (
    <header className="relative">
      <nav className="bg-white shadow-2xl mx-auto px-6 2xl:px-10 py-[10px] lg:py-4 flex justify-between items-center border top-[3px] fixed w-full  z-10 rounded-[100px] mt-1">
        {/* Left: Brand / Logo */}
        <div className="text-2xl 2xl:text-[35px] font-semibold lg::font-bold text-[#42307D] tracking-wide cursor-pointer hidden sm:block">
          Ink Insight
        </div>

        <div className="relative">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Search"
            className="w-full pl-[42px] pr-[10px] xs:px-12 text-sm 2xl:text-xl py-[3px] xs:py-[6px] 2xl:py-[14px] top-[1px] 2xl:pr-[132px] xs:top-[25px] outline-none bg-transparent   rounded-lg border border-gray-300 focus:outline-none sm:focus:ring-2  focus:ring-[#42307D]/50"
          />
          <p className="absolute top-[1px] xs:top-[4px] lg:top-[6px] 2xl:top-[14px] left-3">
            <IoSearch sx={{ color: "#42307D" }} />
          </p>
          {searchUsers.length > 0 && (
            <div className="absolute flex flex-col gap-2 rounded-xl bg-gray-200 py-[10px] lg:py-5 px-6 top-14 items-start">
              {searchUsers.map((post) => (
                <div
                  className="flex gap-10 items-center hover:bg-gray-300 px-3 w-full cursor-pointer"
                  onClick={() => handleVeiwProfile(post.userId)}
                >
                  <img
                    src={post.prifileImage}
                    alt="nav-search-userImage"
                    className="rounded-full h-10 2xl:h-16 w-10 2xl:w-16 object-cover"
                  />
                  <p className="text-sm 2xl:text-2xl">{post.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div
          title="Profile"
          className="relative border ring-2 ring-[#42307D]/50 rounded-full hidden md:block"
        >
          <img
            onClick={() => navigate("/profile")}
            src={userDetails.image || userImage}
            alt="profile"
            className="h-12 2xl:h-20 w-12 2xl:w-20 rounded-full border border-gray-300 cursor-pointer object-cover"
          />
        </div>

        {/* Mobile View */}
        {!isPathProfile && (
          <div className="block md:hidden group relative">
            <p
              className="cursor-pointer"
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              <LuMenu sx={{ color: "#42307D" }} />
            </p>
            <p className="absolute top-11 -right-3 text-sm bg-gray-600 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 py-1 px-2 rounded-md shadow-md">
              Profile
            </p>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
