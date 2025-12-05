"use client"
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import React, { useState } from 'react';

const DashboardLayout = ({children}) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {user} = useAuth();

    const dashboardLinks = {
        adminLinks: (
            <>
            <Link href={"/"}>Courses</Link>
            <Link href={"/"}>Add Course</Link>
            <Link href={"/"}>Manage Courses</Link>
            <Link href={"/"}>Manage users</Link>
            </>
        ),
        userLinks: (
            <>
            <Link href={"/"}>My Courses</Link>
            </>
        )
    }

    const renderedLinks = 
    user && user.role === "admin" ?
    dashboardLinks.adminLinks :
    dashboardLinks.userLinks

    const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // optional redirect to homepage
  };

    return (
        <div>
            <div className="bg-gray-50 dark:bg-black">
      {/* ---- Topbar / Mobile Nav ---- */}
      <header className=" lg:hidden fixed top-0 w-full z-50 bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)] shadow-md">
        <div className="flex justify-between items-center p-4 h-[100px] ">
          <Link href={"/"}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
              Course Master
            </h1>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-color focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* mobile menu horizontal */}
        {menuOpen && (
          <nav className="flex flex-col relative gap-2 px-4 pt-4 pb-8">
            {renderedLinks}
            {/* Mobile Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="hidden mt-4 sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 border border-red-200 dark:border-red-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            )}
          </nav>
        )}
      </header>

      {/* ---- Sidebar for large screen ---- */}
      <aside
        className="hidden lg:block fixed top-0 left-0 z-50 w-[350px]
                          bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]
                          p-6 lg:p-8 h-screen shadow-md"
      >
        <Link href={"/"}>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 cursor-pointer">
            Course Master
          </h1>
        </Link>
        <nav className="space-y-3 flex flex-col mt-6">
            {renderedLinks}
        </nav>


        {user && (
          <button
            onClick={handleLogout}
            className="hidden w-full mt-4 sm:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/40 dark:hover:to-pink-900/40 border border-red-200 dark:border-red-800 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        )}
      </aside>

      {/* ---- Main content ---- */}
      <main className="pt-[100px] lg:pt-0 lg:ml-[350px] min-h-screen">
        {children}
      </main>

    </div>    
        </div>
    );
};

export default DashboardLayout;