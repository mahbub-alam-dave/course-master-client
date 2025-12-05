"use client";
import React, { useState } from "react";
import Link from "next/link";
import SocialLogin from "./SocialLogin";
import { useRouter } from "next/navigation";
import { useAlert } from "@/hooks/useAlert";
import { parseJwt, useAuth } from "@/contexts/AuthContext";



const LoginForm = () => {
const [loading, setLoading] = useState(false)
const [error, setError] = useState("");
const router = useRouter()
const { showSuccess, showError, showLoading, closeAlert } = useAlert();
const {setUser, login} = useAuth()



  
const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");



    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (res.ok && data.token) {
        // Save JWT token
        localStorage.setItem("token", data.token);
        // login(data.token)
        const decoded =parseJwt(data.token)
        setUser(decoded)

        closeAlert()
        await showSuccess("Login successful", {
          title: "Welcome Back",
        })
        router.push("/")
      } else {
        closeAlert();
        showError(data.message || "login failed", {
          title: "login failed"
        })
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      closeAlert();

      showError("Something went wrong. Please try again", {
        title: "Connection Error"
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* ✅ Full Screen Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Logging you in...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Please wait while we authenticate your account
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="input-style w-full mt-2"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="input-style w-full mt-2"
            placeholder="Enter password (6 characters)"
            disabled={loading}
          />
        </div>

        <p className="text-red-600">{error}</p>

        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 cursor-pointer rounded-full mt-4 w-full font-medium text-lg ${loading
              ? "bg-gray-400 cursor-not-allowed text-gray-200"
              : "bg-[var(--color-primary)] text-gray-100"
            }`}
        >
          Login
        </button>

        <span className="mt-6 text-center">Or Sign Up with</span>
        <SocialLogin />
        <span className="text-center">
          Don&apos;t have an account?{" "}
          <Link
            href={"/register"}
            className="text-[var(--color-primary)]"
          >
            register
          </Link>
        </span>
      </form>

    </div>
  );
};

export default LoginForm;