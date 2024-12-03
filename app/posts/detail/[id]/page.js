"use client";
import Footer from "@/app/footer";
import Header from "@/app/header";
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import DOMPurify from "dompurify";
//import ReactQuill from "react-quill-new";
//import "react-quill-new/dist/quill.snow.css"; // Import Quill styling
import dynamic from "next/dynamic";

export default function Page({ params }) {
  //const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
  const { id: postId } = use(params);

  const isLoggedIn =
    typeof window !== "undefined" &&
    window.localStorage.getItem("access_token");
  const [post, setPost] = useState(null);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");

  const [editCommentId, setEditCommentId] = useState(0);
  const [editContent, setEditContent] = useState("");

  const [replyingToCommentId, setReplyingToCommentId] = useState(0);
  const [replyText, setReplyText] = useState("");

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const user_id =
    typeof window !== "undefined" && window.localStorage.getItem("user_id")
      ? window.localStorage.getItem("user_id")
      : 0;

  useEffect(() => {
    // Fetch post data based on postId
    async function fetchPost() {
      try {
        const response = await fetch(`${apiBaseUrl}/posts/detail/${postId}`);
        const postData = await response.json();
        if (!response.ok) {
          if (response.status === 404) {
            if (typeof window !== "undefined") {
              window.location.href = "/404";
            }
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setPost(postData);
        fetchCategory(postData.category_id);
        fetchAuthor(postData.user_id);
        fetchComments(postData.id);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    }

    const fetchCategory = async (categoryId) => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/categories/detail/${categoryId}`
        );
        const categoryData = await response.json();
        setCategory(categoryData);
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    };

    const fetchAuthor = async (authorId) => {
      try {
        const response = await fetch(`${apiBaseUrl}/users/${authorId}`);
        const authorData = await response.json();
        setAuthor(authorData);
      } catch (error) {
        console.error("Failed to fetch author", error);
      }
    };

    async function fetchComments(postId) {
      try {
        const response = await fetch(`${apiBaseUrl}/comments/post/${postId}`);
        const commentsData = await response.json();
        setComments(Array.isArray(commentsData) ? commentsData : []);

        // Fetch replies for each comment
        commentsData.forEach(async (comment) => {
          try {
            const response = await fetch(
              `${apiBaseUrl}/comments/${comment.id}/replies`
            );
            const repliesData = await response.json();
            setComments((prevComments) =>
              prevComments.map((c) =>
                c.id === comment.id ? { ...c, replies: repliesData } : c
              )
            );

            // replies to reply
            repliesData.forEach(async (reply) => {
              try {
                const response = await fetch(
                  `${apiBaseUrl}/comments/${reply.id}/replies`
                );
                const repliesData = await response.json();
                setComments((prevComments) =>
                  prevComments.map((c) =>
                    c.id === comment.id
                      ? {
                          ...c,
                          replies: c.replies.map((r) =>
                            r.id === reply.id
                              ? { ...r, replies: repliesData }
                              : r
                          ),
                        }
                      : c
                  )
                );
              } catch (error) {
                console.error("Failed to fetch replies", error);
              }
            });
          } catch (error) {
            console.error("Failed to fetch replies", error);
          }
        });
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    }

    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      console.error("Comment is empty");
      return;
    }
    console.log(comment);
    try {
      const token =
        typeof window !== "undefined" &&
        window.localStorage.getItem("access_token");

      const response = await fetch(`${apiBaseUrl}/comments/post/${postId}`, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          content: comment,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setComment(""); // Clear textarea after submission
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const editComment = (commentId) => {
    const commentToEdit = comments.find((c) => c.id === commentId);
    if (commentToEdit) {
      setEditCommentId(commentId);
      setEditContent(commentToEdit.content);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiBaseUrl}/comments/${editCommentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? window.localStorage.getItem("access_token")
              : ""
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === editCommentId ? { ...c, content: editContent } : c
          )
        );
        setEditCommentId(null);
        setEditContent("");
      } else {
        console.error("Failed to edit comment");
      }
    } catch (error) {
      console.error("Error editing comment", error);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? localStorage.getItem("access_token")
              : ""
          }`,
        },
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId)
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment", error);
    }
  };

  const handleReply = (commentId) => {
    setReplyingToCommentId(commentId);
  };

  const submitReply = async (commentId) => {
    // Submit reply to server
    try {
      const response = await fetch(
        `${apiBaseUrl}/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("access_token")
                : ""
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            comment_id: commentId,
            user_id: user_id,
            content: replyText,
          }),
        }
      );

      if (response.ok) {
        const newReply = await response.json();
        // Update comments with the new reply
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        );
        setReplyText("");
        setReplyingToCommentId(null);
      }
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  const handleCommentChange = (content) => {
    setComment(content);
  };

  const handleEditContentChange = (content) => {
    setEditContent(content);
  };

  const handleReplyText = (replyText) => {
    setReplyText(replyText);
  };

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">
            {post.title}
          </h1>

          <div className="text-gray-500 text-sm mb-4 flex flex-wrap items-center gap-4">
            <p>
              <span className="font-semibold text-gray-600">Published on:</span>
              <span className="ml-1 font-medium">
                {new Date(post.published_at).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-600">Last updated:</span>
              <span className="ml-1 font-medium">
                {new Date(post.updated_at).toLocaleDateString()}
              </span>
            </p>
          </div>

          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-600">Category:</span>
            <span className="ml-2 text-blue-600 hover:underline">
              <Link href={`/category/${category.id}`}>
                {category ? category.name : "Loading..."}
              </Link>
            </span>
          </div>

          <div className="flex items-center mb-4">
            <span className="font-semibold text-gray-600">Author:</span>
            <span className="ml-2 text-blue-600 hover:underline">
              <Link href={`/user/${author.id}`}>
                {author ? author.username : "Loading..."}
              </Link>
            </span>
          </div>

          <hr className="my-4" />

          <h2 className="text-xl font-semibold text-gray-700 mb-2">Content</h2>
          <div className="quill-content">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.content),
              }}
              className="ql-editor max-w-full prose prose-lg text-gray-700 mb-6"
            />
          </div>

          <hr className="my-4" />

          {/* Comments Section */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Comments</h2>
          <div>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              <ul className="mb-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="border-b py-2">
                    {editCommentId === comment.id ? (
                      <form onSubmit={handleEditSubmit}>
                        <textarea
                          value={editContent}
                          onChange={(e) =>
                            handleEditContentChange(e.target.value)
                          }
                          className="w-full h-96 p-4 border border-gray-300 rounded-md"
                        />

                        <button type="submit" className="text-green-500 mr-2">
                          Save
                        </button>
                        <button
                          onClick={() => setEditCommentId(null)}
                          className="text-red-500"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <>
                        <p>{comment.user_id}</p>
                        <div
                          key={comment.id}
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.content),
                          }}
                          className="ql-editor prose prose-lg text-gray-700"
                        />
                        {comment.user_id == user_id && (
                          <div className="flex space-x-2 mt-2">
                            <button
                              onClick={() => editComment(comment.id)}
                              className="text-blue-500 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteComment(comment.id)}
                              className="text-red-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                        {isLoggedIn && (
                          <button
                            onClick={() => handleReply(comment.id)}
                            className="text-green-500 hover:underline"
                          >
                            Reply
                          </button>
                        )}
                        {/* Show reply textarea if replying to this comment */}
                        {replyingToCommentId === comment.id && (
                          <div className="mt-2">
                            <h4 className="text-lg font-semibold">
                              Reply to Comment:
                            </h4>
                            <textarea
                              value={replyText}
                              onChange={(e) => handleReplyText(e.target.value)}
                              className="w-full h-96 p-4 border border-gray-300 rounded-md"
                            />
                            <button
                              onClick={() => submitReply(comment.id)}
                              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                              Submit Reply
                            </button>
                          </div>
                        )}
                        {comment.replies && (
                          <div className="mt-2 ml-4">
                            <h4 className="text-lg font-semibold">Replies:</h4>
                            {comment.replies.map((reply) => (
                              <div
                                key={reply.id}
                                dangerouslySetInnerHTML={{
                                  __html: DOMPurify.sanitize(reply.content),
                                }}
                                className="ql-editor prose prose-lg text-gray-700"
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Comment Input */}
          {isLoggedIn ? (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-md"
              />

              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form>
          ) : (
            <p className="text-blue-500 hover:underline">
              <a href="/login">Log in to comment</a>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
