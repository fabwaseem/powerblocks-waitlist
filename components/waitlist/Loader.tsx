import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-[#0a0a0a] text-white">
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default Loader;
