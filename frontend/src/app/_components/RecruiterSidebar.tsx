import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  FileText,
  LayoutDashboard,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Sidebar: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  const pathname = location.pathname;

  // Initialize state from localStorage or default to empty array
  const [expandedItems, setExpandedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem("sidebar-expanded-items");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever expandedItems changes
  useEffect(() => {
    localStorage.setItem(
      "sidebar-expanded-items",
      JSON.stringify(expandedItems)
    );
  }, [expandedItems]);

  // Auto-expand section that contains the current page (only when route changes, not when manually toggled)
  useEffect(() => {
    const currentSection = dropdownSections.find((section) =>
      section.items.some((item) => item.to === pathname)
    );

    if (currentSection && !expandedItems.includes(currentSection.name)) {
      setExpandedItems((prev) => [...prev, currentSection.name]);
    }
  }, [pathname]); // Removed expandedItems from dependency array to prevent re-triggering

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const mainLinks = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={18} />,
      to: "/dashboard/recruiter",
    },
    {
      name: "Company Profile",
      icon: <User size={18} />,
      to: "/dashboard/recruiter/profile",
    },
  ];

  const dropdownSections = [
    {
      name: "Internships/Jobs",
      icon: <BriefcaseBusiness size={18} />,
      items: [
        {
          name: "All Internship/Job",
          to: "/dashboard/recruiter/all-internships",
        },
        {
          name: "Post Internship/Jobs",
          to: "/dashboard/recruiter/internships-jobs/posts",
        },
      ],
    },
    {
      name: "Manage Applicants",
      icon: <FileText size={18} />,
      items: [
        {
          name: "All Applications",
          to: "/dashboard/recruiter/All-applicants",
        },
        { name: "Shortlisted", to: "/dashboard/recruiter/shortlisted" },
        { name: "Saved", to: "/dashboard/recruiter/saved" },
      ],
    },
  ];

  const isExpanded = (itemName: string) => expandedItems.includes(itemName);

  return (
    <aside className="min-h-screen w-64 bg-[#f3edff] dark:bg-[#1a1a1a] border-r p-5 ">
      <nav className="flex flex-col gap-4">
        {/* Main Links */}
        {mainLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-all hover:bg-[#d8c4ff] dark:hover:bg-[#2a2a2a] ${
              pathname === link.to
                ? "bg-[#cbb2ff] text-black dark:bg-[#333] dark:text-white"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {link.icon} {link.name}
          </Link>
        ))}

        {/* Dropdown Sections */}
        {dropdownSections.map((section) => (
          <div key={section.name}>
            <button
              onClick={() => toggleExpanded(section.name)}
              className={`flex items-center justify-between w-full gap-3 p-3 rounded-xl text-sm font-medium transition-all hover:bg-[#d8c4ff] dark:hover:bg-[#2a2a2a] ${
                section.name === "Manage Applicants"
                  ? "bg-[#ffe6e6] text-red-600 dark:bg-[#2a1a1a] dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {section.icon} {section.name}
              </div>
              {isExpanded(section.name) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {/* Dropdown Items */}
            {isExpanded(section.name) && (
              <div className="ml-4 mt-2 space-y-1">
                {section.items.map((item) => (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`flex items-center gap-3 p-2 pl-6 rounded-lg text-sm font-medium transition-all hover:bg-[#d8c4ff] dark:hover:bg-[#2a2a2a] ${
                      pathname === item.to
                        ? "bg-[#cbb2ff] text-black dark:bg-[#333] dark:text-white"
                        : item.name === "All Applications" ||
                          item.name === "Shortlisted"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
        >
          <LogOut size={18} /> Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
