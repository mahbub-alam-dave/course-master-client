import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="navbar max-w-[1600px] mx-auto h-[100px] bg-base-100">
      <div className="navbar-start">
            <Image width={50} height={50} src={"https://i.ibb.co/h1X8n478/graduation-hat-1.png"} alt="Course Master" />
        <a className="btn btn-ghost text-xl md:text-2xl text-blue-500">Course Master</a>
      </div>

      <div className="navbar-end">
        <ul className="menu menu-horizontal px-1 pr-6 text-base">
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/"}>Courses</Link>
          </li>
          <li>
            <Link href={"/"}>About us</Link>
          </li>
          <li>
            <Link href={"/"}>Contact</Link>
          </li>
        </ul>
        <Link href={"/login"}>
                  <button className="bg-blue-500 px-6 py-3 rounded-3xl text-lg text-white font-semibold">
                      login
                  </button>
        </Link>
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
  );
};

export default Navbar;
