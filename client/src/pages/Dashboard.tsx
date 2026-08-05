import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/apiClient";
import { Farm, AdvisoryRequest } from "../types/advisory";
import WeatherWidget from "../components/ui/WeatherWidget";
import AdvisoryStatusBadge from "../components/ui/AdvisoryStatusBadge";
import {
  Tractor,
  PlusCircle,
  FileSpreadsheet,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
} from "lucide-react";

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();

  // Fetch farmer's farms
  const { data: farmsData, isLoading: isLoadingFarms } = useQuery({
    queryKey: ["farms"],
    queryFn: () => apiClient.get<{ farms: Farm[] }>("/farms"),
  });

  // Fetch recent advisory requests
  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["advisory-requests", "recent"],
    queryFn: () => apiClient.get<{ requests: AdvisoryRequest[] }>("/advisory-requests?limit=5"),
  });

  const farms = farmsData?.farms || [];
  const requests = requestsData?.requests || [];
  const primaryRegion = farms[0]?.region || profile?.default_region || "Punjab";

  return (
    <div className="space-y-8 py-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-agri-400">
            Farmer Control Center
          </span>
          <h1 className="text-3xl font-extrabold text-slate-100 mt-1">
            Welcome back, {profile?.full_name || "Farmer"}! 🌾
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your farms, request live Gemini agronomy diagnosis, and track market prices.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/farms/new"
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 flex items-center space-x-2 transition-colors"
          >
            <Tractor className="w-4 h-4 text-agri-400" />
            <span>Add New Farm</span>
          </Link>

          <Link
            to="/advisory/new"
            className="px-5 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white text-sm font-bold rounded-xl shadow-lg flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 glow-agri"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Advisory</span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Weather Snapshot + Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weather Snapshot Widget */}
        <div className="md:col-span-2">
          <WeatherWidget region={primaryRegion} />
        </div>

        {/* Quick Summary Stats */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Account Overview</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">Registered Farms</span>
              <span className="text-2xl font-extrabold text-agri-400 mt-1 block">
                {isLoadingFarms ? <Loader2 className="w-5 h-5 animate-spin" /> : farms.length}
              </span>
            </div>
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold block">AI Requests</span>
              <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                {isLoadingRequests ? <Loader2 className="w-5 h-5 animate-spin" /> : requests.length}
              </span>
            </div>
          </div>
          <Link
            to="/market-prices"
            className="text-xs font-semibold text-agri-400 hover:underline flex items-center justify-between pt-2 border-t border-slate-800/60"
          >
            <span>Check Current Crop Market Prices</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Active Farms Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Tractor className="w-5 h-5 text-agri-400" />
            <span>My Registered Farms ({farms.length})</span>
          </h2>
          <Link to="/farms" className="text-xs font-semibold text-agri-400 hover:underline flex items-center space-x-1">
            <span>View All Farms</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingFarms ? (
          <div className="p-8 text-center glass-card rounded-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-agri-400 mx-auto" />
            <p className="text-xs text-slate-400 mt-2">Loading farm profiles...</p>
          </div>
        ) : farms.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center space-y-4 border border-dashed border-slate-700">
            <div className="p-3 bg-agri-500/10 text-agri-400 rounded-full w-fit mx-auto">
              <Tractor className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">No Farms Registered Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Add your first farm profile with region, soil type, and acreage to receive personalized AI crop advisory reports.
              </p>
            </div>
            <Link
              to="/farms/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-agri-600 hover:bg-agri-500 text-white font-bold text-xs rounded-xl shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Register First Farm</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farms.slice(0, 3).map((farm) => (
              <div key={farm.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-100 text-base">{farm.name}</h3>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {farm.area_acres} Acres
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{farm.region} • {farm.soil_type}</p>
                  {farm.primary_crops?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {farm.primary_crops.map((c, i) => (
                        <span key={i} className="text-[10px] font-medium bg-agri-500/10 text-agri-300 px-2 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 pt-3 border-t border-slate-800/60">
                  <Link
                    to={`/farms/${farm.id}`}
                    className="flex-1 text-center py-1.5 bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-700"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/advisory/new?farmId=${farm.id}`}
                    className="flex-1 text-center py-1.5 bg-agri-600 text-white text-xs font-bold rounded-lg hover:bg-agri-500"
                  >
                    Advisory
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Advisory Requests Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-agri-400" />
            <span>Recent Advisory Reports</span>
          </h2>
          <Link to="/advisory/history" className="text-xs font-semibold text-agri-400 hover:underline flex items-center space-x-1">
            <span>Full History</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoadingRequests ? (
          <div className="p-6 text-center glass-card rounded-2xl">
            <Loader2 className="w-6 h-6 animate-spin text-agri-400 mx-auto" />
          </div>
        ) : requests.length === 0 ? (
          <div className="glass-card p-6 rounded-2xl text-center text-slate-400 text-xs">
            No advisory requests submitted yet. Click <strong>"New Advisory"</strong> above to consult the AI Agronomist.
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <Link
                key={req.id}
                to={`/advisory/${req.id}`}
                className="glass-card p-4 rounded-xl border border-slate-800 hover:border-agri-500/40 flex items-center justify-between gap-4 transition-all block group"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-slate-900 text-slate-300 rounded-xl group-hover:text-agri-400">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-100 group-hover:text-agri-300 transition-colors">
                      {req.title}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {req.advisory_domain.replace(/_/g, " ").toUpperCase()} • {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <AdvisoryStatusBadge status={req.status} />
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
