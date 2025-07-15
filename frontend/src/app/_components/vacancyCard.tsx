import { ChevronsRight } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_URL;
type PostType = {
  companyName: string;
  city: string;
  location: string;
  requirements?: string;
  deadline?: string;
  type?: string;
  logo?:string
};

function VacancyCard({ post }:{ post: PostType }) {
  return (
      <div className="bg-white dark:bg-[#3D3D3D] border-none rounded-2xl border p-4 shadow-sm mt-7 h-[240px] w-[300px] flex-shrink-0">
        {/* Header with logo and company info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={`${API_BASE_URL}upload/logos/${post.logo}`} // optional: replace with post.logo if available
              alt={`${post.companyName} logo`}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900 mb-1 dark:text-[#ECECEC]">
              {post.companyName}
            </h1>
            <p className="text-xs text-gray-500 dark:text-[#ECECE1]">
              {post.city}, {post.location}
            </p>
          </div>
        </div>

        {/* Job description */}
        <div className="mb-4">
          <p className="text-gray-600 text-xs leading-relaxed dark:text-[#ECECE1] line-clamp-3">
            {post.requirements?.replace(/<[^>]*>?/gm, "").slice(0, 100)}...
            <span className="text-blue-600 font-medium cursor-pointer dark:text-[#D4D4D4]">
              Read More
            </span>
          </p>
        </div>

        {/* Job details tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="px-2.5 py-1 bg-blue-50 text-[#171735] text-xs font-medium rounded-full  dark:bg-[#D4D4D4]">
            {post.deadline ? `${post.deadline}` : "N/A"}
          </span>
          <span className="px-2.5 py-1 bg-green-50 text-[#171735] text-xs font-medium rounded-full dark:bg-[#D4D4D4]">
            {post.city}
          </span>
          <span className="px-2.5 py-1 bg-purple-50 text-[#171735] text-xs font-medium rounded-full dark:bg-[#D4D4D4]">
            {post.type}
          </span>
        </div>

        {/* Apply button */}
        <div className="flex items-center justify-between">
          <button className="bg-[#D4D4D4] text-[#171735] hover:bg-[#9a9797] font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors text-sm ">
            APPLY NOW
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
  );
}

export default VacancyCard;
