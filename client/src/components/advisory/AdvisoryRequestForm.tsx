import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AdvisoryDomain, Farm } from "../../types/advisory";
import ImageUploader from "../ui/ImageUploader";
import { Send, Loader2, AlertCircle, HelpCircle } from "lucide-react";

interface AdvisoryRequestFormProps {
  farms: Farm[];
  initialFarmId?: string;
  domain: AdvisoryDomain;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

export const AdvisoryRequestForm: React.FC<AdvisoryRequestFormProps> = ({
  farms,
  initialFarmId,
  domain,
  onSubmit,
  isLoading,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      farm_id: initialFarmId || (farms[0]?.id ?? ""),
      title: "",
      description: "",
      urgency: "medium",
      crop_type: farms[0]?.primary_crops?.[0] || "",
      growth_stage: "vegetative",
      target_season: "kharif",
      available_water_source: "Borewell / Tube well",
      symptoms_observed: "",
      first_noticed_days_ago: 3,
      last_fertilizer_applied: "",
      last_applied_days_ago: 14,
      current_irrigation_method: "drip",
      soil_test_available: false,
      soil_ph: 6.8,
      visible_soil_issues: "",
      expected_harvest_date: "",
      quantity_estimate_kg: 1000,
    },
  });

  const onFormSubmit = async (data: any) => {
    try {
      setError(null);
      const formData = new FormData();

      // Append base fields
      formData.append("farm_id", data.farm_id);
      formData.append("advisory_domain", domain);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("urgency", data.urgency);

      // Append domain-specific conditional fields
      if (data.crop_type) formData.append("crop_type", data.crop_type);
      if (data.growth_stage) formData.append("growth_stage", data.growth_stage);

      if (domain === "crop_selection") {
        if (data.target_season) formData.append("target_season", data.target_season);
        if (data.available_water_source) formData.append("available_water_source", data.available_water_source);
      }

      if (domain === "disease_pest_diagnosis") {
        if (data.symptoms_observed) {
          const tags = data.symptoms_observed.split(",").map((s: string) => s.trim()).filter(Boolean);
          formData.append("symptoms_observed", JSON.stringify(tags));
        }
        if (data.first_noticed_days_ago) formData.append("first_noticed_days_ago", data.first_noticed_days_ago.toString());
      }

      if (domain === "fertilizer_nutrition") {
        if (data.last_fertilizer_applied) formData.append("last_fertilizer_applied", data.last_fertilizer_applied);
        if (data.last_applied_days_ago) formData.append("last_applied_days_ago", data.last_applied_days_ago.toString());
      }

      if (domain === "irrigation_water_management") {
        if (data.current_irrigation_method) formData.append("current_irrigation_method", data.current_irrigation_method);
      }

      if (domain === "soil_health") {
        formData.append("soil_test_available", data.soil_test_available ? "true" : "false");
        if (data.soil_ph) formData.append("soil_ph", data.soil_ph.toString());
        if (data.visible_soil_issues) {
          const tags = data.visible_soil_issues.split(",").map((s: string) => s.trim()).filter(Boolean);
          formData.append("visible_soil_issues", JSON.stringify(tags));
        }
      }

      if (domain === "market_post_harvest") {
        if (data.expected_harvest_date) formData.append("expected_harvest_date", data.expected_harvest_date);
        if (data.quantity_estimate_kg) formData.append("quantity_estimate_kg", data.quantity_estimate_kg.toString());
      }

      // Append image files
      images.forEach((file) => {
        formData.append("images", file);
      });

      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {error && (
        <div className="flex items-center space-x-2 text-rose-300 text-sm bg-rose-950/50 p-4 rounded-xl border border-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Base Section */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>General Request Details</span>
          <span className="text-xs uppercase tracking-wider text-agri-400 font-semibold">Step 1 of 2</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farm Select */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Farm *</label>
            <select
              {...register("farm_id", { required: "Please select a farm" })}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-slate-100">
                  {f.name} ({f.region} - {f.area_acres} acres)
                </option>
              ))}
            </select>
            {errors.farm_id && <p className="text-xs text-rose-400 mt-1">{errors.farm_id.message as string}</p>}
          </div>

          {/* Urgency */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Urgency Level *</label>
            <select
              {...register("urgency")}
              className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
            >
              <option value="low" className="bg-slate-900">Low (Routine Planning)</option>
              <option value="medium" className="bg-slate-900">Medium (Normal Request)</option>
              <option value="high" className="bg-slate-900">High (Active Damage / Emergency)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Advisory Title / Summary *</label>
          <input
            type="text"
            placeholder="e.g. Yellowing spots on wheat leaves after heavy rain"
            {...register("title", {
              required: "Title is required",
              maxLength: { value: 120, message: "Max 120 characters allowed" },
            })}
            className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
          />
          {errors.title && <p className="text-xs text-rose-400 mt-1">{errors.title.message as string}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Detailed Description & Field Observations * <span className="text-slate-500">(Min 20 chars)</span>
          </label>
          <textarea
            rows={4}
            placeholder="Describe what you see in the field, recent rainfall, previous crops, or specific questions you want the AI Agronomist to answer..."
            {...register("description", {
              required: "Description is required",
              minLength: { value: 20, message: "Please provide at least 20 characters of detail" },
              maxLength: { value: 2000, message: "Max 2000 characters allowed" },
            })}
            className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
          />
          {errors.description && <p className="text-xs text-rose-400 mt-1">{errors.description.message as string}</p>}
        </div>
      </div>

      {/* Domain Specific Fields */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-slate-100 border-b border-slate-800 pb-3 flex items-center justify-between">
          <span>Domain Context: {domain.replace(/_/g, " ").toUpperCase()}</span>
          <span className="text-xs uppercase tracking-wider text-agri-400 font-semibold">Step 2 of 2</span>
        </h3>

        {/* Crop Type & Growth Stage (for most domains) */}
        {domain !== "soil_health" && domain !== "crop_selection" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Crop Type *</label>
              <input
                type="text"
                placeholder="e.g. Wheat, Cotton, Tomato, Paddy Rice"
                {...register("crop_type", { required: "Crop type is required" })}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
              {errors.crop_type && <p className="text-xs text-rose-400 mt-1">{errors.crop_type.message as string}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Current Growth Stage *</label>
              <select {...register("growth_stage")} className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm">
                <option value="seedling" className="bg-slate-900">Seedling / Germination</option>
                <option value="vegetative" className="bg-slate-900">Vegetative Growth</option>
                <option value="flowering" className="bg-slate-900">Flowering / Budding</option>
                <option value="fruiting" className="bg-slate-900">Fruiting / Grain Filling</option>
                <option value="maturity" className="bg-slate-900">Maturity / Harvest Ready</option>
              </select>
            </div>
          </div>
        )}

        {/* Crop Selection Conditional Fields */}
        {domain === "crop_selection" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Target Season</label>
              <select {...register("target_season")} className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm">
                <option value="kharif" className="bg-slate-900">Kharif (Monsoon Crop)</option>
                <option value="rabi" className="bg-slate-900">Rabi (Winter Crop)</option>
                <option value="zaid" className="bg-slate-900">Zaid (Summer Crop)</option>
                <option value="year-round" className="bg-slate-900">Year-round / Perennial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Available Water Source</label>
              <input
                type="text"
                placeholder="e.g. Rainfed, Borewell, Canal water"
                {...register("available_water_source")}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {/* Disease / Pest Diagnosis Conditional Fields */}
        {domain === "disease_pest_diagnosis" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Symptoms Observed <span className="text-slate-500">(comma-separated tags)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Yellow leaf edges, black spots, wilting, insect holes"
                  {...register("symptoms_observed")}
                  className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">First Noticed (Days Ago)</label>
                <input
                  type="number"
                  min={0}
                  max={365}
                  {...register("first_noticed_days_ago", { valueAsNumber: true })}
                  className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
                />
              </div>
            </div>

            {/* Photo Uploader */}
            <ImageUploader files={images} onChange={setImages} maxFiles={3} maxSizeMB={5} />
          </div>
        )}

        {/* Fertilizer & Nutrition Conditional Fields */}
        {domain === "fertilizer_nutrition" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last Fertilizer Applied</label>
              <input
                type="text"
                placeholder="e.g. Urea 50kg, DAP, FYM compost"
                {...register("last_fertilizer_applied")}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Last Applied (Days Ago)</label>
              <input
                type="number"
                min={0}
                max={365}
                {...register("last_applied_days_ago", { valueAsNumber: true })}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {/* Irrigation Conditional Fields */}
        {domain === "irrigation_water_management" && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Current Irrigation Method</label>
            <select {...register("current_irrigation_method")} className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm">
              <option value="drip" className="bg-slate-900">Drip Irrigation</option>
              <option value="sprinkler" className="bg-slate-900">Sprinkler System</option>
              <option value="flood" className="bg-slate-900">Flood / Furrow Irrigation</option>
              <option value="rainfed" className="bg-slate-900">Rainfed / Natural</option>
              <option value="manual" className="bg-slate-900">Manual Hose / Bucket</option>
            </select>
          </div>
        )}

        {/* Soil Health Conditional Fields */}
        {domain === "soil_health" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Estimated / Lab Soil pH</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  {...register("soil_ph", { valueAsNumber: true })}
                  className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
                />
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center space-x-2 text-sm text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register("soil_test_available")}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-agri-500 focus:ring-agri-500"
                  />
                  <span>I have a laboratory soil test report available</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Visible Soil Issues <span className="text-slate-500">(comma-separated)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. White salt crusting, severe compaction, slow water drainage"
                {...register("visible_soil_issues")}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}

        {/* Market & Post Harvest Conditional Fields */}
        {domain === "market_post_harvest" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Expected Harvest Date</label>
              <input
                type="date"
                {...register("expected_harvest_date")}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Estimated Produce Quantity (KG)</label>
              <input
                type="number"
                min="1"
                {...register("quantity_estimate_kg", { valueAsNumber: true })}
                className="w-full glass-input rounded-lg px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 bg-gradient-to-r from-agri-600 via-agri-500 to-emerald-400 hover:from-agri-500 hover:to-agri-300 text-white font-bold text-base rounded-xl shadow-xl shadow-agri-950/50 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed glow-agri"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending Data & Consulting Gemini Agronomist...</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Submit Request for AI Analysis</span>
          </>
        )}
      </button>
    </form>
  );
};

export default AdvisoryRequestForm;
