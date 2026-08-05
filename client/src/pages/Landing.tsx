import React from "react";
import { Link } from "react-router-dom";
import {
  Sprout,
  ShieldCheck,
  Bug,
  Droplets,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const Landing: React.FC = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center max-w-4xl mx-auto px-4 pt-12 pb-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-bold uppercase tracking-wider mb-6 glow-agri animate-pulse">
          <Sparkles className="w-4 h-4 text-agri-400" />
          <span>Powered by Google Gemini 2.5 Flash</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Your Digital Agronomist in the Field,{" "}
          <span className="bg-gradient-to-r from-agri-400 via-emerald-300 to-white bg-clip-text text-transparent">
            Available 24/7
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Instant, photo-based disease diagnosis, tailored fertilizer schedules, and market guidance — calibrated specifically for your farm's region and soil type.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white font-bold text-base rounded-xl shadow-xl shadow-agri-950/60 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 glow-agri"
          >
            <span>Register Your Farm Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-base rounded-xl border border-slate-700 transition-colors"
          >
            Sign In to Account
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left text-xs text-slate-300 pt-8 border-t border-slate-800/80">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-400 flex-shrink-0" />
            <span>Structured JSON Reports</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-400 flex-shrink-0" />
            <span>Multi-Photo Leaf Upload</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-400 flex-shrink-0" />
            <span>Weather-Aware Guidance</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-agri-400 flex-shrink-0" />
            <span>Multi-Language Output</span>
          </div>
        </div>
      </section>

      {/* Domain Highlights Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-100">7 Core Advisory Domains</h2>
          <p className="text-sm text-slate-400 mt-2">
            Complete lifecycle guidance from seed selection to post-harvest market timing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-xl w-fit mb-4 border border-rose-500/30">
              <Bug className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Pest & Disease Diagnosis</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Snap photos of affected leaves in your field. Gemini analyzes visual lesions and returns actionable step-by-step treatment and dosage guidelines.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-4 border border-blue-500/30">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Irrigation & Weather Context</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated weather snapshot integration ensures watering advice adapts to expected rainfall, humidity, and temperature.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <div className="p-3 bg-teal-500/20 text-teal-400 rounded-xl w-fit mb-4 border border-teal-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Market Price Grounding</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Compare regional market price benchmarks before selling produce. Get explicit sell vs. hold recommendations to maximize farm profits.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-agri-500/30 bg-gradient-to-r from-slate-900 via-agri-950/40 to-slate-900 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-extrabold text-slate-100 mb-4">
              Ready to Upgrade Your Farm Management?
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
              Join registered farmers receiving instant, accurate agricultural guidance. Setup takes less than 2 minutes.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-agri-500 hover:bg-agri-400 text-slate-950 font-extrabold text-base rounded-xl shadow-lg shadow-agri-950/60 transition-all glow-agri"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
