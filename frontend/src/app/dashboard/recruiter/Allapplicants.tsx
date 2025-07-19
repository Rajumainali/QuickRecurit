import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronDown,
  ExternalLink,
  User,
  Mail,
  Calendar,
  FileText,
  Eye,
  Check,
  X,
  Star,
  Loader2,
} from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";

interface JobPost {
  _id: string;
  title: string;
  PostType: string;
  requirements: string;
  skills: string;

  applicants: {
    name: string;
    email: string;
    resumeLink: string;
    _id: string;
    appliedAt: string;
  }[];
}

interface Applicant {
  name: string;
  email: string;
  resumeLink: string;
  _id: string;
  appliedAt: string;
}

interface ApplicantScore {
  applicantId: string;
  score: number;
}

function AllApplications() {
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );
  const [applicantScores, setApplicantScores] = useState<ApplicantScore[]>([]);
  const [isLoadingRanks, setIsLoadingRanks] = useState(false);

  useEffect(() => {
    const fetchJobPosts = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(
          "http://localhost:5000/auth/fetch-user-Details",
          {
            method: "GET",
            headers: {
              Authorization: `${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job posts");
        }

        const data = await response.json();
        setJobPosts(data.posts || []);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchJobPosts();
  }, []);
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, "").trim();
  };

  const getRequirementAndResumes = (job: JobPost) => {
    const requirementsText = stripHtmlTags(job.requirements || "");
    const skillsText = stripHtmlTags(job.skills || "");

    const combinedRequirements = `${requirementsText}. ${skillsText}`;

    const resumes = job.applicants.map((applicant) => ({
      name: applicant.name,
      email: applicant.email,
      resumeLink: applicant.resumeLink,
    }));

    return {
      requirement: combinedRequirements,
      resumes: resumes,
    };
  };

  const handleJobSelect = (job: JobPost) => {
    setSelectedJob(job.title);
    setSelectedJobId(job._id);
    setIsDropdownOpen(false);
    setShowApplicants(false);
    // Reset scores when selecting a new job
    setApplicantScores([]);

    const data = getRequirementAndResumes(job);
    console.log("Requirements and Resumes:", data);
  };

  const handleManageApplicants = () => {
    if (selectedJob && selectedJobId) {
      setShowApplicants(true);
    }
  };

  const handleGetRanks = async () => {
    if (!selectedJobId) return;

    setIsLoadingRanks(true);
    const token = localStorage.getItem("token");

    try {
      // Replace this URL with your actual ranking endpoint
      const response = await fetch(
        `http://localhost:5000/auth/get-applicant-ranks/${selectedJobId}`,
        {
          method: "GET",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch ranks");
      }

      const data = await response.json();
      // Assuming the response has a structure like: { ranks: [{ applicantId: string, score: number }] }
      setApplicantScores(data.ranks || []);
    } catch (error) {
      console.error("Error fetching ranks:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoadingRanks(false);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    console.log(`Changing status of applicant ${applicantId} to ${newStatus}`);

    const token = localStorage.getItem("token");

    try {
      // Replace this URL with your actual status update endpoint
      const response = await fetch(
        `http://localhost:5000/auth/update-applicant-status`,
        {
          method: "POST",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantId,
            status: newStatus,
            jobId: selectedJobId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update applicant status");
      }

      // You might want to refresh the applicants list or show a success message
      console.log("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleViewApplicant = (applicant: Applicant) => {
    setSelectedApplicant(applicant);
    console.log("Viewing applicant:", applicant);
    console.log(jobPosts);
  };

  // Get score for a specific applicant
  const getApplicantScore = (applicantId: string): number | null => {
    const scoreData = applicantScores.find(
      (score) => score.applicantId === applicantId
    );
    return scoreData ? scoreData.score : null;
  };

  // Check if scores are available for any applicant
  const hasScores = applicantScores.length > 0;

  // Get current job's applicants
  const currentJobApplicants =
    jobPosts.find((job) => job._id === selectedJobId)?.applicants || [];

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gray-50 p-6 rounded-4xl dark:bg-[#101828]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">
              All Applications
            </h1>
            <div className="flex items-center text-sm text-gray-600 mb-8">
              <span className="hover:text-gray-900 cursor-pointer dark:text-gray-400">
                Dashboard
              </span>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-400 dark:text-gray-300">
                Manage Applicants
              </span>
            </div>
          </div>

          {/* Job Selection Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 dark:bg-[#1E2939] mb-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-300">
                Select your Job or Internship Post
              </h2>

              <p className="text-gray-500 mb-8 leading-relaxed dark:text-gray-400">
                First select job or internship and then you can manage your
                applicant of selected job or internship.
              </p>

              <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between hover:border-gray-400 transition-colors dark:bg-gray-800 dark:border-gray-600"
                  >
                    <span
                      className={
                        selectedJob
                          ? "text-gray-900 dark:text-gray-200"
                          : "text-gray-400"
                      }
                    >
                      {selectedJob || "Search & Select job or internship"}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {jobPosts.map((job, index) => (
                        <button
                          key={job._id || index}
                          onClick={() => handleJobSelect(job)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-200 focus:bg-gray-50 dark:focus:bg-gray-700 focus:outline-none border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-200">
                                {job.title}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {job.PostType}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {job.applicants?.length || 0} applicants
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleManageApplicants}
                  disabled={!selectedJob}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedJob
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700"
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* Applicants List */}
          {showApplicants && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-[#1E2939] dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Applicants for "{selectedJob}"
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      {currentJobApplicants.length} total applications
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleGetRanks}
                      disabled={isLoadingRanks}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      type="button"
                    >
                      {isLoadingRanks ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Getting Ranks...
                        </>
                      ) : (
                        "Get Rank"
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {currentJobApplicants.map((applicant) => {
                  const applicantScore = getApplicantScore(applicant._id);
                  const hasScore = applicantScore !== null;

                  return (
                    <div
                      key={applicant._id}
                      className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-lg uppercase">
                            {applicant.name?.charAt(0) || "A"}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {applicant.name}
                                </h4>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    {applicant.email}
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Applied:{" "}
                                    {new Date(
                                      applicant.appliedAt
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-yellow-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Match Score:
                                  </span>
                                  {hasScore ? (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                      {applicantScore}%
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                      Not calculated
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 mt-4">
                              <button
                                onClick={() => handleViewApplicant(applicant)}
                                className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                                type="button"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>

                              <a
                                href={`http://localhost:5000${applicant.resumeLink}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm"
                              >
                                <FileText className="w-4 h-4" />
                                Resume
                              </a>

                              <button
                                onClick={() =>
                                  handleStatusChange(applicant._id, "approved")
                                }
                                disabled={!hasScore}
                                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-sm ${
                                  hasScore
                                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                }`}
                                type="button"
                              >
                                <Check className="w-4 h-4" />
                                Approve
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(applicant._id, "rejected")
                                }
                                disabled={!hasScore}
                                className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors text-sm ${
                                  hasScore
                                    ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                                }`}
                                type="button"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentJobApplicants.length === 0 && (
                <div className="p-12 text-center">
                  <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Applications Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Applications for this position will appear here once
                    candidates start applying.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default AllApplications;
