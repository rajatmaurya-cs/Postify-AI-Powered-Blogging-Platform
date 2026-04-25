import { useMemo, useState } from "react";
import { blogCategories, assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { useBlogsInfinite } from "../../hooks/useBlogsInfinite";

const LIMIT = 3;

const BlogList = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useBlogsInfinite({ category: activeCategory, limit: LIMIT, isAdmin: false });


  const blogs = useMemo(() => {
    return data?.pages?.flatMap((p) => p.blogs) ?? [];
  }, [data]);

  const { filteredBlogs, publishedBlogs } = useMemo(() => {
    
    const searchText = search.toLowerCase().trim();

    const filtered = (blogs || []).filter((blog) => {
      const matchesSearch = (blog.title || "").toLowerCase().includes(searchText);
      return matchesSearch;
    });

    const published = filtered.filter((blog) => blog.isPublished === true);

    return { filteredBlogs: filtered, publishedBlogs: published };
  }, [blogs, search]);

  return (
    <section className="relative w-full bg-[#fafbfc] min-h-screen pt-24 pb-32 overflow-hidden font-sans">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 z-10">

        {/* Search & Filter Header Section */}
        <div className="flex flex-col items-center justify-center space-y-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

          <div className="w-full max-w-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-100 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-500 z-0"></div>
            <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-gray-200/80 p-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all z-10">
              <div className="pl-6 pr-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search premium articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-4 pr-6 text-gray-900 placeholder-gray-400 focus:outline-none text-lg font-medium tracking-wide"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="mr-2 p-2 px-4 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold text-sm transition-colors border border-gray-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`relative px-7 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ease-out
                  ${activeCategory === cat
                    ? "bg-gray-900 text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)] scale-[1.02]"
                    : "bg-white/80 backdrop-blur-md text-gray-600 border border-gray-200/80 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm hover:scale-[1.02]"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative w-full z-10 min-h-[400px]">
          {filteredBlogs.length > 0 && (
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Latest Insights
              </h2>
              <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent ml-8"></div>
            </div>
          )}

          {isError && (
            <div className="p-6 bg-red-50/50 rounded-3xl border border-red-100 text-center max-w-lg mx-auto">
              <p className="text-red-600 font-medium">Unable to load insights: {error?.message}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin"></div>
              <p className="text-gray-400 font-medium tracking-wide animate-pulse">Curating articles...</p>
            </div>
          )}

          {!isLoading && !isError && publishedBlogs.length > 0 ? (
            <div className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {publishedBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blog/${blog._id}`}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="relative h-64 overflow-hidden bg-gray-50">
                      <div className="absolute inset-0 bg-gray-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold tracking-widest uppercase text-gray-900 shadow-sm border border-white/20">
                          {blog.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={blog?.createdBy?.avatar || assets.user_icon}
                            alt={blog?.createdBy?.fullName || "Author"}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src = assets.user_icon;
                            }}
                            className="w-8 h-8 rounded-full object-cover bg-gray-100 ring-2 ring-white shadow-sm"
                          />
                          <span className="text-sm font-semibold text-gray-700">{blog.createdBy?.fullName || "Author"}</span>
                        </div>
                        <div className="p-2 rounded-full bg-gray-50 group-hover:bg-indigo-50 transition-colors">
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col items-center justify-center pt-8">
                {hasNextPage ? (
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="group relative inline-flex items-center justify-center px-10 py-4 bg-white border border-gray-200 text-gray-900 font-bold tracking-wide rounded-full overflow-hidden transition-all hover:border-gray-300 hover:shadow-lg disabled:opacity-50 disabled:hover:shadow-none"
                  >
                    <span className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {isFetchingNextPage ? (
                      <span className="relative flex items-center gap-3">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                        Retrieving...
                      </span>
                    ) : (
                      <span className="relative z-10">Discover More</span>
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-4 text-gray-400">
                    <div className="h-px w-12 bg-gray-200"></div>
                    <p className="text-sm font-medium tracking-widest uppercase">End of Insights</p>
                    <div className="h-px w-12 bg-gray-200"></div>
                  </div>
                )}

                {!isFetchingNextPage && isFetching && (
                  <p className="text-center text-gray-400 mt-6 text-sm font-medium animate-pulse">Syncing latest metrics...</p>
                )}
              </div>
            </div>
          ) : (
            !isLoading && !isError && (
              <div className="py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">No Insights Found</h3>
                <p className="text-gray-500 font-medium">Try adjusting your filters or search terms.</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
export default BlogList;
