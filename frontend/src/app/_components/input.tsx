import { Input } from "../../components/ui/input";
import { Selects } from "../_components/select";
import { Search } from "lucide-react";

export function Inputs() {
  return (
    <div className="mt-7">
      <div className="flex items-center space-x-2 relative">
        <Selects />
        <Input
          type="text"
          placeholder="Enter the title, Keyword phrase"
          className="flex-1 "
        />
        <Search className="absolute flex justify-center items-center right-3 top-1/2 transform -translate-y-1/2 text-white-500 w-8 h-8  rounded-[50%] dark:bg-[#000000]" />
      </div>
    </div>
  );
}
