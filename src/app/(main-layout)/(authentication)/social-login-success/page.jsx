"use client"
import { useSearchParams } from "next/navigation";

export default function SocialLoginSuccess() {
  const params = useSearchParams();
  const token = params.get("token");

  if (token) localStorage.setItem("token", token);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
        <h1>Login Successful!</h1>
    </div>
  );
}
