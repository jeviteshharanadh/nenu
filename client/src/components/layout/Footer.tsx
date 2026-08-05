import React from "react";
import { Sprout } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 mt-auto py-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-agri-500" />
          <span className="font-semibold text-slate-200">AgriAdvisor AI</span>
          <span>&mdash; Empowering Farmers with Gemini 2.5 Intelligence</span>
        </div>
        <div className="flex items-center space-x-6 text-slate-400">
          <span>Server-Side Structured Guidance</span>
          <span>•</span>
          <span>Zero Hallucination Schema Constraints</span>
          <span>•</span>
          <span>Mobile Ready</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
