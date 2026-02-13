import React, { useMemo, useState } from "react";
import { blogCategories } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs"; 

const BlogList = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

 
  const {
    data: blogs = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useBlogs();

  const { filteredBlogs, publishedBlogs } = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    const filtered = (blogs || []).filter((blog) => {
      const matchesCategory =
        activeCategory === "All" || blog.category === activeCategory;

      const matchesSearch =
        blog.title?.toLowerCase().includes(searchText) ||
        blog.description?.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });

    const published = filtered.filter((blog) => blog.isPublished === true);

    return { filteredBlogs: filtered, publishedBlogs: published };
  }, [blogs, search, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex justify-center mb-10">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 bg-gradient-to-b from-white to-stone-200/40 p-3 rounded-4xl text-gray-800 placeholder-gray-500 mr-3"
        />

        <button
          onClick={() => setSearch("")}
          className="group p-[4px] rounded-4xl bg-gradient-to-b from-white to-stone-200/40 
               shadow-[0_1px_3px_rgba(0,0,0,0.5)] 
               active:shadow-[0_0px_1px_rgba(0,0,0,0.5)] 
               active:scale-[0.995]"
        >
          <div className="bg-gradient-to-b from-stone-200/40 to-white/80 rounded-[8px] px-4 py-2">
            <span className="font-semibold">Clear Search</span>
          </div>
        </button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-14">
        {blogCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-6 py-2.5 rounded-full text-sm font-semibold
              transition-all duration-300 ease-out
              ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-gray-900 to-black text-white shadow-lg shadow-black/30 scale-105"
                  : "bg-white/70 backdrop-blur text-gray-700 hover:text-black hover:bg-white hover:shadow-md hover:scale-105"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filteredBlogs.length > 0 ? (
        <h1 className="text-3xl font-bold text-gray-50 mb-10 text-center">
          Latest Blogs
        </h1>
      ) : (
        ""
      )}

      {/* ✅ loading state from React Query */}
      {isLoading && (
        <p className="text-center text-gray-500">Loading blogs...</p>
      )}

      {/* ✅ error state from React Query */}
      {isError && (
        <p className="text-center text-red-400">
          Error fetching blogs: {error?.message}
        </p>
      )}

      {/* ✅ background refetch indicator (optional) */}
      {!isLoading && !isError && isFetching && (
        <p className="text-center text-gray-500 mb-4">Updating...</p>
      )}

      {!isLoading && !isError && publishedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {publishedBlogs.map((blog) => (
            <Link
              key={blog._id}
              to={`/blog/${blog._id}`}
              className="group bg-gray-300 rounded-2xl overflow-hidden 
                       border hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  loading="lazy"
                  className="w-full h-full object-cover 
                           group-hover:scale-105 transition duration-300"
                />
              </div>

              <div className="p-5">
                <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full mb-3">
                  {blog.category}
                </span>

                <h2 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:underline">
                  {blog.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !isLoading &&
        !isError && (
          <p className="text-center text-gray-500">No blogs found</p>
        )
      )}
    </div>
  );
};

export default BlogList;
