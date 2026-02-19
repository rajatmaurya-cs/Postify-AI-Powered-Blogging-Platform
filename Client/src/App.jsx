
import React, { Suspense, lazy, useContext ,useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/Authcontext";
const Home = lazy(() => import("./Components/Homefolder/Home"));
const WholeBlog = lazy(() => import("./WholeBlog"));
const Login = lazy(() => import("./Components/Homefolder/Login"));
const Signup = lazy(() => import("./Components/Homefolder/Signup"));
const ForgetPassword = lazy(() => import("./Components/PasswordReset/ForgetPassword"));

const Layout = lazy(() => import("./Components/AdminFolder/Layout"));
const DashBoard = lazy(() => import("./Components/AdminFolder/DashBoard"));
const BlogList = lazy(() => import("./Components/AdminFolder/BlogList"));
const Comments = lazy(() => import("./Components/AdminFolder/Comments"));
const AddBlog = lazy(() => import("./Components/AdminFolder/AddBlog"));
const AI = lazy(() => import("./Components/AdminFolder/AI"));
const AIconfig = lazy(() => import("./Components/AdminFolder/AISettings"));

const PrivacyPolicy = lazy(() => import("./Pages/PrivacyPolicy.jsx"))
const Terms = lazy(() => import("./Pages/Terms.jsx"))

import { Loading } from 'notiflix/build/notiflix-loading-aio';



function App() {
  const { loading } = useContext(AuthContext);

    useEffect(() => {
    if (loading) {
      Loading.dots("Loading...");
    } else {
      Loading.remove();
    }

  
    return () => Loading.remove();
  }, [loading]);

  if (loading) return  null;

  return (
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/blog/:blogId" element={<WholeBlog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        <Route path="/admin" element={<Layout />}>
          <Route index element={<DashBoard />} />
          <Route path="listBlog" element={<BlogList />} />
          <Route path="AI" element={<AI />} />
          <Route path="AIsetting" element={<AIconfig />} />
          <Route path="Comments" element={<Comments />} />
          <Route path="addblog" element={<AddBlog />} />
        </Route>
      </Routes>

    </Suspense>
  );
}

export default App;
