"use client";
import Header from "./header";
import Footer from "./footer";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1); // Track the current page for pagination
  const [loading, setLoading] = useState(false); // Loading state to avoid duplicate requests
  const observerRef = useRef(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  //console.log(apiBaseUrl);
  const skip = page == 1 ? 0 : 9 * page; // Number of posts to skip for pagination

  useEffect(() => {
    fetchPosts(); // Fetch posts on component mount
    fetchCategories(); // Fetch categories on component mount
  }, [page]);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/posts/published?skip=${skip}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? localStorage.getItem("access_token")
              : ""
          }`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts((prevPosts) => [...prevPosts, ...data]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/categories/all`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value); // Call the search handler with the current search term
  };

  const handleCategoryClick = (category) => {
    if (category === null && typeof window !== "undefined") {
      window.location.href = "/";
      return;
    }
    setSelectedCategory(category);
    onCategorySelect(category); // Call the category selection handler with the selected category
  };

  const onSearch = async (searchTerm) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/posts/search?query=${searchTerm}`,
        {
          method: "GET",
        }
      );
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onCategorySelect = async (category) => {
    try {
      const res = await fetch(`${apiBaseUrl}/posts/category/${category}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Callback for the intersection observer
  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loading) {
        setPage((prevPage) => prevPage + 1); // Load the next page
      }
    },
    [loading]
  );

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(handleObserver);
    const element = document.querySelector("#load-more");
    if (element) observerRef.current.observe(element);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [handleObserver]);

  // if (selectedPostId) {
  //   // Show PostDetail if a post ID is selected
  //   return (
  //     <PostDetail
  //       postId={selectedPostId}
  //       onBack={() => setSelectedPostId(null)}
  //       isLoggedIn={isLoggedIn}
  //     />
  //   );
  // }

  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        {/* Search and Category Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg mb-4 md:mb-0"
          />

          {/* Category List */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-4 py-2 rounded-lg ${
                !selectedCategory
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              All
            </button>

            {categories.map((category) =>
              category.name === "Root" ? null : (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {category.name}
                </button>
              )
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4">Blog List</h2>
        {/* Post List */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <article className="bg-white p-4 rounded-lg shadow" key={post.id}>
                <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-700">
                  {post.content.substring(0, 50)}...
                </p>
                <Link
                  href={`/posts/detail/${post.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Read More
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-8">
            No posts found. Try a different search or category.
          </p>
        )}

        {/* Placeholder div to observe for loading more posts */}
        <div id="load-more" className="my-8">
          {loading && <p>Loading more posts...</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
