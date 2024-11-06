"use client";
import Header from "./header";
import Footer from "./footer";
import PostDetail from "@/component/post-detail";
import { useState, useEffect } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(0);
  const isLoggedIn = localStorage.getItem("access_token") ? true : false;

  useEffect(() => {
    fetchPosts(); // Fetch posts on component mount
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8000/posts/published", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
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
      </main>

      <Footer />
    </>
  );
}
