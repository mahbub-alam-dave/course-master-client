"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  PlayCircle,
  CheckCircle,
  Lock,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Download,
  Award,
  Loader2,
  BookOpen
} from "lucide-react";

export default function LearnCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLecture, setCurrentLecture] = useState({ sectionIndex: 0, lectureIndex: 0 });
  const [expandedSections, setExpandedSections] = useState([0]);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    if (params.courseId) {
      fetchCourseAndEnrollment();
    }
  }, [params.courseId]);

  const fetchCourseAndEnrollment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch course details
      const courseRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/courses/${params.courseId}`
      );
      const courseData = await courseRes.json();

      // Fetch enrollment data
      const enrollmentRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/enrollments/check/${params.courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const enrollmentData = await enrollmentRes.json();

      if (!enrollmentData.isEnrolled) {
        router.push(`/courses/${params.courseId}`);
        return;
      }

      if (courseData.success) {
        setCourse(courseData.data);
      }

      // Fetch detailed enrollment with progress
      const detailRes = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/enrollments/my-courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const detailData = await detailRes.json();
      
      if (detailData.success) {
        const currentEnrollment = detailData.data.find(
          (e) => e.course.courseId === params.courseId
        );
        setEnrollment(currentEnrollment);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsComplete = async () => {
    if (!enrollment) return;

    setUpdatingProgress(true);
    try {
      const token = localStorage.getItem("token");
      const section = course.sections[currentLecture.sectionIndex];
      const lectureId = `${section.id}-${currentLecture.lectureIndex}`;

      // Check if already completed
      const alreadyCompleted = enrollment.progress?.completedSections?.some(
        (s) => s.sectionId === lectureId
      );

      if (alreadyCompleted) {
        alert("This lecture is already marked as complete!");
        setUpdatingProgress(false);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/enrollments/progress/${enrollment._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completedLectures: (enrollment.progress?.completedLectures || 0) + 1,
            completedSections: {
              sectionId: lectureId,
            },
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        // Update local enrollment state
        setEnrollment(data.data);
        
        // Show success message
        alert("✅ Lecture marked as complete!");

        // Move to next lecture automatically
        moveToNextLecture();
      } else {
        alert(data.message || "Failed to update progress");
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Failed to update progress. Please try again.");
    } finally {
      setUpdatingProgress(false);
    }
  };

  const moveToNextLecture = () => {
    const currentSection = course.sections[currentLecture.sectionIndex];
    
    // Check if there's a next lecture in current section
    if (currentLecture.lectureIndex + 1 < currentSection.lectures) {
      setCurrentLecture({
        sectionIndex: currentLecture.sectionIndex,
        lectureIndex: currentLecture.lectureIndex + 1,
      });
    } 
    // Move to next section
    else if (currentLecture.sectionIndex + 1 < course.sections.length) {
      const nextSectionIndex = currentLecture.sectionIndex + 1;
      setCurrentLecture({
        sectionIndex: nextSectionIndex,
        lectureIndex: 0,
      });
      // Expand next section
      if (!expandedSections.includes(nextSectionIndex)) {
        setExpandedSections([...expandedSections, nextSectionIndex]);
      }
    }
  };

  const handleLectureClick = (sectionIndex, lectureIndex) => {
    setCurrentLecture({ sectionIndex, lectureIndex });
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const isLectureCompleted = (sectionId, lectureIndex) => {
    const lectureId = `${sectionId}-${lectureIndex}`;
    return enrollment?.progress?.completedSections?.some(
      (section) => section.sectionId === lectureId
    );
  };

  const getCurrentLectureTitle = () => {
    if (!course?.sections) return "Introduction";
    const section = course.sections[currentLecture.sectionIndex];
    return `${section.title} - Lecture ${currentLecture.lectureIndex + 1}`;
  };

  const getCurrentLectureNumber = () => {
    let lectureNumber = 1;
    for (let i = 0; i < currentLecture.sectionIndex; i++) {
      lectureNumber += course.sections[i].lectures;
    }
    lectureNumber += currentLecture.lectureIndex;
    return lectureNumber;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">Course not found</p>
      </div>
    );
  }

  const currentSection = course.sections?.[currentLecture.sectionIndex];
  const isCurrentLectureCompleted = isLectureCompleted(
    currentSection?.id,
    currentLecture.lectureIndex
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <button
            onClick={() => router.push("/dashboard/my-courses")}
            className="hover:text-blue-600 transition-colors"
          >
            My Courses
          </button>
          <span>/</span>
          <span>{course.title}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {course.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Video Player */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="relative aspect-video bg-black">
              {course.previewVideo ? (
                <video
                  controls
                  className="w-full h-full"
                  src={course.previewVideo}
                  key={`${currentLecture.sectionIndex}-${currentLecture.lectureIndex}`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <PlayCircle className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No video available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getCurrentLectureTitle()}
                </h2>
                <span className="text-sm text-gray-500">
                  Lecture {getCurrentLectureNumber()} of {course.totalLectures}
                </span>
              </div>

              {/* Completion Badge */}
              {isCurrentLectureCompleted && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-semibold">
                      ✅ You&apos;ve completed this lecture
                    </span>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    Course Progress
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {enrollment?.progress?.completedLectures || 0}/{course.totalLectures} lectures • {enrollment?.progress?.completionPercentage || 0}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{
                      width: `${enrollment?.progress?.completionPercentage || 0}%`,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleMarkAsComplete}
                  disabled={updatingProgress || isCurrentLectureCompleted}
                  className={`flex-1 px-4 py-2.5 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                    isCurrentLectureCompleted
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg"
                  }`}
                >
                  {updatingProgress ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : isCurrentLectureCompleted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Completed
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Mark as Complete
                    </>
                  )}
                </button>
                <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              About this course
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Resources */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Resources
            </h3>
            <div className="space-y-3">
              {course.resources?.downloadableResources > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Course Materials.pdf
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              )}
              {course.resources?.codingExercises > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      Code Examples.zip
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Download className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Course Content
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>{course.sections?.length || 0} sections</span>
                <span>{course.totalLectures} lectures</span>
                <span>{course.duration}</span>
              </div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {course.sections?.map((section, sectionIndex) => (
                <div
                  key={section.id}
                  className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {section.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {section.lectures} lectures
                        </div>
                      </div>
                    </div>
                    {expandedSections.includes(sectionIndex) ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Lectures List */}
                  {expandedSections.includes(sectionIndex) && (
                    <div className="bg-gray-50 dark:bg-gray-900/50">
                      {Array.from({ length: section.lectures }).map((_, lectureIndex) => {
                        const isCompleted = isLectureCompleted(section.id, lectureIndex);
                        const isCurrent = 
                          currentLecture.sectionIndex === sectionIndex &&
                          currentLecture.lectureIndex === lectureIndex;
                        
                        return (
                          <button
                            key={lectureIndex}
                            onClick={() => handleLectureClick(sectionIndex, lectureIndex)}
                            className={`w-full p-4 pl-16 flex items-center gap-3 transition-colors text-left group ${
                              isCurrent
                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            ) : (
                              <PlayCircle className={`w-5 h-5 flex-shrink-0 ${
                                isCurrent
                                  ? "text-blue-600"
                                  : "text-gray-400 group-hover:text-blue-600"
                              }`} />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-medium ${
                                isCompleted
                                  ? "text-green-600 dark:text-green-400"
                                  : isCurrent
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-900 dark:text-white"
                              }`}>
                                Lecture {lectureIndex + 1}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                <span>10:30</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Certificate Section */}
            {enrollment?.progress?.completionPercentage === 100 && (
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <span className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Certificate Available!
                    </span>
                  </div>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                    Download Certificate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}