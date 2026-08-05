import React from "react";
import { Link } from "react-router-dom";
import { Farm } from "../../types/advisory";
import { Tractor, MapPin, Layers, Droplet, Sprout, PlusCircle, Trash2, Edit3 } from "lucide-react";

interface FarmCardProps {
  farm: Farm;
  onDelete?: (farmId: string) => void;
}

export const FarmCard: React.FC<FarmCardProps> = ({ farm, onDelete }) => {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative group">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-agri-500/10 text-agri-400 rounded-xl border border-agri-500/20 group-hover:scale-105 transition-transform">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100">{farm.name}</h3>
              <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-agri-400" />
                <span>{farm.region}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Link
              to={`/farms/${farm.id}/edit`}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Edit Farm"
            >
              <Edit3 className="w-4 h-4" />
            </Link>
            {onDelete && (
              <button
                onClick={() => onDelete(farm.id)}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                title="Delete Farm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Farm Area</span>
            <span className="text-slate-100 font-extrabold text-sm">{farm.area_acres} Acres</span>
          </div>

          <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 uppercase text-[10px] font-bold block">Soil Type</span>
            <div className="flex items-center space-x-1 text-amber-300 font-semibold mt-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span className="truncate">{farm.soil_type}</span>
            </div>
          </div>
        </div>

        {farm.irrigation_source && (
          <div className="flex items-center space-x-1.5 text-xs text-blue-300/90 mb-3 bg-blue-950/20 px-3 py-1.5 rounded-lg border border-blue-900/30">
            <Droplet className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate font-medium">Irrigation: {farm.irrigation_source}</span>
          </div>
        )}

        {Array.isArray(farm.primary_crops) && farm.primary_crops.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Sprout className="w-3.5 h-3.5 text-agri-400" />
              <span>Primary Crops</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {farm.primary_crops.map((crop, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-agri-500/10 text-agri-300 border border-agri-500/20"
                >
                  {crop}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <Link
          to={`/farms/${farm.id}`}
          className="flex-1 text-center py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
        >
          View Details
        </Link>
        <Link
          to={`/advisory/new?farmId=${farm.id}`}
          className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-agri-600 hover:bg-agri-500 text-white rounded-lg text-xs font-semibold shadow-md transition-all"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Get Advisory</span>
        </Link>
      </div>
    </div>
  );
};

export default FarmCard;
