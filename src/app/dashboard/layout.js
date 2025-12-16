"use client";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  Settings,
  Users,
  Award,
  LogOut,
  Menu,
  X,
  TrendingUp,
  GraduationCap
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const adminLinks = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Overview",
      description: "Dashboard analytics"
    },
    {
      href: "/dashboard/courses",
      icon: BookOpen,
      label: "All Courses",
      description: "View all courses"
    },
    {
      href: "/dashboard/add-course",
      icon: PlusCircle,
      label: "Add Course",
      description: "Create new course"
    },
    {
      href: "/dashboard/manage-courses",
      icon: Settings,
      label: "Manage Courses",
      description: "Edit & delete courses"
    },
    {
      href: "/dashboard/manage-users",
      icon: Users,
      label: "Manage Users",
      description: "User management"
    },
    {
      href: "/dashboard/analytics",
      icon: TrendingUp,
      label: "Analytics",
      description: "Revenue & insights"
    }
  ];

  const userLinks = [
    {
      href: "/dashboard",
      icon: LayoutDashboard,
      label: "Overview",
      description: "Your learning dashboard"
    },
    {
      href: "/dashboard/user/my-courses",
      icon: BookOpen,
      label: "My Courses",
      description: "Enrolled courses"
    },
    {
      href: "/dashboard/certificates",
      icon: Award,
      label: "Certificates",
      description: "Your achievements"
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
      description: "Account settings"
    }
  ];

  const links = user && user.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const isActive = (href) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center p-4">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CourseMaster
              </h1>
            </div>
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4 space-y-2">
              {links.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      active
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <div>
                      <div className="font-semibold text-sm">{link.label}</div>
                      <div className={`text-xs ${active ? "text-white/80" : "text-gray-500"}`}>
                        {link.description}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {user && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 mt-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-200 dark:border-red-800"
                >
                  <LogOut className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-semibold text-sm">Logout</div>
                    <div className="text-xs text-red-500">Sign out of account</div>
                  </div>
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-50 w-80 h-screen flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-800 shadow-xl">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                <GraduationCap className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CourseMaster
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.role === "admin" ? "Admin Dashboard" : "Learning Platform"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* User Info */}
        {user && (
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
                <div className="mt-1">
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  }`}>
                    {user.role === "admin" ? "Administrator" : "Student"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all group ${
                  active
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  active
                    ? "bg-white/20"
                    : "bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{link.label}</div>
                  <div className={`text-xs ${
                    active ? "text-white/80" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {link.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        {user && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-200 dark:border-red-800 group"
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40 group-hover:bg-red-200 dark:group-hover:bg-red-800/50">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold">Logout</div>
                <div className="text-xs text-red-500 dark:text-red-400">
                  Sign out of account
                </div>
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="pt-20 lg:pt-0 lg:ml-80 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;