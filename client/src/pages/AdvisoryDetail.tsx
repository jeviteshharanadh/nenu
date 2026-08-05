import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { AdvisoryRequest } from "../types/advisory";
import AdvisoryStatusBadge from "../components/ui/AdvisoryStatusBadge";
import AdvisoryReportCard from "../components/advisory/AdvisoryReportCard";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  AlertCircle,
  Clock,
  Tractor,
  Calendar,
  Layers,
  Image as ImageIcon,
} from "lucide-react";

export const AdvisoryDetail: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["advisory-request", requestId],
    queryFn: () => apiClient.get<{ request: AdvisoryRequest }>(`/advisory-requests/${requestId}`),
    enabled: !!requestId,
    // Poll status every 2.5s while pending or processing
    refetchInterval: (query) => {
      const status = query.state.data?.request?.status;
      if (status === "pending" || status === "processing") {
        return 2500;
      }
      return false;
    },
  });

  const retryMutation = useMutation({
    mutationFn: () => apiClient.post(`/advisory-requests/${requestId}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["advisory-request", requestId] });
      refetch();
    },
  });

  const request = data?.request;

  if (isLoading) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Fetching advisory request record...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Advisory Request Not Found</h3>
        <p className="text-xs text-slate-400">The request may not exist or you do not have permission.</p>
        <Link to="/advisory/history" className="inline-block px-4 py-2 bg-agri-600 text-white text-xs font-bold rounded-xl">
          Back to Advisory History
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/advisory/history" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Advisories</span>
        </Link>

        <AdvisoryStatusBadge status={request.status} />
      </div>

      {/* Summary Card */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-agri-400">
              {request.advisory_domain.replace(/_/g, " ")}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-100 mt-0.5">{request.title}</h1>
          </div>

          <div className="text-xs text-slate-400 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Submitted {new Date(request.created_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Farmer Context Snippet */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Farmer Description</span>
          <p className="text-sm text-slate-200 leading-relaxed">{request.description}</p>
        </div>

        {/* Request Context Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-semibold">Farm</span>
            <span className="text-slate-200 font-bold">{request.farm?.name || "Target Farm"}</span>
          </div>
          <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block font-semibold">Urgency</span>
            <span className="text-amber-300 font-bold uppercase">{request.urgency}</span>
          </div>
          {request.crop_type && (
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">Crop</span>
              <span className="text-slate-200 font-bold">{request.crop_type}</span>
            </div>
          )}
          {request.growth_stage && (
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">Stage</span>
              <span className="text-slate-200 font-bold capitalize">{request.growth_stage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Processing State Indicator */}
      {(request.status === "pending" || request.status === "processing") && (
        <div className="glass-card p-8 rounded-3xl text-center space-y-4 border border-blue-500/30 bg-blue-950/20">
          <Loader2 className="w-10 h-10 animate-spin text-agri-400 mx-auto" />
          <div>
            <h3 className="text-lg font-bold text-slate-100">Gemini Agronomist is Analyzing Your Request</h3>
            <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
              Our server-side pipeline is building contextual prompts with farm soil data, region weather snapshots, and schema constraints.
            </p>
          </div>
          <p className="text-[11px] text-slate-400 italic">Page automatically refreshes every 2.5 seconds...</p>
        </div>
      )}

      {/* Failure State */}
      {request.status === "failed" && (
        <div className="glass-card p-8 rounded-3xl border border-rose-800 bg-rose-950/20 space-y-4">
          <div className="flex items-center space-x-3 text-rose-400">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold">AI Generation Failed</h3>
              <p className="text-xs text-rose-300 mt-0.5">
                {request.failure_reason || "The AI system encountered an unexpected error processing your prompt."}
              </p>
            </div>
          </div>

          <button
            onClick={() => retryMutation.mutate()}
            disabled={retryMutation.isPending}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${retryMutation.isPending ? "animate-spin" : ""}`} />
            <span>Retry AI Advisory Pipeline</span>
          </button>
        </div>
      )}

      {/* Completed State: Render AI Report Card */}
      {request.status === "completed" && request.report && (
        <AdvisoryReportCard
          domain={request.advisory_domain}
          reportJson={request.report.report_json}
          summary={request.report.summary}
          generatedAt={request.report.generated_at}
          modelName={request.report.model_name}
          language={request.report.language}
        />
      )}
    </div>
  );
};

export default AdvisoryDetail;
