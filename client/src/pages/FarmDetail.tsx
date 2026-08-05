import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Farm, AdvisoryRequest } from "../types/advisory";
import WeatherWidget from "../components/ui/WeatherWidget";
import AdvisoryStatusBadge from "../components/ui/AdvisoryStatusBadge";
import {
  Tractor,
  MapPin,
  Layers,
  Droplet,
  PlusCircle,
  Edit3,
  ArrowLeft,
  Loader2,
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";

export const FarmDetail: React.FC = () => {
  const { farmId } = useParams<{ farmId: string }>();
  const navigate = useNavigate();

  const { data: farmData, isLoading: isLoadingFarm } = useQuery({
    queryKey: ["farm", farmId],
    queryFn: () => apiClient.get<{ farm: Farm }>(`/farms/${farmId}`),
    enabled: !!farmId,
  });

  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["advisory-requests", "farm", farmId],
    queryFn: () => apiClient.get<{ requests: AdvisoryRequest[] }>(`/advisory-requests?farmId=${farmId}`),
    enabled: !!farmId,
  });

  const farm = farmData?.farm;
  const requests = requestsData?.requests || [];

  if (isLoadingFarm) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Loading farm record...</p>
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="glass-card p-8 rounded-2xl text-center space-y-4 max-w-md mx-auto my-12">
        <h3 className="text-lg font-bold text-slate-100">Farm Not Found</h3>
        <p className="text-xs text-slate-400">The farm requested does not exist or you do not have permission.</p>
        <Link to="/farms" className="inline-block px-4 py-2 bg-agri-600 text-white font-bold text-xs rounded-xl">
          Back to My Farms
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Link to="/farms" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Farms</span>
      </Link>

      {/* Main Farm Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-agri-500/10 text-agri-400 rounded-2xl border border-agri-500/20">
              <Tractor className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100">{farm.name}</h1>
              <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                <MapPin className="w-3.5 h-3.5 text-agri-400" />
                <span>{farm.region}</span>
                {farm.latitude && <span>• GPS ({farm.latitude}, {farm.longitude})</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to={`/farms/${farm.id}/edit`}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Farm</span>
            </Link>

            <Link
              to={`/advisory/new?farmId=${farm.id}`}
              className="px-5 py-2 bg-gradient-to-r from-agri-600 to-agri-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-1.5 glow-agri"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Request Advisory</span>
            </Link>
          </div>
        </div>

        {/* Farm Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Total Area</span>
            <span className="text-lg font-extrabold text-slate-100 mt-1 block">{farm.area_acres} Acres</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Soil Type</span>
            <span className="text-base font-bold text-amber-300 mt-1 block">{farm.soil_type}</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Irrigation Source</span>
            <span className="text-base font-bold text-blue-300 mt-1 block">{farm.irrigation_source || "Not specified"}</span>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-semibold uppercase block">Primary Crops</span>
            <span className="text-xs font-semibold text-agri-300 mt-1 block truncate">
              {farm.primary_crops?.join(", ") || "None"}
            </span>
          </div>
        </div>

        {/* Weather Snapshot */}
        <WeatherWidget region={farm.region} />
      </div>

      {/* Advisory Requests History for this farm */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
          <FileSpreadsheet className="w-5 h-5 text-agri-400" />
          <span>Advisory History for {farm.name}</span>
        </h2>

        {isLoadingRequests ? (
          <div className="p-6 text-center">
            <Loader2 className="w-5 h-5 animate-spin text-agri-400 mx-auto" />
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl text-center text-slate-400 text-xs">
            No advisory requests submitted for this farm yet.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <Link
                key={req.id}
                to={`/advisory/${req.id}`}
                className="glass-card p-4 rounded-xl border border-slate-800 hover:border-agri-500/40 flex items-center justify-between gap-4 transition-all block group"
              >
                <div>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-agri-300">
                    {req.title}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {req.advisory_domain.replace(/_/g, " ").toUpperCase()} • {new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <AdvisoryStatusBadge status={req.status} />
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmDetail;
