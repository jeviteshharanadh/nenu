import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "../lib/supabaseClient";
import { apiClient } from "../lib/apiClient";
import { Sprout, LogIn, Loader2, AlertCircle } from "lucide-react";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authErr) {
        throw new Error(authErr.message);
      }

      if (authData.user) {
        // Bootstrap profile if missing
        await apiClient.post("/auth/bootstrap-profile", {}).catch(() => {});
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-agri-500/10 text-agri-400 rounded-2xl border border-agri-500/20 mb-2">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Farmer Login</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your farm dashboard</p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-rose-300 text-xs bg-rose-950/50 p-3 rounded-xl border border-rose-800">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email Address</label>
            <input
              type="email"
              placeholder="farmer@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm"
            />
            {errors.email && <p className="text-xs text-rose-400 mt-1">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm"
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
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Log In to Farm Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-agri-400 font-bold hover:underline">
            Register New Farm Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
