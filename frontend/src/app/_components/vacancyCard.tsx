import { ChevronsRight, Building } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type PostType = {
  companyName: string;
  city: string;
  location: string;
  requirements?: string;
  deadline?: string;
  type?: string;
  logo?: string;
};

function VacancyCard({ post }: { post: PostType }) {
  const cleanDescription =
    post.requirements?.replace(/<[^>]*>?/gm, "").trim() || "";
  const truncatedDescription =
    cleanDescription.length > 100
      ? cleanDescription.slice(0, 100) + "..."
      : cleanDescription;

  return (
    <div className="bg-white dark:bg-[#3D3D3D] border-none rounded-2xl border p-4 shadow-sm mt-7 h-[240px] w-[300px] flex-shrink-0 flex flex-col">
      {/* Header with logo and company info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-600">
          {post.logo ? (
            <img
              src={`${API_BASE_URL}upload/logos/${post.logo}`}
              alt={`${post.companyName} logo`}
              width={40}
              height={40}
              className="w-full h-full object-fit"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Building className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold text-gray-900 mb-1 dark:text-[#ECECEC] truncate">
            {post.companyName}
          </h1>
          <p className="text-xs text-gray-500 dark:text-[#ECECE1] truncate">
            {post.city}, {post.location}
          </p>
        </div>
      </div>

      {/* Job description */}
      <div className="mb-4 flex-1">
        <p className="text-gray-600 text-xs leading-relaxed dark:text-[#ECECE1] line-clamp-3">
          {truncatedDescription}
          {cleanDescription.length > 100 && (
            <span className="text-blue-600 font-medium cursor-pointer dark:text-[#D4D4D4] ml-1 hover:underline">
              Read More
            </span>
          )}
        </p>
      </div>

      {/* Job details tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.deadline && (
          <span className="px-2.5 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full dark:bg-red-900/20 dark:text-red-300 whitespace-nowrap">
            {post.deadline}
          </span>
        )}
        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full dark:bg-blue-900/20 dark:text-blue-300 whitespace-nowrap">
          {post.city}
        </span>
        {post.type && (
          <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full dark:bg-green-900/20 dark:text-green-300 whitespace-nowrap">
            {post.type}
          </span>
        )}
      </div>

      {/* Apply button */}
      <div className="mt-auto">
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 text-sm shadow-sm">
          APPLY NOW
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default VacancyCard;
