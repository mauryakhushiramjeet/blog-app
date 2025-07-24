import React, { useContext } from "react";
import { UserAuthContext } from "../context/UserAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { userAuthenticated } = useContext(UserAuthContext);
  return userAuthenticated ? <Outlet /> : <Navigate to={"/"} replace />;
};
export default ProtectedRoute;
