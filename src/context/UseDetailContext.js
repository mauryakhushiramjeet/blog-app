import { Children, createContext, useState } from "react";

export const UserDetailContext = createContext(null);
export const UserDetailContextProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState("");
  const [userAuth, setUserAuth] = useState("");
  const [postUpdateId, setPostUpdateId] = useState(null);
  const [profileViewId, setProfileViewId] = useState(null);
  const [dashPosts, setDashPosts] = useState([]);
  const [commentPageId, setCommentPageId] = useState(null);

  return (
    <UserDetailContext.Provider
      value={{
        userDetails,
        setUserDetails,
        userAuth,
        setUserAuth,
        postUpdateId,
        setPostUpdateId,
        profileViewId,
        setProfileViewId,
        dashPosts,
        setDashPosts,
        commentPageId,
        setCommentPageId,
      }}
    >
      {children}
    </UserDetailContext.Provider>
  );
};
