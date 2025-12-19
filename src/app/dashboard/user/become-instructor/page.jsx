"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  GraduationCap,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
  Clock,
  XCircle,
  Plus,
  Trash2
} from "lucide-react";

export default function BecomeInstructorPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);

  const [formData, setFormData] = useState({
    bio: "",
    title: "",
    expertise: [""],
    experience: "0-2 years",
    teachingExperience: "",
    socialLinks: {
      website: "",
      linkedin: "",
      twitter: "",
      github: "",
      youtube: ""
    },
    motivation: "",
    courseIdeas: ""
  });

  useEffect(() => {
    checkExistingApplication();
  }, []);

  const checkExistingApplication = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/instructor-applications/my-application`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setExistingApplication(data.data);
        }
      }
    } catch (error) {
      console.error("Error checking application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleExpertiseChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.map((item, i) => i === index ? value : item)
    }));
  };

  const addExpertise = () => {
    setFormData(prev => ({
      ...prev,
      expertise: [...prev.expertise, ""]
    }));
  };

  const removeExpertise = (index) => {
    if (formData.expertise.length > 1) {
      setFormData(prev => ({
        ...prev,
        expertise: prev.expertise.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.bio || formData.bio.length < 100) {
      alert("Bio must be at least 100 characters");
      return false;
    }
    if (!formData.title.trim()) {
      alert("Please enter your professional title");
      return false;
    }
    if (formData.expertise.every(e => !e.trim())) {
      alert("Please add at least one area of expertise");
      return false;
    }
    if (!formData.teachingExperience.trim()) {
      alert("Please describe your teaching experience");
      return false;
    }
    if (!formData.motivation || formData.motivation.length < 100) {
      alert("Motivation must be at least 100 characters");
      return false;
    }
    if (!formData.courseIdeas.trim()) {
      alert("Please share your course ideas");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      // Clean up expertise array
      const cleanedData = {
        ...formData,
        expertise: formData.expertise.filter(e => e.trim())
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/instructor-applications/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(cleanedData)
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Application submitted successfully! We'll review it soon.");
        router.push("/dashboard");
      } else {
        alert(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  // If user is already an instructor
  if (user?.role === "instructor") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <Award className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">You&apos;re Already an Instructor!</h1>
          <p className="text-white/90 mb-6">
            Start creating courses and sharing your knowledge with students worldwide.
          </p>
          <button
            onClick={() => router.push("/dashboard/add-course")}
            className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Create Your First Course
          </button>
        </div>
      </div>
    );
  }

  // If application is pending
  if (existingApplication?.status === "pending") {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white text-center">
          <Clock className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Application Under Review</h1>
          <p className="text-white/90 mb-6">
            Your instructor application is currently being reviewed by our team. We&apos;ll notify you once a decision is made.
          </p>
          <div className="bg-white/20 rounded-xl p-4 text-left">
            <p className="text-sm mb-2">
              <strong>Applied on:</strong> {new Date(existingApplication.appliedDate).toLocaleDateString()}
            </p>
            <p className="text-sm">
              <strong>Status:</strong> Pending Review
            </p>
          </div>
        </div>
      </div>
    );
  }

  // If application was rejected
  if (existingApplication?.status === "rejected") {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-8 text-white text-center">
          <XCircle className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Application Not Approved</h1>
          <p className="text-white/90 mb-6">
            Unfortunately, your application was not approved. Please review the feedback and apply again.
          </p>
          {existingApplication.rejectionReason && (
            <div className="bg-white/20 rounded-xl p-4 text-left">
              <p className="text-sm font-semibold mb-2">Reason:</p>
              <p className="text-sm">{existingApplication.rejectionReason}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            setExistingApplication(null);
            setFormData({
              bio: existingApplication.bio || "",
              title: existingApplication.title || "",
              expertise: existingApplication.expertise || [""],
              experience: existingApplication.experience || "0-2 years",
              teachingExperience: existingApplication.teachingExperience || "",
              socialLinks: existingApplication.socialLinks || {},
              motivation: existingApplication.motivation || "",
              courseIdeas: existingApplication.courseIdeas || ""
            });
          }}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
        >
          Apply Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold mb-4">Become an Instructor</h1>
        <p className="text-xl text-white/90">
          Share your knowledge and earn money teaching what you love
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Reach Students Globally
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Teach students from around the world
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Earn Money
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Get paid for every course enrollment
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Build Your Brand
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Establish yourself as an expert
          </p>
        </div>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Personal Information
          </h2>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Professional Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Senior Software Engineer, UX Designer"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bio * (Min 100 characters)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself, your background, and experience..."
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.bio.length}/100 characters
              </p>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience *
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="0-2 years">0-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="6-10 years">6-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expertise */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Areas of Expertise *
            </h2>
            <button
              type="button"
              onClick={addExpertise}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            {formData.expertise.map((exp, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={exp}
                  onChange={(e) => handleExpertiseChange(index, e.target.value)}
                  placeholder="e.g., JavaScript, React, Node.js"
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData.expertise.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExpertise(index)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Experience */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Teaching Experience
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Describe Your Teaching Experience *
              </label>
              <textarea
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleInputChange}
                placeholder="Have you taught before? Online or in-person? Tell us about your teaching experience..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Social Links (Optional)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.socialLinks.website}
                onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.socialLinks.linkedin}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub
              </label>
              <input
                type="url"
                value={formData.socialLinks.github}
                onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@channel"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Why Do You Want to Teach?
          </h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Your Motivation * (Min 100 characters)
            </label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="Share your passion for teaching and what motivates you..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.motivation.length}/100 characters
            </p>
          </div>
        </div>

        {/* Course Ideas */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Course Ideas
          </h2>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              What Courses Would You Like to Create? *
            </label>
            <textarea
              name="courseIdeas"
              value={formData.courseIdeas}
              onChange={handleInputChange}
              placeholder="Share your course ideas, topics you'd like to teach..."
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}