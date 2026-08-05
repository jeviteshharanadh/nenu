import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { TrendingUp, Search, Calendar, MapPin, Loader2 } from "lucide-react";

interface MarketPriceItem {
  id: string;
  crop_name: string;
  region: string;
  price_per_kg: number;
  unit: string;
  recorded_date: string;
}

export const MarketPrices: React.FC = () => {
  const [cropFilter, setCropFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["market-prices", cropFilter, regionFilter],
    queryFn: () => {
      const params = new URLSearchParams();
      if (cropFilter) params.append("crop", cropFilter);
      if (regionFilter) params.append("region", regionFilter);
      return apiClient.get<{ marketPrices: MarketPriceItem[] }>(`/market-prices?${params.toString()}`);
    },
  });

  const prices = data?.marketPrices || [];

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-agri-400" />
            <span>Crop Market Price Reference Table</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Grounding price data used by Gemini AI when evaluating post-harvest selling advice
          </p>
        </div>
      </div>

      {/* Filter inputs */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by crop name (e.g. Wheat, Paddy, Tomato)..."
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs"
          />
        </div>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Filter by region (e.g. Punjab, Haryana, Gujarat)..."
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      {/* Price Table */}
      {isLoading ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading market prices...</p>
        </div>
      ) : prices.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center text-slate-400 text-xs">
          No market prices recorded matching your filter.
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-4">Crop Name</th>
                  <th className="p-4">Region / Market</th>
                  <th className="p-4">Price / Unit</th>
                  <th className="p-4">Recorded Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {prices.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/80 transition-colors">
                    <td className="p-4 font-bold text-slate-100">{p.crop_name}</td>
                    <td className="p-4 text-slate-300 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-agri-400" />
                      <span>{p.region}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-base font-extrabold text-emerald-400">
                        ₹{p.price_per_kg.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">/ {p.unit}</span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{p.recorded_date}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketPrices;
