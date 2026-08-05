import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabaseClient";
import { apiClient } from "../lib/apiClient";
import { Sprout, UserPlus, Loader2, AlertCircle } from "lucide-react";

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      default_region: "Punjab",
      preferred_language: "en",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      // Sign up with Supabase Auth
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authErr) {
        throw new Error(authErr.message);
      }

      if (authData.user) {
        // Call backend profile bootstrap endpoint
        await apiClient.post("/auth/bootstrap-profile", {
          full_name: data.full_name,
          phone: data.phone,
          preferred_language: data.preferred_language,
          default_region: data.default_region,
        });

        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-agri-500/10 text-agri-400 rounded-2xl border border-agri-500/20 mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Farmer Registration</h2>
          <p className="text-xs text-slate-400">Create a profile to unlock AI crop advisory reports</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-300 text-xs bg-rose-950/50 p-3 rounded-xl border border-rose-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Patel"
              {...register("full_name", { required: "Full name is required" })}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
            />
            {errors.full_name && <p className="text-xs text-rose-400 mt-1">{errors.full_name.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message as string}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                {...register("phone")}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Default Region</label>
              <input
                type="text"
                placeholder="e.g. Punjab"
                {...register("default_region")}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password *</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
              className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
            />
            {errors.password && <p className="text-xs text-rose-400 mt-1">{errors.password.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 bg-agri-600 hover:bg-agri-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-agri-950/50 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Register & Create Profile</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <span>Already registered? </span>
          <Link to="/login" className="text-agri-400 font-bold hover:underline">
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
