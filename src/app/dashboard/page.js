"use client";

import { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  BookOpen,
  TrendingUp,
  GraduationCap,
  Award,
  Calendar,
  Filter,
  Download,
  Loader2,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  // Filters
  const [dateRange, setDateRange] = useState("all"); // all, today, week, month, year
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange, selectedCourse]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Fetch overview stats
      const statsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/stats?dateRange=${dateRange}&courseId=${selectedCourse}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const statsData = await statsRes.json();

      if (statsData.success) {
        setStats(statsData.data);
      }

      // Fetch recent enrollments
      const enrollmentsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/recent-enrollments?limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const enrollmentsData = await enrollmentsRes.json();

      if (enrollmentsData.success) {
        setRecentEnrollments(enrollmentsData.data);
      }

      // Fetch top courses
      const topCoursesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/top-courses?limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const topCoursesData = await topCoursesRes.json();

      if (topCoursesData.success) {
        setTopCourses(topCoursesData.data);
      }

      // Fetch all courses for filter
      const coursesRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/courses?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const coursesData = await coursesRes.json();

      if (coursesData.success) {
        setCourses(coursesData.data);
      }

      // Fetch revenue chart data
      const revenueRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/revenue-chart?dateRange=${dateRange}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const revenueChartData = await revenueRes.json();
      console.log(revenueChartData)

      if (revenueChartData.success) {
        setRevenueData(revenueChartData.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-600 dark:text-green-400";
    if (change < 0) return "text-red-600 dark:text-red-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const exportData = () => {
    // Implement CSV export logic
    alert("Exporting dashboard data...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === "admin") {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your platform&apos;s performance and analytics
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Courses</option>
              {courses.map((course) => (
                <option key={course._id || course.id} value={course._id || course.id}>
                  {course.title}
                </option>
              ))}
            </select>

            <button
              onClick={exportData}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              {stats?.revenueChange && (
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {stats.revenueChange > 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {Math.abs(stats.revenueChange)}%
                </div>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(stats?.totalRevenue || 0)}
            </div>
            <div className="text-white/80 text-sm">Total Revenue</div>
          </div>

          {/* Total Students */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="w-6 h-6" />
              </div>
              {stats?.studentsChange && (
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {stats.studentsChange > 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {Math.abs(stats.studentsChange)}%
                </div>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats?.totalStudents?.toLocaleString() || 0}
            </div>
            <div className="text-white/80 text-sm">Total Students</div>
          </div>

          {/* Total Courses */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              {stats?.coursesChange && (
                <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-lg">
                  {stats.coursesChange > 0 ? (
                    <ArrowUp className="w-4 h-4" />
                  ) : (
                    <ArrowDown className="w-4 h-4" />
                  )}
                  {Math.abs(stats.coursesChange)}%
                </div>
              )}
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats?.totalCourses?.toLocaleString() || 0}
            </div>
            <div className="text-white/80 text-sm">Active Courses</div>
          </div>

          {/* Total Instructors */}
          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {stats?.totalInstructors?.toLocaleString() || 0}
            </div>
            <div className="text-white/80 text-sm">Instructors</div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.totalEnrollments?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total Enrollments
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats?.avgCourseCompletion || 0}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Avg Completion Rate
                </div>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats?.avgRevenuePerStudent || 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Revenue Per Student
                </div>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Revenue Trend
            </h3>
            <div className="space-y-4">
              {revenueData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.label}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                      style={{
                        width: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Top Performing Courses
              </h3>
              <Link
                href="/dashboard/courses"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div
                  key={course._id || index}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 dark:text-white truncate">
                      {course.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {course.enrollments} enrollments • {formatCurrency(course.revenue)}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {course.completionRate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Enrollments
            </h3>
            <Link
              href="/dashboard/enrollments"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Course
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((enrollment, index) => (
                  <tr
                    key={enrollment._id || index}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {enrollment?.user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {enrollment.user.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {enrollment.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {enrollment.course.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(enrollment.payment.amount)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        enrollment.enrollmentStatus === "active"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : enrollment.enrollmentStatus === "completed"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400"
                      }`}>
                        {enrollment.enrollmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your learning journey
        </p>
      </div>

      {/* Student Stats - Redirect to My Courses */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Your Learning Dashboard</h2>
        <p className="mb-6 text-white/90">
          Track your progress, access your courses, and continue learning.
        </p>
        <Link
          href="/dashboard/my-courses"
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          Go to My Courses
        </Link>
      </div>
    </div>
  );
}