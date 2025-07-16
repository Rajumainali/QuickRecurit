import Herotitle from "../_components/herotitle";
import Card from "../_components/cards";
import { ButtonDemo } from "../_components/button";
import VacancyCard from "../_components/vacancyCard";
import Feature from "../_components/feature";
import LoginandSignupprocess from "../_components/loginandSignupprocess";
import Discoverjob from "../_components/Discoverjob";
import JobAlertBanner from "../_components/alertjob";
import Faq from "../_components/Faq";

import { ChevronRight } from "lucide-react";
import Navbar from "../_components/navbar";
import Footer from "../_components/footer";
import { useEffect,useState } from "react";

import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

function Page() {
  const [posts, setPosts] = useState([]);

  const handleBrowseAllJobs = () => {
    // Implement your routing/navigation logic here, e.g., using react-router
    console.log("Navigate to browse all jobs");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/GetAllPosts`, {
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

  return (
    <>
      <Navbar />
      <div className="dark:bg-[#000000]">
        <Herotitle />
        <Card />
        <div className="flex flex-row justify-around gap-9 w-full mt-28">
          <div className="flex flex-col justify-between gap-1">
            <h1 className="text-2xl font-bold">
              Get your dream Internship now
            </h1>
            <p className="text-[14px]">
              Search your career opportunity through the available positions.
            </p>
            <div className="flex flex-row justify-center items-center gap-5 mt-7">
              <ButtonDemo
                name="Featured Internship"
                className="bg-[#aa8bed] text-black hover:bg-[#a187d7] rounded-[40px]"
              />
              <ButtonDemo
                name="Nearest"
                className="bg-gray-600 text-black hover:bg-gray-700 rounded-[40px]"
              />
              <ButtonDemo
                name="Newest"
                className="bg-gray-600 text-black hover:bg-gray-700 rounded-[40px]"
              />
              <ButtonDemo
                name="Oldest"
                className="bg-gray-600 text-black hover:bg-gray-700 rounded-[40px]"
              />
            </div>
          </div>
          <div className="flex flex-row justify-center items-center">
            <button
              onClick={handleBrowseAllJobs}
              className="hover:underline cursor-pointer"
            >
              Browse all Jobs
            </button>
            <ChevronRight className="w-5 h-5" />
          </div>
        </div>
     <div className="flex flex-row ml-[10rem] gap-6 mt-10 w-[80vw]">
  {posts.map((post, idx) => (
    <VacancyCard key={idx} post={post} />
  ))}
</div>

        <Feature />
        <LoginandSignupprocess />
        <Discoverjob />
        <JobAlertBanner />
        <Faq />
      </div>
      <Footer />
    </>
  );
}

export default Page;
