import Link from "next/link";

// app/social-login-success/page.jsx
export default function SocialLoginSuccess({ searchParams }) {
  const token = searchParams?.token;

  if (typeof window !== "undefined" && token) {
    localStorage.setItem("token", token);
  }

  return (
    <div className="flex justify-center items-center min-h-[60vh] flex-col gap-4">
      <h1>Login Successful!</h1>
      <Link href="/">
        <button className="px-6 py-3 bg-[var(--color-primay)] rounded">
          Go to homepage
        </button>
      </Link>
    </div>
  );
}

