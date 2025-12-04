"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CourseCard from "@/components/CourseCard";
import Pagination from "@/components/Pagination";
import { Search, Filter } from "lucide-react";

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // Filters
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [level, setLevel] = useState(searchParams.get("level") || "");
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchCourses();
  }, [currentPage, category, level]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(category && { category }),
        ...(level && { level }),
        ...(search && { search })
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/courses?${queryParams}`
      );
      const data = await res.json();

      if (data.success) {
        setCourses(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateURL({ search, page: 1 });
    fetchCourses();
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === "category") {
      setCategory(value);
      updateURL({ category: value, page: 1 });
    } else if (filterType === "level") {
      setLevel(value);
      updateURL({ level: value, page: 1 });
    }
  };

  const handlePageChange = (page) => {
    updateURL({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateURL = (params) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        newSearchParams.set(key, params[key]);
      } else {
        newSearchParams.delete(key);
      }
    });

    router.push(`/courses?${newSearchParams.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLevel("");
    router.push("/courses");
    setTimeout(fetchCourses, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">All Courses</h1>
          <p className="text-lg opacity-90">
            Explore {pagination.totalCourses || 0} courses to boost your skills
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex flex-wrap gap-4 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            
            <select
              value={category}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Design">Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Marketing">Marketing</option>
            </select>

            <select
              value={level}
              onChange={(e) => handleFilterChange("level", e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            {(category || level || search) && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No courses found</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {courses.map((course) => (
                <CourseCard key={course._id || course.id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}