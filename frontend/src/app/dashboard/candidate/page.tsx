import React, { useEffect, useState } from "react";
import { Database, Clock, X, Bookmark } from "lucide-react";
import CandidateLayout from "../../../Layouts/CandidateLayout";
const API_BASE_URL = import.meta.env.VITE_API_URL;
import { useNavigate } from "react-router-dom";

interface Application {
  _id: string;
  postTitle: string;
  companyName: string;
  logo: string;
  status: string;
  location: string;
  openings: string | number;
  appliedAt: string;
}
const Page = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE_URL}auth/applicants`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch applications");

        const data = await response.json();
        setApplications(data.applicants || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);
  const handlenavigate = () => {
    navigate("/dashboard/candidate/applications");
  };
  return (
    <CandidateLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Hey there, Here are Things to Know!
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Applied */}
          <button
            className="bg-white dark:bg-gray-800 cursor-pointer rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center "
            onClick={handlenavigate}
          >
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {applications.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Applied
            </div>
          </button>

          {/* Alerts */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              208
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Alerts
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Rejected
            </div>
          </div>

          {/* Bookmarks */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Bookmarks
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internship Applied Recently */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Internship Applied Recently
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent applications
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h2>
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No recent activities
              </p>
            </div>
          </div>
        </div>
      </div>
    </CandidateLayout>
  );
};

export default Page;
