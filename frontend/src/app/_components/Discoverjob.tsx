import { ChevronsRight, Building, BadgeDollarSign, Filter, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ButtonDemo } from "./button";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type PostType = {
  title: string;
  sector: string;
  level: string;
  type?: string;
  location: string;
  city: string;
  openings: string;
  minSalary: string;
  maxSalary: string;
  deadline: string;
  requirements?: string;
  skills?: string;
  PostType: string;
  postedAt: string;
  recruiterEmail: string;
  companyName: string;
  logo?: string;
};

function VacancyCard() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortBy, setSortBy] = useState<"popular" | "latest">("popular");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/GetAllPosts/job`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        setPosts(data.posts || []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts. Please try again later.");
      }
    };

    fetchPosts();
  }, []);

  const handleApply = (post: any) => {
    navigate(`/apply/${post.title}`);
  };

  // Sort posts (simplified logic; adjust based on your popularity metric)
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
    // Default to "popular" (e.g., sort by openings or another metric if available)
    return parseInt(b.openings) - parseInt(a.openings);
  });

  return (
    <div className="min-h-screen dark:bg-black py-12">
      <div className="text-center mb-12">
        <div className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-1 rounded-full text-sm font-medium mb-4">
          JOB VACANCY
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-zinc-200 mb-4">
          Discover the best job
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed text-center dark:text-zinc-400">
          Start career with the best company in the world, we ensure you to get
          <br />
          the best job possible.
        </p>
      </div>
      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPosts.map((post, index) => {
            const cleanDescription = post.requirements
            ?.replace(/<[^>]*>?/gm, "") // Remove HTML tags
            .replace(/&nbsp;/g, " ")     // Replace non-breaking spaces
            .trim() || "";

            const truncatedDescription =
              cleanDescription.length > 100
                ? cleanDescription.slice(0, 100) + "..."
                : cleanDescription;
            const postDate = new Date(post.postedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={index}
                className="dark:bg-[#3D3D3D] rounded-2xl p-4 shadow-sm flex flex-col justify-between w-[350px] h-full"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                      {post.logo ? (
                        <img
                          src={`${API_BASE_URL}upload/logos/${post.logo}`}
                          alt={`${post.companyName} logo`}
                          className="w-full h-full object-fit"
                        />
                      ) : (
                        <Building className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-semibold text-gray-900 dark:text-[#ECECEC] truncate">
                        {post.title}
                      </h2>
                      <p className="text-xs text-gray-500 dark:text-[#ECECE1] truncate">
                        {post.companyName}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-[#ECECE1] mb-2">
                    {truncatedDescription}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    Deadline:{postDate}
                  </span>
                  <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
                    <MapPin className="w-3 h-3" /> {post.city}
                  </div>
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-300">
                    <BadgeDollarSign className="w-3 h-3" /> ${post.minSalary} - ${post.maxSalary}/Month
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-300">
                    <Filter className="w-3 h-3" /> {post.type || "Full-Time"}
                  </div>
                </div>
                <button
                  onClick={() => handleApply(post)}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-200 shadow-sm"
                >
                  APPLY NOW
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
   </div>
  );
}

export default VacancyCard;