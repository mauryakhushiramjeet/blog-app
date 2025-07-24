import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./component/Login";
import Register from "./component/Register";
import PasswordReset from "./component/PasswordReset";
import Dashboard from "./component/Dashboard";
import Profile from "./component/Profile";
import Layout from "./component/Layout";
import EditProfile from "./component/EditProfile";
import CreatePost from "./component/CreatePost";
import { ToastContainer } from "react-toastify";
import ViewProfile from "./component/ViewProfile";
import CommentAndLikesPage from "./component/CommentAndLikesPage";
import ProtectedRoute from "./component/ProtectedRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";
import NoPageFound from "./component/NoPageFound";
const App = () => {
  return (
    <div className="font-nunito">
      <BrowserRouter>
        <Routes>
          <Route element={<AuthRedirectRoute />}>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Register />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dash" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/post" element={<CreatePost />} />
              <Route path="/pass" element={<PasswordReset />} />
              <Route path="/view-profile" element={<ViewProfile />} />
              <Route path="/Comment-likes" element={<CommentAndLikesPage />} />
            </Route>
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
