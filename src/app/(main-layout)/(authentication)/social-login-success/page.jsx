/* import Link from "next/link";

export default function SocialLoginSuccess({ searchParams }) {
  const token = searchParams?.token;
console.log(token)
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
} */
"use client"

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAlert } from '@/hooks/useAlert';
import { parseJwt, useAuth } from '@/contexts/AuthContext';

function SocialLoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showSuccess, showError, closeAlert } = useAlert();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleSocialLogin = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (!token && !error) {
        // No token or error, redirect to login
        router.replace('/login');
        return;
      }

      if (error) {
        // Handle error case
        showError(decodeURIComponent(error), {
          title: 'Authentication Failed',
        });
        setTimeout(() => router.replace('/login'), 2000);
        return;
      }

      try {
        // Save token to localStorage (same as credentials login)
        localStorage.setItem('token', token);
        
        // Decode JWT and set user in context (same as credentials login)
        const decoded = parseJwt(token);
        setUser(decoded);

        // Close any existing alerts
        closeAlert();

        // Show success message (same as credentials login)
        await showSuccess("Login successful", {
          title: "Welcome Back",
        });

        // Redirect to home page
        router.replace('/');
      } catch (error) {
        console.error('Social login error:', error);
        
        // Clear invalid token
        localStorage.removeItem('token');
        
        closeAlert();
        showError('Something went wrong. Please try again', {
          title: 'Connection Error',
        });
        
        setTimeout(() => router.replace('/login'), 2000);
      }
    };

    handleSocialLogin();
  }, [searchParams, router]);

  return (
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
  );
}

export default function SocialLoginSuccessPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 min-w-[300px]">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    }>
      <SocialLoginSuccessContent />
    </Suspense>
  );
}
