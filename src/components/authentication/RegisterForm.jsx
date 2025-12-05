"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/useAlert";
import { parseJwt, useAuth } from "@/contexts/AuthContext";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const { showSuccess, showError, showLoading, closeAlert } = useAlert();
  const {setUser} = useAuth()

const handleRegisterForm = async (e) => {
  e.preventDefault();
  setLoading(true);

  const form = new FormData(e.target);
  const name = form.get("name");
  const email = form.get("email");
  const password = form.get("password");


  try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();

  if (res.ok && data.token) {
    // Save JWT token
        localStorage.setItem("token", data.token);
        const decoded = parseJwt(data.token)
        setUser(decoded)

        closeAlert()
        await showSuccess("Registration successful", {
          title: "Congratulations",
        })
    router.push("/")
  } else {
    closeAlert();
        showError(data.message || "Registration failed", {
          title: "Registration failed"
        })
  }
  } catch (error) {
    console.log(error)
    closeAlert();
    showError("Something went wrong. Please try again", {
        title: "Connection Error"
      });
  } finally {
    setLoading(false)
  }

};

  return (
    <div>
      {/* Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Creating your account...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Please wait while we register your account
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleRegisterForm} className="flex flex-col gap-4">
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            className="input-style w-full mt-2"
            placeholder="Enter name"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            className="input-style w-full mt-2"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            className="input-style w-full mt-2"
            placeholder="Enter password (6 characters)"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 cursor-pointer rounded-full mt-4 w-full font-medium text-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-[var(--color-primary)] text-gray-100 "
          }`}
        >
          {loading ? "loading..." : "Register"}
        </button>
        <span className="mt-6 text-center">Or Sign Up with</span>
        <SocialLogin />
        <span className="text-center">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
          >
            Login
          </Link>
        </span>
      </form>

    </div>
  );
};

export default RegisterForm;
