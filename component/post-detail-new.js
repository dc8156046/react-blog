import React, { useState, useEffect } from "react";
import Header from "@/app/header";
import Footer from "@/app/footer";

function Comment({ comment, onReply, userId }) {
  const [replyText, setReplyText] = useState("");
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setReplyingToCommentId(null);
    }
  };

  return (
    <div className="border-l-2 pl-4 mb-2">
      <p>
        {comment.content} by {comment.user_id}
      </p>
      {comment.user_id === userId && (
        <div>{/* Edit/Delete buttons could be added here */}</div>
      )}
      <button
        onClick={() => setReplyingToCommentId(comment.id)}
        className="text-blue-500 hover:underline"
      >
        Reply
      </button>

      {/* Show textarea if replying to this comment */}
      {replyingToCommentId === comment.id && (
        <div className="mt-2">
          <textarea
            className="w-full p-2 border rounded"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
          />
          <button
            onClick={handleReplySubmit}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Reply
          </button>
        </div>
      )}

      {/* Render nested replies recursively */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 ml-4">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              userId={userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PostDetail({ postId, onBack, isLoggedIn }) {
  const [post, setPost] = useState(null);
  const [category, setCategory] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const userId = localStorage.getItem("user_id") || 0;

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(
          `http://localhost:8000/posts/detail/${postId}`
        );
        const postData = await response.json();
        setPost(postData);
        fetchCategory(postData.category_id);
        fetchComments(postData.id);
      } catch (error) {
        console.error("Failed to fetch post", error);
      }
    }

    const fetchCategory = async (categoryId) => {
      try {
        const response = await fetch(
          `http://localhost:8000/categories/detail/${categoryId}`
        );
        const categoryData = await response.json();
        setCategory(categoryData);
      } catch (error) {
        console.error("Failed to fetch category", error);
      }
    };

    async function fetchComments(postId) {
      try {
        const response = await fetch(
          `http://localhost:8000/comments/post/${postId}`
        );
        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        console.error("Failed to fetch comments", error);
      }
    }

    fetchPost();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment) return;

    try {
      const response = await fetch(
        `http://localhost:8000/comments/post/${postId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ post_id: postId, content: comment }),
        }
      );

      if (response.ok) {
        const newComment = await response.json();
        setComments((prevComments) => [...prevComments, newComment]);
        setComment("");
      } else {
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment", error);
    }
  };

  const handleReply = async (commentId, replyText) => {
    try {
      const response = await fetch(
        `http://localhost:8000/comments/${commentId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            post_id: postId,
            comment_id: commentId,
            user_id: userId,
            content: replyText,
          }),
        }
      );

      if (response.ok) {
        const newReply = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, replies: [...(comment.replies || []), newReply] }
              : comment
          )
        );
      } else {
        console.error("Failed to submit reply");
      }
    } catch (error) {
      console.error("Failed to submit reply", error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <main className="container mx-auto my-8">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
          {/* Post content */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {post.title}
          </h1>
          <p>{post.content}</p>

          {/* Comments Section */}
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Comments</h2>
          <div>
            {comments.length === 0 ? (
              <p className="text-gray-500">No comments yet.</p>
            ) : (
              <ul className="mb-4">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    userId={userId}
                  />
                ))}
              </ul>
            )}
          </div>

          {/* Comment Input */}
          {isLoggedIn && (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <textarea
                className="border rounded w-full p-2 mb-2"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Comment
              </button>
            </form>
          )}

          <button
            onClick={onBack}
            className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
