"use client";
import Header from "../header";
import Footer from "../footer";
import Side from "../side";
import { useState, useEffect } from "react";

export default function Page() {
  const [categories, setCategories] = useState([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      if (!res.ok) {
        if (res.status === 401) {
          const errorData = await res.json();
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

        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [newCategoryParentId, setNewCategoryParentId] = useState(0);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isAscending, setIsAscending] = useState(true);

  const addCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) {
      alert("Please fill in all fields.");
      return;
    }
    const newCategory = {
      name: newCategoryName,
      description: newCategoryDescription,
      parent_id: newCategoryParentId,
    };
    try {
      const res = await fetch(`${apiBaseUrl}/categories`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? window.localStorage.getItem("access_token")
              : ""
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
      if (!res.ok) {
        if (res.status === 409) {
          const errorData = await res.json();
          alert(`Error: ${errorData.detail || "Conflict error"}`);
          return;
        }
        if (res.status === 401) {
          const errorData = await res.json();
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
        if (res.status === 400) {
          const errorData = await res.json();
          alert(`Error: ${errorData.detail || "Bad request"}`);
          return;
        }
        if (res.status === 422) {
          const errorData = await res.json();
          alert(`Error: ${errorData.detail || "Unprocessable entity"}`);
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const addedCategory = await res.json();
      setCategories([...categories, addedCategory]);
      resetForm();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category.id);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
    setNewCategoryParentId(category.parent_id);
  };

  const updateCategory = async () => {
    if (!newCategoryName || !newCategoryDescription) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedCategory = {
      name: newCategoryName,
      parent_id: newCategoryParentId,
      description: newCategoryDescription,
    };

    try {
      const response = await fetch(
        `${apiBaseUrl}/categories/${editingCategoryId}`,
        {
          method: "PUT", // Use PUT to update the category
          headers: {
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? window.localStorage.getItem("access_token")
                : ""
            }`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || "Invalid credentials"}`);
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("token_type");
            localStorage.removeItem("username");
            localStorage.removeItem("user_id");
            window.location.href = "/login";
            return;
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(
        categories.map((cat) => (cat.id === editingCategoryId ? data : cat))
      );
      resetForm();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const deleteCategory = (id) => {
    // Logic to delete the category with the given id
    try {
      fetch(`${apiBaseUrl}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? window.localStorage.getItem("access_token")
              : ""
          }`,
        },
      });
    } catch (error) {
      console.error("Error:", error);
    }

    setCategories(categories.filter((category) => category.id !== id));
  };

  const resetForm = () => {
    setEditingCategoryId(null);
    setNewCategoryName("");
    setNewCategoryDescription("");
    setNewCategoryParentId(0);
  };

  const sortCategoriesById = () => {
    const sortedCategories = [...categories].sort((a, b) =>
      isAscending ? a.id - b.id : b.id - a.id
    );
    setCategories(sortedCategories);
    setIsAscending(!isAscending); // Toggle sort order
  };

  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <Side />
        <main className="flex-1 p-10">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Categories</h1>
            <div className="mb-4 flex space-x-4">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Category Name"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <input
                type="text"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Description"
                className="border border-gray-300 rounded-md p-2 w-full"
              />
              <select
                value={newCategoryParentId}
                onChange={(e) => setNewCategoryParentId(e.target.value)}
                className="border border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Select Parent</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={editingCategoryId ? updateCategory : addCategory}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editingCategoryId ? "Update Category" : "Add Category"}
              </button>
            </div>
            <table className="min-w-full bg-white border border-gray-300 rounded">
              <thead>
                <tr>
                  <th
                    className="py-2 px-4 border-b"
                    onClick={sortCategoriesById}
                  >
                    Category ID {isAscending ? "↑" : "↓"}
                  </th>
                  <th className="py-2 px-4 border-b">Category Name</th>
                  <th className="py-2 px-4 border-b">Description</th>
                  <th className="py-2 px-4 border-b">Parent ID</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No categories found
                    </td>
                  </tr>
                )}
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="py-2 px-4 border-b">{category.id}</td>
                    <td className="py-2 px-4 border-b">{category.name}</td>
                    <td className="py-2 px-4 border-b">
                      {category.description}
                    </td>
                    <td className="py-2 px-4 border-b">{category.parent_id}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => editCategory(category)}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-500 hover:underline ml-4"
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
