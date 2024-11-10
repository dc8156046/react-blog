"use client";
import Header from "../../header";
import Footer from "../../footer";
import Side from "../../side";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styling

export default function Page() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch categories and tags
  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesResponse = await fetch(`${apiBaseUrl}/categories`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);

        const tagsResponse = await fetch(`${apiBaseUrl}/tags`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        const tagsData = await tagsResponse.json();
        setTags(tagsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, []);

  const handleTagSelection = (tagId) => {
    if (!selectedTags.includes(tagId)) {
      setSelectedTags([...selectedTags, tagId]);
    } else {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.find((tag) => tag.name === newTag)) {
      addTag();
    }
  };
  const addTag = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/tags`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newTag }),
      });
      if (!response.ok) {
        throw new Error("Failed to add tag");
      }
      const data = await response.json();
      console.log("Tag added:", data);

      setTags([...tags, data]);
      setNewTag("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleRemoveTag = (tagId) => {
    removeTag(tagId);
  };

  const removeTag = async (tagId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/tags/${tagId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to remove tag");
      }
      const data = await response.json();
      console.log("Tag removed:", data);
      setTags(tags.filter((tag) => tag.id !== tagId));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImageUrls = await Promise.all(files.map(uploadImage)); // Assume `uploadImage` uploads files and returns URLs
    setImages([...images, ...uploadedImageUrls]);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(`${apiBaseUrl}/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.imageUrl; // Assuming the server responds with an image URL
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleChange = (value) => {
    setContent(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      content,
      category_id: categoryId,
      is_published: isPublished,
      slug,
      tags: selectedTags,
    };
    console.log("New post:", newPost);

    try {
      const response = await fetch(`${apiBaseUrl}/posts/my`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || "Invalid credentials"}`);
          if (typeof window !== "undefined") {
            window.localStorage.removeItem("access_token");
            window.localStorage.removeItem("token_type");
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("user_id");
            window.location.href = "/login";
            return;
          }
        }
        throw new Error("Failed to add post");
      }

      const data = await response.json();
      console.log("Post added:", data);
      // Reset form
      setTitle("");
      setContent("");
      setCategoryId(0);
      setIsPublished(false);
      setSlug("");
      setSelectedTags([]);
      setImages([]);
      alert("Post added successfully");
      window.location.href = "/posts";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleTitleChange = (e) => {
    const titleValue = e.target.value;
    setTitle(titleValue);

    // Generate the slug by replacing spaces with hyphens and converting to lowercase
    const generatedSlug = titleValue.trim().toLowerCase().replace(/\s+/g, "-");
    setSlug(generatedSlug);
  };
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Side />
        <main className="flex-1 p-10">
          <div className="p-4 max-w-2xl mx-auto bg-white shadow rounded">
            <h1 className="text-2xl font-bold mb-6">Add New Post</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={handleTitleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleChange}
                  className="mb-4"
                  placeholder="Start typing here..."
                  modules={{
                    toolbar: [
                      [{ header: "1" }, { header: "2" }, { font: [] }],
                      [{ size: [] }],
                      ["bold", "italic", "underline", "strike", "blockquote"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      ["link", "image"],
                      [{ align: [] }],
                      ["clean"],
                    ],
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700"
                >
                  Slug
                </label>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  readOnly
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => setCategoryId(parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="px-4 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add Tag
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => handleTagSelection(tag.id)}
                      />
                      <span>{tag.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag.id)}
                        className="text-red-500"
                      >
                        x
                      </button>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Images
                </label>
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt="Uploaded"
                      className="w-16 h-16 object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                  />
                  <span>Publish this post</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
              >
                Add Post
              </button>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
