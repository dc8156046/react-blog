"use client";
import Header from "../header";
import Footer from "../footer";
import Side from "../side";
import PostDetail from "@/component/post-detail";
import { useState, useEffect } from "react";

export default function Page() {
  const [posts, setPosts] = useState([]);
  const [isAscending, setIsAscending] = useState(true);
  const [selectedPostId, setSelectedPostId] = useState(0);
  const isLoggedIn = true;
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchPosts(); // Fetch posts on component mount
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          const errorData = await res.json();
          alert(`Error: ${errorData.detail || "Invalid credentials"}`);
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          localStorage.removeItem("username");
          localStorage.removeItem("user_id");
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deletePost = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/posts/my/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || "Invalid credentials"}`);
          localStorage.removeItem("access_token");
          localStorage.removeItem("token_type");
          localStorage.removeItem("username");
          localStorage.removeItem("user_id");
          window.location.href = "/login";
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const resetForm = () => {
    setEditingPostId(null);
    setNewPostTitle("");
    setNewPostDescription("");
    setNewPostAuthor("");
  };

  const sortPostsById = () => {
    const sortedPosts = [...posts].sort((a, b) =>
      isAscending ? a.id - b.id : b.id - a.id
    );
    setPosts(sortedPosts);
    setIsAscending(!isAscending); // Toggle sort order
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
      <div className="flex min-h-screen">
        <Side />
        <main className="flex-1 p-10">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Posts</h1>
              <a
                href="/posts/add"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Post
              </a>
            </div>

            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={sortPostsById}
                  >
                    Post ID {isAscending ? "↑" : "↓"}
                  </th>
                  <th className="py-2 px-4 border-b">Title</th>
                  <th className="py-2 px-4 border-b">Content</th>
                  <th className="py-2 px-4 border-b">Slug</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No posts found
                    </td>
                  </tr>
                )}
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="py-2 px-4 border-b">{post.id}</td>
                    <td className="py-2 px-4 border-b">
                      {post.title.substring(0, 50)}...
                    </td>
                    <td className="py-2 px-4 border-b">
                      {post.content.substring(0, 50)}...
                    </td>
                    <td className="py-2 px-4 border-b">{post.slug}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => setSelectedPostId(parseInt(post.id))}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => editPost(post)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
