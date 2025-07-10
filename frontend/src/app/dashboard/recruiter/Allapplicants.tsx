import React, { useState } from "react";
import { ChevronRight, ChevronDown, ExternalLink } from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";

function AllApplications() {
  const [selectedJob, setSelectedJob] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sample job/internship data
  const jobPosts = [
    {
      id: 1,
      title: "Frontend Developer Internship",
      type: "Internship",
      applicants: 15,
    },
    { id: 2, title: "Senior Software Engineer", type: "Job", applicants: 8 },
    { id: 3, title: "UI/UX Designer", type: "Job", applicants: 12 },
    { id: 4, title: "Marketing Intern", type: "Internship", applicants: 23 },
    { id: 5, title: "Data Analyst", type: "Job", applicants: 6 },
  ];

  const handleJobSelect = (job: any) => {
    setSelectedJob(job.title);
    setIsDropdownOpen(false);
  };

  const handleManageApplicants = () => {
    if (selectedJob) {
      console.log(`Managing applicants for: ${selectedJob}`);
    }
  };

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gray-50 p-6  rounded-4xl dark:bg-[#101828]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white ">
              All Applications
            </h1>

            {/* Breadcrumb */}
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

          {/* Main Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 dark:bg-[#1E2939]">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 dark:text-gray-300">
                Select your Job or Internship Post
              </h2>

              <p className="text-gray-500 mb-8 leading-relaxed dark:text-gray-400">
                First Select job or internship and then you can manage your
                applicant
                <br />
                of selected job or internship.
              </p>

              {/* Dropdown and Button Container */}
              <div className="flex items-center gap-4 max-w-lg mx-auto">
                {/* Custom Dropdown */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between  hover:border-gray-400 transition-colors dark:bg-gray-800"
                  >
                    <span
                      className={
                        selectedJob
                          ? "text-gray-900 dark:text-gray-400"
                          : "text-gray-400 "
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

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border dark:bg-gray-800 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {jobPosts.map((job) => (
                        <button
                          key={job.id}
                          onClick={() => handleJobSelect(job)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 dark:text-gray-200 focus:bg-gray-700 focus:outline-none border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-gray-200">
                                {job.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {job.type}
                              </div>
                            </div>
                            <div className="text-sm text-gray-400">
                              {job.applicants} applicants
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Manage Button */}
                <button
                  onClick={handleManageApplicants}
                  disabled={!selectedJob}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedJob
                      ? "bg-red-400 hover:bg-red-500 text-white shadow-md hover:shadow-lg"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}

export default AllApplications;
