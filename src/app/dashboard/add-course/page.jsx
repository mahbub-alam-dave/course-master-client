"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  Save,
  X,
  Plus,
  Trash2,
  Loader2,
  Upload,
  DollarSign,
  Clock,
  Award
} from "lucide-react";

export default function AddCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form state
  const [courseData, setCourseData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "Web Development",
    subcategory: "",
    level: "Beginner",
    language: "English",
    price: "",
    discountPrice: "",
    currency: "USD",
    thumbnail: "",
    previewVideo: "",
    duration: "",
    totalLectures: "",
    totalQuizzes: 0,
    totalAssignments: 0,
    learningOutcomes: [""],
    requirements: [""],
    tags: [""],
    certificateOffered: true,
    accessType: "lifetime"
  });

  const [sections, setSections] = useState([
    { id: "section_001", title: "", order: 1, lectures: 1 }
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Auto-generate slug from title
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setCourseData(prev => ({
      ...prev,
      title,
      slug
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setCourseData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field, index) => {
    if (courseData[field].length > 1) {
      setCourseData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSectionChange = (index, field, value) => {
    setSections(prev => prev.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    ));
  };

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: `section_${String(prev.length + 1).padStart(3, '0')}`,
        title: "",
        order: prev.length + 1,
        lectures: 1
      }
    ]);
  };

  const removeSection = (index) => {
    if (sections.length > 1) {
      setSections(prev => prev.filter((_, i) => i !== index));
    }
  };

  const validateForm = () => {
    if (!courseData.title.trim()) {
      alert("Please enter course title");
      return false;
    }
    if (!courseData.shortDescription.trim()) {
      alert("Please enter short description");
      return false;
    }
    if (!courseData.description.trim()) {
      alert("Please enter course description");
      return false;
    }
    if (!courseData.price) {
      alert("Please enter course price");
      return false;
    }
    if (sections.some(s => !s.title.trim())) {
      alert("Please fill all section titles");
      return false;
    }
    return true;
  };

  const handleSubmit = async (isDraft = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Clean up empty array items
      const cleanedData = {
        ...courseData,
        learningOutcomes: courseData.learningOutcomes.filter(item => item.trim()),
        requirements: courseData.requirements.filter(item => item.trim()),
        tags: courseData.tags.filter(item => item.trim()),
        sections: sections,
        // Set approval status based on draft or submit
        approvalStatus: isDraft ? 'draft' : 'pending',
        status: 'draft'
      };

      const endpoint = user?.role === 'admin'
        ? `${process.env.NEXT_PUBLIC_API}/admin/courses`
        : `${process.env.NEXT_PUBLIC_API}/instructor/courses`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (data.success) {
        alert(isDraft 
          ? "✅ Course saved as draft!" 
          : "✅ Course submitted for approval!"
        );
        router.push("/dashboard/my-courses");
      } else {
        alert(data.message || "Failed to create course");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create New Course
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the course details to create a new course
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                onChange={handleTitleChange}
                placeholder="e.g., Complete Web Development Bootcamp"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slug */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Course Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={courseData.slug}
                onChange={handleInputChange}
                placeholder="complete-web-development-bootcamp"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-generated from title</p>
            </div>

            {/* Short Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDescription"
                value={courseData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief one-line description"
                maxLength={150}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {courseData.shortDescription.length}/150 characters
              </p>
            </div>

            {/* Full Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Full Description *
              </label>
              <textarea
                name="description"
                value={courseData.description}
                onChange={handleInputChange}
                placeholder="Detailed course description..."
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={courseData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Design">Design</option>
                <option value="DevOps">DevOps</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Level *
              </label>
              <select
                name="level"
                value={courseData.level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Language */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <input
                type="text"
                name="language"
                value={courseData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={courseData.duration}
                onChange={handleInputChange}
                placeholder="e.g., 52 hours"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Pricing
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Price * ($)
              </label>
              <input
                type="number"
                name="price"
                value={courseData.price}
                onChange={handleInputChange}
                placeholder="99.99"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Discount Price ($)
              </label>
              <input
                type="number"
                name="discountPrice"
                value={courseData.discountPrice}
                onChange={handleInputChange}
                placeholder="49.99"
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={courseData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Content - Sections */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-purple-600" />
              Course Sections
            </h2>
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
          </div>

          <div className="space-y-4">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
              >
                <div className="flex gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Section Title
                      </label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                        placeholder="e.g., Introduction to Web Development"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Number of Lectures
                      </label>
                      <input
                        type="number"
                        value={section.lectures}
                        onChange={(e) => handleSectionChange(index, 'lectures', parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  {sections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSection(index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-600" />
              Learning Outcomes
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('learningOutcomes')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Outcome
            </button>
          </div>

          <div className="space-y-3">
            {courseData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayInputChange('learningOutcomes', index, e.target.value)}
                  placeholder="What will students learn?"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {courseData.learningOutcomes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('learningOutcomes', index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Requirements
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('requirements')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Requirement
            </button>
          </div>

          <div className="space-y-3">
            {courseData.requirements.map((req, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                  placeholder="What do students need before taking this course?"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {courseData.requirements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('requirements', index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tags
            </h2>
            <button
              type="button"
              onClick={() => addArrayField('tags')}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Tag
            </button>
          </div>

          <div className="space-y-3">
            {courseData.tags.map((tag, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayInputChange('tags', index, e.target.value)}
                  placeholder="e.g., javascript, react, web-dev"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {courseData.tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayField('tags', index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {user?.role === 'admin' ? 'Create Course' : 'Submit for Approval'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}