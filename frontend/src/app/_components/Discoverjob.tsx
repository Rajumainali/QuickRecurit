import { useState } from "react";
import { ButtonDemo } from "./button";
import { MapPin, DollarSign, Clock, Calendar, ArrowRight } from "lucide-react";

export default function Discoverjob() {
  const [selectedTab, setSelectedTab] = useState("Popular");

  const jobListings = [
    {
      id: 1,
      title: "Web Developer",
      company: "Loom",
      description:
        "We are on a mission to empower everyone at work to communicate more effectively.",
      location: "New York",
      salary: "75k - 90k / Year",
      type: "Full-Time",
      date: "8 July 2022",
      featured: true,
      defaultColor: "bg-blue-500",
      img: "/img/webd.jpg",
    },
    {
      id: 3,
      title: "Senior DevOps Engineer",
      company: "HubSpot",
      description:
        "HubSpot is a leading customer relationship management platform for scaling companies.",
      location: "California",
      salary: "75k - 90k / Year",
      type: "Contract",
      date: "7 Jan 2022",
      featured: false,
      defaultColor: "bg-orange-500",
      img: "/img/devops-2.svg",
    },
    {
      id: 4,
      title: "Web Developer",
      company: "Loom",
      description:
        "We are on a mission to empower everyone at work to communicate more effectively.",
      location: "New York",
      salary: "75k - 90k / Year",
      type: "Full-Time",
      date: "8 July 2022",
      featured: true,
      defaultColor: "bg-blue-500",
      img: "/img/webd.jpg",
    },
    {
      id: 2,
      title: "Senior DevOps Engineer",
      company: "HubSpot",
      description:
        "HubSpot is a leading customer relationship management platform for scaling companies.",
      location: "California",
      salary: "75k - 90k / Year",
      type: "Contract",
      date: "7 Jan 2022",
      featured: false,
      defaultColor: "bg-orange-500",
      img: "/img/devops-2.svg",
    },
  ];
  return (
    <>
      <div className="flex justify-center items-center flex-col  ">
        <ButtonDemo
          name="JOB VACANCY"
          className="bg-[#3d3d3d] hover:bg-[#555555] px-6 py-2 rounded-full text-white transition duration-300 dark:text-[#ececec]"
        />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-6 dark:text-zinc-200">
          Discover the best job
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-center mb-16 dark:text-zinc-400">
          Start carrer with the best company in the world, we ensures you to get
          <br />
          the best job possible.
        </p>
      </div>
      <div className="max-w-4xl mx-auto p-6 ">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-full p-1 shadow-sm">
            {["Popular", "Lastest"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTab === tab
                    ? "bg-blue-500 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
          {jobListings.map((job) => (
            <div
              key={job.id}
              className={`bg-white dark:bg-[#3D3D3D] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:ring-2 ring-blue-200 border-blue-100 cursor-pointer`}
            >
              {/* Header with Logo and Arrow */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {/* Empty Logo Placeholder */}
                  <div
                    className={`w-12 h-12 ${job.defaultColor} rounded-xl flex items-center justify-center`}
                  >
                    <img
                      src={job.img}
                      alt="imagelogo"
                      height={48}
                      width={48}
                      className="rounded-4xl"
                    />
                  </div>

                  {/* Job Title and Company */}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px] dark:text-[#ECECEC]">
                      {job.title}
                    </h3>
                    <p className="text-gray-500 text-sm dark:text-[#ECECEC]">
                      {job.company}
                    </p>
                  </div>
                </div>

                {/* Arrow and Date */}
                <div className="flex items-center space-x-2 ">
                  {job.date && (
                    <span className="text-gray-400 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {job.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6 dark:text-[#c9c4c4]">
                {job.description}
              </p>

              {/* Job Details */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-[#8a8a8a]">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center ">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {job.salary}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-9 gap-2">
          <p className="text-gray-600 dark:text-[#bcb9b9]">
            Did not find what you're looking for?&nbsp;
            <a href="/" className="underline text-[#7008E7]">
              View All Job
            </a>
          </p>
          <ArrowRight color="#7008E7" size={20} />
        </div>
      </div>
    </>
  );
}
