
// import { Route, Routes } from 'react-router-dom'
// import Home from './Components/Homefolder/Home'
// import React from 'react'
// import Layout from './Components/AdminFolder/Layout'
// import DashBoard from './Components/AdminFolder/DashBoard'
// import WholeBlog from './WholeBlog'
// import BlogList from './Components/AdminFolder/BlogList'
// import Comments from './Components/AdminFolder/Comments'
// import AddBlog from './Components/AdminFolder/AddBlog'
// import Login from './Components/Homefolder/Login'
// import Signup from './Components/Homefolder/Signup'
// import ForgetPassword from './Components/PasswordReset/ForgetPassword'
// import 'quill/dist/quill.snow.css'
// import AI from './Components/AdminFolder/AI'
// import AIconfig from './Components/AdminFolder/AISettings '
// import { AuthContext } from './Context/Authcontext'
// import { useContext } from 'react'


// function App() {

//   const { loading } = useContext(AuthContext)


//   if (loading) {
//     return <div>Checking authentication...</div>;
//   }


//   return (
//     <>
//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/blog/:blogId' element={<WholeBlog />} />
//         <Route path='/login' element={<Login />} />
//         <Route path='/signUp' element={<Signup />} />
//         <Route path="/forgot-password" element={<ForgetPassword />} />

//         <Route path='/admin' element={<Layout />}>
//           <Route index element={<DashBoard />} />
//           <Route path='listBlog' element={<BlogList />} />
//           <Route path='AI' element={<AI />} />
//           <Route path='AIsetting' element={<AIconfig />} />
//           <Route path='Comments' element={<Comments />} />
//           <Route path='addblog' element={<AddBlog />} />

//         </Route>
//       </Routes>


//     </>
//   )
// }

// export default App
import React, { Suspense, lazy, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthContext } from "./Context/Authcontext";

// Lazy imports (code splitting)
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

function App() {
  const { loading } = useContext(AuthContext);

  if(loading) return <div>Checking authentication...</div>;

  return (
    <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
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
