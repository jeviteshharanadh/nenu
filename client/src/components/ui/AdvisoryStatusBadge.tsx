import React from "react";
import { Clock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export type StatusType = "pending" | "processing" | "completed" | "failed";

interface AdvisoryStatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const AdvisoryStatusBadge: React.FC<AdvisoryStatusBadgeProps> = ({ status, className = "" }) => {
  switch (status) {
    case "pending":
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 ${className}`}>
          <Clock className="w-3.5 h-3.5" />
          <span>Pending</span>
        </span>
      );
    case "processing":
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 ${className}`}>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>AI Analyzing...</span>
        </span>
      );
    case "completed":
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Completed</span>
        </span>
      );
    case "failed":
      return (
        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30 ${className}`}>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Failed</span>
        </span>
      );
    default:
      return null;
  }
};

export default AdvisoryStatusBadge;
