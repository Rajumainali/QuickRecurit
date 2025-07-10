import React from "react";
import {
  Plus,
  Database,
  FileText,
  CheckCircle,
  Eye,
  User,
  AlertCircle,
} from "lucide-react";
import RecruiterLayout from "../../../Layouts/RecruiterLayout";

const Page = () => {
  const activities = [
    {
      id: 1,
      type: "phone_update",
      title: "Your phone number has been updated.",
      subtitle: "Chirfar Plus | admin@khelchirfar.com",
      time: "2 hours ago",
      icon: <User className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: 2,
      type: "phone_update",
      title: "Your phone number has been updated.",
      subtitle: "Chirfar Plus | admin@khelchirfar.com",
      time: "2 hours ago",
      icon: <User className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      id: 3,
      type: "account_verified",
      title: "Account Verified",
      subtitle: "Chirfar Plus | admin@khelchirfar.com",
      time: "2 hours ago",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      id: 4,
      type: "new_account",
      title: "New Account Created",
      subtitle: "Chirfar Plus | admin@khelchirfar.com",
      time: "2 hours ago",
      icon: <User className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
  ];

  return (
    <RecruiterLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Welcome back! Chirfar Plus
          </h1>
        </div>

        {/* Profile Completion Banner */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  You haven't completed your profile yet.
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Take a few minutes to fill out your profile.
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Upload Company Images</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>Add Social Links</span>
                  </div>
                </div>
              </div>
            </div>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <span>Complete Now</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post Job Section */}
        <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
            <div className="absolute right-8 top-8 w-24 h-24 bg-gray-600 rounded-full"></div>
            <div className="absolute right-20 top-20 w-32 h-32 bg-gray-500 rounded-full"></div>
            <div className="absolute right-2 top-32 w-16 h-16 bg-gray-400 rounded-full"></div>
            <div className="absolute right-32 top-4 w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="absolute right-12 top-40 w-6 h-6 bg-gray-200 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">
              Post your Internship/Job
            </h2>
            <p className="text-gray-300 mb-6">
              Find the perfect fit for your team- post your job with us today!
            </p>
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
              <span>Post a Internship/Job</span>
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Jobs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Database className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Jobs
            </div>
          </div>

          {/* Total Applicants */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Total Applicants
            </div>
          </div>

          {/* Shortlisted */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Shortlisted
            </div>
          </div>

          {/* Views */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <Eye className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              0
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Views
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* New Applications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              New Applications
            </h2>
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                No new applications found
              </p>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activities
            </h2>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.bgColor}`}
                  >
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.subtitle}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default Page;
