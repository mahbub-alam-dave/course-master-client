"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  Award,
  Globe
} from "lucide-react";

export default function InstructorApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [activeTab, currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/instructor-applications/applications?status=${activeTab}&page=${currentPage}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();

      if (data.success) {
        setApplications(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    if (!confirm("Are you sure you want to approve this application?")) return;

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/instructor-applications/applications/${applicationId}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Application approved! User is now an instructor.");
        fetchApplications();
        setShowModal(false);
      } else {
        alert(data.message || "Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
      alert("Failed to approve application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/instructor-applications/applications/${applicationId}/reject`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ reason: rejectionReason })
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Application rejected");
        setRejectionReason("");
        fetchApplications();
        setShowModal(false);
      } else {
        alert(data.message || "Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
      alert("Failed to reject application");
    } finally {
      setActionLoading(false);
    }
  };

  const openModal = (application) => {
    setSelectedApp(application);
    setShowModal(true);
    setRejectionReason("");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Instructor Applications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Review and manage instructor applications
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {["pending", "approved", "rejected", "all"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === tab
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            No applications found
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Applicant
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Title
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Experience
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Applied Date
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr
                      key={app._id}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {app.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {app.user.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {app.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900 dark:text-white">
                        {app.title}
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {app.experience}
                      </td>
                      <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                        {formatDate(app.appliedDate)}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => openModal(app)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {pagination.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(pagination.totalPages, prev + 1))
                    }
                    disabled={currentPage === pagination.totalPages}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      currentPage === pagination.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white dark:bg-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Application Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Applicant Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedApp.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedApp.user.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedApp.title}</p>
                  </div>
                  {getStatusBadge(selectedApp.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    {selectedApp.user.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    Applied: {formatDate(selectedApp.appliedDate)}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Award className="w-4 h-4" />
                    {selectedApp.experience}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Bio
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedApp.bio}
                </p>
              </div>

              {/* Expertise */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Areas of Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedApp.expertise.map((exp, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-medium"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Teaching Experience */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Teaching Experience
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedApp.teachingExperience}
                </p>
              </div>

              {/* Motivation */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Why They Want to Teach
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedApp.motivation}
                </p>
              </div>

              {/* Course Ideas */}
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Course Ideas
                </h4>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {selectedApp.courseIdeas}
                </p>
              </div>

              {/* Social Links */}
              {Object.values(selectedApp.socialLinks || {}).some((link) => link) && (
                <div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Social Links
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(selectedApp.socialLinks).map(
                      ([platform, url]) =>
                        url && (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Rejection Reason (if rejected) */}
              {selectedApp.status === "rejected" && selectedApp.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                    Rejection Reason
                  </h4>
                  <p className="text-red-700 dark:text-red-300">
                    {selectedApp.rejectionReason}
                  </p>
                </div>
              )}

              {/* Actions (only for pending) */}
              {selectedApp.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedApp._id)}
                      disabled={actionLoading}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(selectedApp._id)}
                      disabled={actionLoading}
                      className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}