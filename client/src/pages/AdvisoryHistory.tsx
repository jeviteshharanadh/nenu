import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { AdvisoryRequest, Farm, AdvisoryDomain } from "../types/advisory";
import AdvisoryStatusBadge from "../components/ui/AdvisoryStatusBadge";
import { DOMAINS_CONFIG } from "../components/advisory/AdvisoryDomainPicker";
import {
  FileSpreadsheet,
  Filter,
  PlusCircle,
  Loader2,
  ChevronRight,
  Search,
} from "lucide-react";

export const AdvisoryHistory: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch farms for filter dropdown
  const { data: farmsData } = useQuery({
    queryKey: ["farms"],
    queryFn: () => apiClient.get<{ farms: Farm[] }>("/farms"),
  });

  // Fetch requests with filters
  const { data: requestsData, isLoading } = useQuery({
    queryKey: ["advisory-requests", selectedFarm, selectedDomain, selectedStatus],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedFarm) params.append("farmId", selectedFarm);
      if (selectedDomain) params.append("domain", selectedDomain);
      if (selectedStatus) params.append("status", selectedStatus);
      return apiClient.get<{ requests: AdvisoryRequest[] }>(`/advisory-requests?${params.toString()}`);
    },
  });

  const farms = farmsData?.farms || [];
  const requests = requestsData?.requests || [];

  const filteredRequests = requests.filter(
    (r) =>
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
            <FileSpreadsheet className="w-6 h-6 text-agri-400" />
            <span>Advisory History Archive</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological record of all AI crop advisory requests and generated reports
          </p>
        </div>

        <Link
          to="/advisory/new"
          className="px-5 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 w-fit transition-all glow-agri"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Advisory Request</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-lg pl-9 pr-3 py-2 text-xs"
          />
        </div>

        {/* Farm Filter */}
        <select
          value={selectedFarm}
          onChange={(e) => setSelectedFarm(e.target.value)}
          className="glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
        >
          <option value="">All Farms</option>
          {farms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        {/* Domain Filter */}
        <select
          value={selectedDomain}
          onChange={(e) => setSelectedDomain(e.target.value)}
          className="glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
        >
          <option value="">All Advisory Domains</option>
          {DOMAINS_CONFIG.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="glass-input rounded-lg px-3 py-2 text-xs bg-slate-900"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Table / List */}
      {isLoading ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading advisory archive...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-700 max-w-xl mx-auto">
          <FileSpreadsheet className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-100">No Advisories Found</h3>
          <p className="text-xs text-slate-400">
            No advisory requests match your current filters. Try resetting search filters or submit a new request.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <Link
              key={req.id}
              to={`/advisory/${req.id}`}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-agri-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all block group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-900 text-agri-400 rounded-xl group-hover:bg-agri-500/10 transition-colors flex-shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-agri-400 bg-agri-500/10 px-2 py-0.5 rounded border border-agri-500/20">
                      {req.advisory_domain.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-slate-400">• {new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-agri-300 transition-colors mt-1">
                    {req.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{req.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800/60">
                <AdvisoryStatusBadge status={req.status} />
                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-200" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvisoryHistory;
