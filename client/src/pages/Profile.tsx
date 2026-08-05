import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { apiClient } from "../lib/apiClient";
import { User, Save, Loader2, CheckCircle2, Languages, ShieldCheck } from "lucide-react";

export const Profile: React.FC = () => {
  const { profile, refetchProfile } = useAuth();
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      default_region: profile?.default_region || "",
      preferred_language: profile?.preferred_language || "en",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setSuccess(false);
      await apiClient.patch("/profile", data);
      await refetchProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(`Profile update failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-6 max-w-2xl mx-auto">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center justify-center space-x-2">
          <User className="w-6 h-6 text-agri-400" />
          <span>Farmer Profile Settings</span>
        </h1>
        <p className="text-xs text-slate-400">
          Manage your personal details, preferred AI language, and regional defaults
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 text-emerald-300 text-xs bg-emerald-950/50 p-4 rounded-xl border border-emerald-800 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>Profile updated successfully! AI reports will use your preferred settings.</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-agri-400">Personal Account</span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded">
            Role: {profile?.role || "farmer"}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name *</label>
          <input
            type="text"
            {...register("full_name", { required: "Full name is required" })}
            className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
          />
          {errors.full_name && <p className="text-xs text-rose-400 mt-1">{errors.full_name.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Default Region</label>
            <input
              type="text"
              placeholder="e.g. Punjab, Ludhiana"
              {...register("default_region")}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase mb-1 flex items-center space-x-1">
            <Languages className="w-4 h-4 text-agri-400" />
            <span>Preferred Language for AI Reports</span>
          </label>
          <select {...register("preferred_language")} className="w-full glass-input rounded-xl px-4 py-2.5 text-sm">
            <option value="en" className="bg-slate-900">English</option>
            <option value="hi" className="bg-slate-900">हिंदी (Hindi)</option>
            <option value="te" className="bg-slate-900">తెలుగు (Telugu)</option>
            <option value="ta" className="bg-slate-900">தமிழ் (Tamil)</option>
            <option value="mr" className="bg-slate-900">मराठी (Marathi)</option>
            <option value="pa" className="bg-slate-900">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="bn" className="bg-slate-900">বাংলা (Bengali)</option>
            <option value="es" className="bg-slate-900">Español (Spanish)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-1">
            Gemini AI will translate technical advisory text into this language.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 bg-agri-600 hover:bg-agri-500 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all mt-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Saving Profile...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Save Profile Changes</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
