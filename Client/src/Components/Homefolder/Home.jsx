import React, { Suspense, lazy } from "react";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";

const BlogList = lazy(() => import("./BlogList"));

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />

      <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
        <BlogList />
      </Suspense>
      <Footer/>
      
    </div>
  );
};

export default Home;
