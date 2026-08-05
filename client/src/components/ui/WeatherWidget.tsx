import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../lib/apiClient";
import { CloudSun, Thermometer, Droplets, CloudRain, AlertTriangle, Loader2 } from "lucide-react";

interface WeatherWidgetProps {
  region: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ region }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["weather", region],
    queryFn: () => apiClient.get<{ weather: any }>(`/weather/${encodeURIComponent(region)}`),
    enabled: !!region,
  });

  if (isLoading) {
    return (
      <div className="glass-card p-4 rounded-xl flex items-center space-x-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin text-agri-400" />
        <span className="text-xs">Fetching weather snapshot for {region}...</span>
      </div>
    );
  }

  if (error || !data?.weather) {
    return null;
  }

  const weather = data.weather;

  return (
    <div className="glass-card p-4 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-agri-500/10 text-agri-400 rounded-lg">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Farm Weather Snapshot</h4>
            <p className="text-sm font-semibold text-slate-100">{region}</p>
          </div>
        </div>

        {weather.pest_risk === "high" && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3 h-3" />
            <span>High Pest Risk</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
          <div className="flex items-center justify-center space-x-1 text-amber-400 text-xs mb-0.5">
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </div>
          <span className="text-base font-bold text-slate-100">{weather.temperature_c}°C</span>
        </div>

        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
          <div className="flex items-center justify-center space-x-1 text-blue-400 text-xs mb-0.5">
            <Droplets className="w-3.5 h-3.5" />
            <span>Humidity</span>
          </div>
          <span className="text-base font-bold text-slate-100">{weather.humidity_pct}%</span>
        </div>

        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60">
          <div className="flex items-center justify-center space-x-1 text-teal-400 text-xs mb-0.5">
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain</span>
          </div>
          <span className="text-base font-bold text-slate-100">{weather.rainfall_forecast_mm}mm</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-2.5 italic">"{weather.summary}"</p>
    </div>
  );
};

export default WeatherWidget;
