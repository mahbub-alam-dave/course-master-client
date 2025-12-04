"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Star,
  Clock,
  BookOpen,
  Award,
  Users,
  CheckCircle,
  PlayCircle,
  Download,
  FileText,
  Code,
  Globe,
  TrendingUp
} from "lucide-react";

const CourseDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
    if (params.courseId) {
      fetchCourseDetails();
      checkEnrollmentStatus()
    }
  }, [params.courseId]);

  const fetchCourseDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/courses/${params.courseId}`
      );
      const data = await res.json();
      console.log(data.data)

      if (data.success) {
        setCourse(data.data);
      }  else {
        router.push("/courses");
      } 
    } catch (error) {
      console.error("Error fetching course details:", error);
      router.push("/courses");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Check if user is already enrolled
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/enrollments/check/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success && data.isEnrolled) {
        setIsEnrolled(true);
      }
    } catch (error) {
      console.error("Error checking enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      // TODO: Implement enrollment logic
      // This would typically call an API endpoint to enroll the user
      console.log("Enrolling in course:", course._id || course.id);
      
      // Simulated enrollment
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert("Successfully enrolled in the course!");
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

    const handleEnrollClick = () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to enroll in this course");
      router.push("/login");
      return;
    }

    setShowPaymentModal(true);
  };

    const handlePaymentSuccess = (paymentData) => {
    setIsEnrolled(true);
    alert("Successfully enrolled! Welcome to the course.");
    router.push("/dashboard/my-courses");
  };

  const handleAccessCourse = () => {
    router.push(`/learn/${params.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-8 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {course.isBestseller && (
                <span className="px-3 py-1 bg-yellow-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Bestseller
                </span>
              )}
              {course.isNew && (
                <span className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                  New
                </span>
              )}
              <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full">
                {course.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
            <p className="text-xl opacity-90 mb-6">{course.shortDescription}</p>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{course.rating}</span>
                <span className="opacity-80">
                  ({course.reviewCount?.toLocaleString()} reviews)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>{course.enrollmentCount?.toLocaleString()} students</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>{course.language}</span>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                {course.instructor?.name?.charAt(0) || "I"}
              </div>
              <div>
                <p className="text-sm opacity-80">Created by</p>
                <p className="font-semibold">{course.instructor?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">What you&apos;ll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Course Content</h2>
              <div className="flex gap-6 text-sm text-gray-600 mb-6">
                <span>{course.sections?.length || 0} sections</span>
                <span>{course.totalLectures} lectures</span>
                <span>{course.duration} total length</span>
              </div>
              <div className="space-y-3">
                {course.sections?.map((section) => (
                  <div
                    key={section.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold">{section.title}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {section.lectures} lectures
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="space-y-2">
                {course.requirements?.map((req, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="text-blue-600 font-bold">•</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Instructor Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <div className="flex gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                  {course.instructor?.name?.charAt(0) || "I"}
                </div>
                <div>
                  <h3 className="text-xl font-bold">
                    {course.instructor?.name}
                  </h3>
                  <p className="text-gray-600">{course.instructor?.title}</p>
                </div>
              </div>
              <p className="text-gray-700">{course.instructor?.bio}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              {/* Preview Video/Image */}
              <div className="relative h-48 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="mb-6">
                {course.discountPrice ? (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-800">
                        ${course.discountPrice}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ${course.price}
                      </span>
                    </div>
                    <span className="text-sm text-red-600 font-semibold">
                      {Math.round(
                        ((course.price - course.discountPrice) / course.price) *
                          100
                      )}
                      % off
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-gray-800">
                    ${course.price}
                  </span>
                )}
              </div>

              {/* Enroll Button */}
              {isEnrolled ? (
                <button
                  onClick={handleAccessCourse}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors mb-4"
                >
                  Access Course
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors mb-4"
                >
                  Enroll Now
                </button>
              )}

              {/* Course Info */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span>Duration</span>
                  </div>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <BookOpen className="w-5 h-5" />
                    <span>Lectures</span>
                  </div>
                  <span className="font-semibold">{course.totalLectures}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Download className="w-5 h-5" />
                    <span>Resources</span>
                  </div>
                  <span className="font-semibold">
                    {course.resources?.downloadableResources || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FileText className="w-5 h-5" />
                    <span>Articles</span>
                  </div>
                  <span className="font-semibold">
                    {course.resources?.articles || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Code className="w-5 h-5" />
                    <span>Exercises</span>
                  </div>
                  <span className="font-semibold">
                    {course.resources?.codingExercises || 0}
                  </span>
                </div>
                {course.certificateOffered && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Award className="w-5 h-5" />
                      <span>Certificate</span>
                    </div>
                    <span className="font-semibold text-green-600">Yes</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span>Access</span>
                  </div>
                  <span className="font-semibold capitalize">
                    {course.accessType}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailsPage;