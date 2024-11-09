"use client";
import Header from "./header";
import Footer from "./footer";
import PostDetail from "@/component/post-detail";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(0);

  const [page, setPage] = useState(1); // Track the current page for pagination
  const [loading, setLoading] = useState(false); // Loading state to avoid duplicate requests
  const observerRef = useRef(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  console.log(apiBaseUrl);
  const skip = page == 1 ? 0 : 9 * page; // Number of posts to skip for pagination

  const isLoggedIn =
    typeof window !== "undefined" && localStorage.getItem("access_token")
      ? true
      : false;

  useEffect(() => {
    fetchPosts(); // Fetch posts on component mount
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

  if (selectedPostId) {
    // Show PostDetail if a post ID is selected
    return (
      <PostDetail
        postId={selectedPostId}
        onBack={() => setSelectedPostId(null)}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        <h2 className="text-2xl font-bold mb-4">Blog List</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <article className="bg-white p-4 rounded-lg shadow" key={post.id}>
              <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700">
                {post.content.substring(0, 50)}...
              </p>
              <button
                onClick={() => setSelectedPostId(parseInt(post.id))}
                className="text-blue-500 hover:underline"
              >
                Read More
              </button>
            </article>
          ))}
        </div>
        {/* Placeholder div to observe for loading more posts */}
        <div id="load-more" className="my-8">
          {loading && <p>Loading more posts...</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
