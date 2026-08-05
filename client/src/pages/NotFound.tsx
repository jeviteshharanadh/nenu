import React from "react";
import { Link } from "react-router-dom";
import { Sprout, ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="glass-card p-10 rounded-3xl border border-slate-800 space-y-4 max-w-md">
        <div className="p-4 bg-agri-500/10 text-agri-400 rounded-full w-fit mx-auto">
          <Sprout className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100">404</h1>
        <h2 className="text-lg font-bold text-slate-200">Page Not Found</h2>
        <p className="text-xs text-slate-400">
          The requested path does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-agri-600 hover:bg-agri-500 text-white text-xs font-bold rounded-xl shadow-md transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
