import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserAuthContext = createContext(null);
export const UserAuthContextProvider = ({ children }) => {
  const [userAuthenticated, setUserAuthenticated] = useState("");
  useEffect(() => {
    const userData = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserAuthenticated(user);
        console.log(user);
      }
    });
    return () => {
      userData();
    };
  }, []);
  return (
    <UserAuthContext.Provider
      value={{ userAuthenticated, setUserAuthenticated }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};
