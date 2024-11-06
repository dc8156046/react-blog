"use client";
import { useState, useEffect } from "react";

export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    setUsername(""); // Update state to reflect the logout
    window.location.href = "/"; // Redirect to home or login page
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <a href="/" className="text-blue-500">
            LOGO
          </a>
        </div>
        <div className="space-x-4">
          {username ? (
            <>
              <span className="text-gray-700">Welcome, {username}</span>
              <a
                href="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign Up
              </a>
              <a
                href="/login"
                className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
              >
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
