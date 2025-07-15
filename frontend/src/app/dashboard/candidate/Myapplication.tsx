import React, { useState } from "react";
import CandidateLayout from "../../../Layouts/CandidateLayout";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo: string;
  status:
    | "Pending"
    | "Viewed"
    | "Shortlisted"
    | "Offered"
    | "Hired"
    | "Rejected"
    | "Withdrawn";
  location: string;
  openings: number;
  appliedDate: string;
}

const dummyApplications: Application[] = [
  {
    id: "ID598",
    jobTitle: "WordPress Developer Intern",
    company: "Internathi",
    companyLogo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
    status: "Pending",
    location: "Kathmandu",
    openings: 1,
    appliedDate: "July 12, 2025",
  },
  {
    id: "ID599",
    jobTitle: "Frontend Developer",
    company: "TechFusion",
    companyLogo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
    status: "Viewed",
    location: "Kathmandu",
    openings: 2,
    appliedDate: "July 10, 2025",
  },
  {
    id: "ID600",
    jobTitle: "UI/UX Intern",
    company: "Designify",
    companyLogo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
    status: "Shortlisted",
    location: "Pokhara",
    openings: 1,
    appliedDate: "July 8, 2025",
  },
  {
    id: "ID601",
    jobTitle: "Backend Engineer",
    company: "CodeCraft",
    companyLogo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
    status: "Rejected",
    location: "Lalitpur",
    openings: 3,
    appliedDate: "July 5, 2025",
  },
];

const statusColors = {
  Pending:
    "bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  Viewed:
    "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  Shortlisted:
    "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  Offered:
    "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Hired:
    "bg-emerald-100 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  Rejected:
    "bg-red-100 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  Withdrawn:
    "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/20 dark:text-gray-400 dark:border-gray-700",
};

const Myapplication: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = [
    {
      name: "All",
      count: dummyApplications.length,
      color:
        "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400",
    },
    {
      name: "Pending",
      count: dummyApplications.filter((app) => app.status === "Pending").length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Viewed",
      count: dummyApplications.filter((app) => app.status === "Viewed").length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Shortlisted",
      count: dummyApplications.filter((app) => app.status === "Shortlisted")
        .length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Offered",
      count: dummyApplications.filter((app) => app.status === "Offered").length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Hired",
      count: dummyApplications.filter((app) => app.status === "Hired").length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Rejected",
      count: dummyApplications.filter((app) => app.status === "Rejected")
        .length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
    {
      name: "Withdrawn",
      count: dummyApplications.filter((app) => app.status === "Withdrawn")
        .length,
      color:
        "text-gray-500 border-transparent dark:text-gray-400 dark:border-transparent",
    },
  ];

  const filteredApplications =
    activeTab === "All"
      ? dummyApplications
      : dummyApplications.filter((app) => app.status === activeTab);

  return (
    <CandidateLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <span>Dashboard</span>
              <span className="mx-2">›</span>
              <span>My Application</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.name
                      ? "text-red-600 border-red-600 dark:text-red-400 dark:border-red-400"
                      : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600"
                  } transition-colors duration-200`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.name
                          ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Openings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {app.jobTitle}-{app.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-red-500 dark:bg-red-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {app.company.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {app.company}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${
                          statusColors[app.status]
                        }`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {app.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {app.openings}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {app.appliedDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                          See Details
                        </button>
                        <button className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 text-lg">
                No applications found
              </div>
            </div>
          )}
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Myapplication;
