import Link from "next/link";
import { Star, Clock, BookOpen, TrendingUp } from "lucide-react";

export default function CourseCard({ course }) {
  const courseId = course._id;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {/* Course Thumbnail */}
      <div className="relative h-62 bg-gray-200">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <BookOpen className="w-16 h-16 text-white" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {course.isBestseller && (
            <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Bestseller
            </span>
          )}
          {course.isNew && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
              New
            </span>
          )}
        </div>
      </div>

      {/* Course Info */}
      <div className="p-5">
        {/* Category & Level */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {course.category}
          </span>
          <span className="text-xs text-gray-500">{course.level}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">
          By {course.instructor?.name || "Unknown Instructor"}
        </p>

        {/* Rating & Enrollment */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{course.rating || 0}</span>
            <span className="text-gray-500">
              ({course.reviewCount || 0})
            </span>
          </div>
          <span className="text-gray-500">
            {course.enrollmentCount?.toLocaleString() || 0} students
          </span>
        </div>

        {/* Duration & Lectures */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{course.totalLectures || 0} lectures</span>
          </div>
        </div>

        {/* Price & Button */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
          <div>
            {course.discountPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-800">
                  ${course.discountPrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${course.price}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-800">
                ${course.price}
              </span>
            )}
          </div>
          
          <Link
            href={`http://localhost:3000/courses/${courseId}`}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}