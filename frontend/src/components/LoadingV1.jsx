import { Loader2 } from "lucide-react";
import React from "react";

const LoadingV1 = () => {
  return (
    <div className="container mx-auto space-y-6 p-4 h-screen flex items-center justify-center">
      <Loader2 className="mr-2 h-10 w-10 animate-spin" />
      Please wait
    </div>
  );
};

export default LoadingV1;
