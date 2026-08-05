import React from "react";
import { useForm } from "react-hook-form";
import { Farm } from "../../types/advisory";
import { Loader2, Save, Tractor } from "lucide-react";

interface FarmFormProps {
  initialValues?: Partial<Farm>;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  submitLabel?: string;
}

export const FarmForm: React.FC<FarmFormProps> = ({
  initialValues,
  onSubmit,
  isLoading,
  submitLabel = "Save Farm Profile",
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: initialValues?.name || "",
      region: initialValues?.region || "",
      area_acres: initialValues?.area_acres || 5.0,
      soil_type: initialValues?.soil_type || "Clay Loam",
      irrigation_source: initialValues?.irrigation_source || "Borewell / Groundwater",
      primary_crops_input: Array.isArray(initialValues?.primary_crops)
        ? initialValues?.primary_crops.join(", ")
        : "Wheat, Paddy Rice, Mustard",
      latitude: initialValues?.latitude || "",
      longitude: initialValues?.longitude || "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    const cropsArray = data.primary_crops_input
      ? data.primary_crops_input.split(",").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const payload = {
      name: data.name,
      region: data.region,
      area_acres: Number(data.area_acres),
      soil_type: data.soil_type,
      irrigation_source: data.irrigation_source || null,
      primary_crops: cropsArray,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-agri-500/10 text-agri-400 rounded-xl border border-agri-500/20">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Farm Baseline Information</h3>
            <p className="text-xs text-slate-400">Used by Gemini AI to calibrate crop and irrigation advice</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farm Name */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Farm Name *</label>
            <input
              type="text"
              placeholder="e.g. Green Valley Farm #1"
              {...register("name", { required: "Farm name is required" })}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name.message as string}</p>}
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Region / District / State *</label>
            <input
              type="text"
              placeholder="e.g. Punjab, Ludhiana / Texas, Travis"
              {...register("region", { required: "Region is required" })}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            />
            {errors.region && <p className="text-xs text-rose-400 mt-1">{errors.region.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Farm Area */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Area (Acres) *</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              {...register("area_acres", {
                required: "Area is required",
                valueAsNumber: true,
                min: { value: 0.01, message: "Area must be greater than 0" },
              })}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            />
            {errors.area_acres && <p className="text-xs text-rose-400 mt-1">{errors.area_acres.message as string}</p>}
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Soil Type *</label>
            <select {...register("soil_type")} className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm">
              <option value="Clay Loam" className="bg-slate-900">Clay Loam</option>
              <option value="Sandy Loam" className="bg-slate-900">Sandy Loam</option>
              <option value="Black Cotton Soil" className="bg-slate-900">Black Cotton Soil</option>
              <option value="Alluvial Soil" className="bg-slate-900">Alluvial Soil</option>
              <option value="Red Sandy Soil" className="bg-slate-900">Red Sandy Soil</option>
              <option value="Silt Loam" className="bg-slate-900">Silt Loam</option>
              <option value="Peaty / Acidic Soil" className="bg-slate-900">Peaty / Acidic Soil</option>
            </select>
          </div>

          {/* Irrigation Source */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Irrigation Source</label>
            <input
              type="text"
              placeholder="e.g. Canal water, Borewell, Rainfed"
              {...register("irrigation_source")}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            />
          </div>
        </div>

        {/* Primary Crops */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Primary Crops Grown <span className="text-slate-500">(comma-separated)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Wheat, Paddy Rice, Mustard, Chickpea"
            {...register("primary_crops_input")}
            className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
          />
        </div>

        {/* Optional GPS Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Latitude (Optional GPS)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 30.900965"
              {...register("latitude")}
              className="w-full glass-input rounded-lg px-3.5 py-2 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Longitude (Optional GPS)</label>
            <input
              type="number"
              step="any"
              placeholder="e.g. 75.857277"
              {...register("longitude")}
              className="w-full glass-input rounded-lg px-3.5 py-2 text-xs"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 bg-agri-600 hover:bg-agri-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-agri-950/50 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Saving Farm Record...</span>
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            <span>{submitLabel}</span>
          </>
        )}
      </button>
    </form>
  );
};

export default FarmForm;
