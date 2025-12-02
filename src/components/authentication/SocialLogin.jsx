"use client"
import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const SocialLogin = () => {
  const session = useSession();
  const router = useRouter();

  const handleSocialLogin = (providerName) => {
    console.log("social login", providerName);
    // callbackUrl off
    signIn(providerName, { redirect: false });
  };

  useEffect(() => {
    const checkReferral = async (email) => {
      try {
        const res = await fetch("/api/referralCheck", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.referred) {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: "You are a referred user!",
            showConfirmButton: true,
          });
        } else {
          await Swal.fire({
            position: "center",
            icon: "success",
            title: "Logged in successfully",
            showConfirmButton: false,
            timer: 1500,
          });
        }

        // after alert  redirect
        router.push("/");
      } catch (err) {
        console.error("Referral check error:", err);
      }
    };

    if (session.status === "authenticated" && session.data?.user?.email) {
      const email = session.data.user.email;
      checkReferral(email);
    }
  }, [session.status]);

  return (
    <div className="flex justify-center items-center gap-4 mb-6">
      <div
        onClick={() => handleSocialLogin("github")}
        className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer"
      >
        <FaGithub size={22} />
      </div>
      <div
        onClick={() => handleSocialLogin("google")}
        className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-700 rounded-full flex justify-center items-center cursor-pointer"
      >
        <FcGoogle size={22} />
      </div>
    </div>
  );
};

export default SocialLogin;
