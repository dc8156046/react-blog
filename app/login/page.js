"use client";
import Header from "../header";
import Footer from "../footer";
import { useState } from "react";
import Link from "next/link";
export default function Page() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  const login = async () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    try {
      const res = await fetch(`${apiBaseUrl}/auth/token`, {
        method: "POST",
        headers: {},
        body: formData,
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
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("token_type", data.token_type);
      localStorage.setItem("username", data.username);
      localStorage.setItem("user_id", data.user_id);
      alert(`Login successful! Welcome, ${data.username || ""}`);
      window.location.href = "/";
      //console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-100 flex items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="name"
                id="username"
                name="username"
                required
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
