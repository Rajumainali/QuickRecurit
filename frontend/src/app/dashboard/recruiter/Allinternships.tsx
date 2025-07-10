import React, { useState } from "react";
import { Search, Plus, ChevronDown, FileX, AlertCircle } from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";

const Page: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All Jobs");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Nearest Deadline");
  const [filterBy, setFilterBy] = useState("All");

  const tabs = [
    { name: "All Jobs", count: null, color: "text-red-500 border-red-500" },
    { name: "Active", count: null, color: "text-gray-500 border-transparent" },
    { name: "Pending", count: null, color: "text-gray-500 border-transparent" },
    { name: "Closed", count: null, color: "text-gray-500 border-transparent" },
    {
      name: "Rejected",
      count: null,
      color: "text-gray-500 border-transparent",
    },
    {
      name: "Featured",
      count: null,
      color: "text-gray-500 border-transparent",
    },
  ];

  const tableHeaders = [
    { name: "Title", sortable: true },
    { name: "Applications", sortable: false },
    { name: "Openings", sortable: false },
    { name: "Location", sortable: false },
    { name: "Deadline", sortable: true },
    { name: "Created At", sortable: true },
    { name: "Status", sortable: false },
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            My Internships/Jobs Listing
          </h1>
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Post a Internship/Job</span>
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center gap-4 flex-1">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="All">All</option>
                <option value="Internship">Internship</option>
                <option value="Job">Job</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search jobs title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Nearest Deadline">Nearest Deadline</option>
                <option value="Latest Created">Latest Created</option>
                <option value="Most Applications">Most Applications</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.name
                    ? tab.color
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tab.name}
                {tab.count && (
                  <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
            {tableHeaders.map((header) => (
              <div key={header.name} className="flex items-center space-x-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {header.name}
                </span>
                {header.sortable && (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          <div className="p-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                <FileX className="w-8 h-8 text-red-500" />
                <AlertCircle className="w-4 h-4 text-red-500 absolute -mt-2 -mr-2" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Results
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
              You haven't posted any internships or jobs yet. Click the button
              above to create your first posting.
            </p>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Page;
