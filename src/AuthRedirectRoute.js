import React, { useContext } from "react";
import { UserAuthContext } from "./context/UserAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AuthRedirectRoute = () => {
  const { userAuthenticated } = useContext(UserAuthContext);
  return !userAuthenticated ? <Outlet /> : <Navigate to={"/dash"} replace />;
};

export default AuthRedirectRoute;
