"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
export default function Side() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    // Set the current path when the component mounts
    setCurrentPath(window.location.pathname);
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Categories", path: "/category" },
    { name: "Posts", path: "/posts" },
  ];
  return (
    <aside className="bg-gray-200 text-black w-64 p-6 space-y-6">
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.path}
                className={`block py-2 px-4 rounded hover:bg-gray-700 hover:text-white ${
                  currentPath.startsWith(item.path)
                    ? "bg-gray-700 text-white"
                    : ""
                }`}
                onClick={() => setCurrentPath(item.path)} // Update the current path on click
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
