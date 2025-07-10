import { HeroHighlight, Highlight } from "../../components/ui/hero-highlight";
import { Inputs } from "../_components/input";

function herotitle() {
  return (
    <>
      <HeroHighlight className="flex flex-col justify-center items-center  text-center">
        <span className="text-5xl mb-4">
          Connect with top Opportunities and
        </span>
        <Highlight className="text-black dark:text-white text-5xl">
          leading companies
        </Highlight>

        <p className="mt-8 text-gray-800 text-[20px] dark:text-white">
          Your path to exciting internships starts with us.
        </p>
        <Inputs />
        <div className="flex flex-row justify-center items-center mt-3.5">
          <p className=" text-gray-800 text-[14px] dark:text-white">
            Popular Searches:{" "}
          </p>
          <div className="text-[12px] flex flex-row gap-3 underline ml-3">
            {[
              "Business develpoment",
              "UI/UX Design",
              "Frontend",
              "Backend",
            ].map((tag, index) => (
              <span key={index}>{tag}</span>
            ))}
          </div>
        </div>
      </HeroHighlight>
    </>
  );
}

export default herotitle;
