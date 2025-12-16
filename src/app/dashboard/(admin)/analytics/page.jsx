"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  Award,
  Target,
  Star,
  ChevronDown,
  Loader2,
  BarChart3,
  PieChart,
  Calendar
} from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchCourseAnalytics(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/courses?limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setCourses(data.data);
        setSelectedCourse(data.data[0]._id || data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseAnalytics = async (courseId) => {
    setAnalyticsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/admin/course-analytics/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error("Error fetching course analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "completed":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "dropped":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400";
    }
  };

  const selectedCourseData = courses.find(
    (c) => (c._id || c.id) === selectedCourse
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Course Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Deep dive into individual course performance metrics
          </p>
        </div>

        {/* Course Selector */}
        <div className="relative">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full lg:w-80 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
          >
            {courses.map((course) => (
              <option key={course._id || course.id} value={course._id || course.id}>
                {course.title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {analyticsLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      ) : analytics ? (
        <>
          {/* Course Info Card */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {selectedCourseData?.title}
                </h2>
                <p className="text-white/90 mb-4">
                  {selectedCourseData?.shortDescription}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{selectedCourseData?.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    <span>{selectedCourseData?.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedCourseData?.duration}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {formatCurrency(selectedCourseData?.price || 0)}
                </div>
                {selectedCourseData?.discountPrice && (
                  <div className="text-sm line-through opacity-75">
                    {formatCurrency(selectedCourseData.discountPrice)}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Enrollments */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.totalEnrollments?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Enrollments
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {formatCurrency(analytics.totalRevenue || 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Revenue
              </div>
            </div>

            {/* Average Completion */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {analytics.avgCompletion || 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Completion Rate
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                {analytics.avgRating || 0}
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {analytics.totalReviews || 0} Reviews
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Enrollment Status Breakdown */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Enrollment Status
                </h3>
              </div>

              <div className="space-y-4">
                {analytics.statusBreakdown?.map((status, index) => {
                  const percentage = Math.round(
                    (status.count / analytics.totalEnrollments) * 100
                  );
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status._id)}`}>
                          {status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {status.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Performance Metrics
                </h3>
              </div>

              <div className="space-y-6">
                {/* Revenue per Enrollment */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Revenue per Enrollment
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        analytics.totalEnrollments > 0
                          ? analytics.totalRevenue / analytics.totalEnrollments
                          : 0
                      )}
                    </span>
                  </div>
                </div>

                {/* Completion Rate Status */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Completion Rate Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        analytics.avgCompletion >= 75
                          ? "bg-green-100 text-green-700"
                          : analytics.avgCompletion >= 50
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {analytics.avgCompletion >= 75
                        ? "Excellent"
                        : analytics.avgCompletion >= 50
                        ? "Good"
                        : "Needs Improvement"}
                    </span>
                  </div>
                </div>

                {/* Student Satisfaction */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Student Satisfaction
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(analytics.avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-gray-900 dark:text-white">
                        {analytics.avgRating}/5.0
                      </span>
                    </div>
                  </div>
                </div>

                {/* Certificate Issued */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Certificates Issued
                    </span>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-yellow-600" />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {analytics.statusBreakdown?.find((s) => s._id === "completed")
                          ?.count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-indigo-600" />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Course Performance
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {analytics.avgCompletion >= 70 && analytics.avgRating >= 4.5
                    ? "🎯 Excellent - Top Performer"
                    : analytics.avgCompletion >= 50
                    ? "✅ Good - Meeting Expectations"
                    : "⚠️ Needs Attention"}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Revenue Potential
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {analytics.totalRevenue > 10000
                    ? "💰 High Revenue Generator"
                    : analytics.totalRevenue > 5000
                    ? "💵 Steady Performer"
                    : "🌱 Growing Course"}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          No analytics data available
        </div>
      )}
    </div>
  );
}