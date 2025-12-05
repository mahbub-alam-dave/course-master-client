"use client";

import Link from "next/link";
import { useState } from "react";

export default function MobileSidebar({ user, handleLogout, isOpen, setIsOpen }) {
/*   const [isOpen, setIsOpen] = useState(false); */

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger Icon */}
      {/* <div className="lg:hidden">
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost p-2 focus:outline-none"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div> */}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[9999] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col p-4 gap-3">
          <Link href="/" onClick={toggleSidebar} className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/courses" onClick={toggleSidebar} className="hover:text-blue-600">
            Courses
          </Link>
          {user && (
            <Link href="/dashboard" onClick={toggleSidebar} className="hover:text-blue-600">
              Dashboard
            </Link>
          )}

          {user ? (
            <button
              onClick={() => {
                handleLogout();
                toggleSidebar();
              }}
              className="bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" onClick={toggleSidebar}>
              <button className="bg-blue-600 text-white py-2 rounded-lg mt-4 hover:bg-blue-700 transition">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </>
  );
}
