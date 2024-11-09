"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function Header() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    setUsername(window.localStorage.getItem("username") || "");
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("token_type");
      window.localStorage.removeItem("username");
      window.localStorage.removeItem("user_id");
      setUsername(""); // Update state to reflect the logout
      window.location.href = "/"; // Redirect to home or login page
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="text-xl font-bold">
          <Link href="/" className="text-blue-500">
            LOGO
          </Link>
        </div>
        <div className="space-x-4">
          {username ? (
            <>
              <span className="text-gray-700">Welcome, {username}</span>
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-500 hover:text-white"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
