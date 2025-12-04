"use client"
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
   const [scrolled, setScrolled] = useState(false);

   const {user, setUser} = useAuth()

   console.log(user)

    useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



    const handleLogout = () => {
    localStorage.removeItem("token");
    
    window.location.href = "/"; // optional redirect to homepage
  };

  return (
    <div className="">
      {/* shadow-md shadow-gray-50 */}
    <div className={`w-full fixed top-0 z-[1000] border-b border-gray-50 ${scrolled ? "bg-blue-50/40 backdrop-blur-xl ": ""}`}>
    <div className="navbar max-w-[1600px] h-[100px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className={`navbar-start`}>
            <Image width={50} height={50} src={"https://i.ibb.co/h1X8n478/graduation-hat-1.png"} alt="Course Master" className={`${scrolled? "": ""}`} />
        <Link href={"/"} className={`pl-2 font-semibold text-xl md:text-2xl text-[var(--color-primary)] ${scrolled? "text-blue-600": ""}`}>Course Master</Link>
      </div>

      <div className="navbar-end">
        <ul className={` px-1 pr-6 hidden text-lg font-semibold lg:flex gap-6 ${scrolled? "" : "text-black"}`}>
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/courses"}>Courses</Link>
          </li>
          <li>
            <Link href={"/"}>About us</Link>
          </li>
          <li>
            <Link href={"/"}>Contact</Link>
          </li>
        </ul>
        {user? 
          <button onClick={handleLogout} className={`bg-[var(--color-primary)] px-6 py-3 rounded-3xl text-lg text-white font-semibold ${scrolled? "bg-blue-600": ""}`}>
                      logout
          </button>
        :
        <Link href={"/login"}>
                  <button className={`bg-[var(--color-primary)] px-6 py-3 rounded-3xl text-lg text-white font-semibold ${scrolled? "bg-blue-600": ""}`}>
                      login
                  </button>
        </Link>
      }
      </div>
      {/* sidebar */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {" "}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />{" "}
          </svg>
        </div>
        <ul
          tabIndex="-1"
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a>Item 1</a>
          </li>
          <li>
            <a>Parent</a>
            <ul className="p-2">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Item 3</a>
          </li>
        </ul>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Navbar;
