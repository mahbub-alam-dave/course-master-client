"use client"
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const router = useRouter();

  const handleSocialLogin = (providerName) => {
    console.log("social login", providerName);
    // callbackUrl off
    signIn(providerName, { redirect: false });
  };


  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <div
        onClick={() => router.push(`${NEXT_PUBLIC_API}/api/auth/github`)}
        className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer"
      >
        <FaGithub size={22} />
      </div>
      <div
        onClick={() => router.push(`${NEXT_PUBLIC_API}/api/auth/google`)}
        className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer"
      >
        <FcGoogle size={22} />
      </div>
    </div>
  );
};

export default SocialLogin;
