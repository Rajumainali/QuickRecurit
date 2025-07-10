import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../app/_components/footer";
import { toast } from "react-hot-toast";
import RecruiterSidebar from "../app/_components/RecruiterSidebar";
import MultiStepForm from "../app/onboarding/recruiter/about-yourself/page";
import RecruiterDashNav from "../app/_components/recruiterDashNav";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const { exp } = JSON.parse(atob(token.split(".")[1]));
    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
};

interface CandidateLayoutProps {
  children: React.ReactNode;
}

const CandidateLayout: React.FC<CandidateLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [result, setResult] = useState<"yes" | "no" | null>(null);
 const [details, setDetails] = useState<{ 
   CompanyName?: string; 
   logo?: string | null 
 }>({});
  const [loading, setLoading] = useState(true);
  const redirectedRef = useRef(false); //  To avoid multiple redirects/toasts

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!isValidToken(token)) {
      if (!redirectedRef.current) {
        redirectedRef.current = true;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("app-logout")); //  notify App
        toast.error("Session expired. Please login again.");
      }
      return;
    }

    const checkDetails = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}auth/check-details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && (data.result === "yes" || data.result === "no")) {
          setResult(data.result);
          if (data.result === "yes") {
            setDetails(data.Details);
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkDetails();

    // Prevent back navigation after logout
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      navigate(1);
    };

    return () => {
      window.onpopstate = null;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return result === "no" ? (
    <MultiStepForm
      onSuccess={() => {
        setResult("yes");
        window.location.reload();
      }}
    />
  ) : (
    <>
       <RecruiterDashNav details={details} />
      <div className="flex min-h-[80vh]">
        <RecruiterSidebar onLogout={handleLogout} />
        <main className="flex-1 p-6 bg-[#faf8ff] dark:bg-[#0f0f0f]">
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
};

export default CandidateLayout;