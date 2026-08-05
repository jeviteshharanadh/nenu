import React from "react";
import { AdvisoryDomain } from "../../types/advisory";
import {
  Bug,
  Sprout,
  TestTube,
  Droplet,
  Layers,
  CloudLightning,
  TrendingUp,
  CheckCircle,
} from "lucide-react";

interface DomainInfo {
  id: AdvisoryDomain;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  badge?: string;
}

export const DOMAINS_CONFIG: DomainInfo[] = [
  {
    id: "disease_pest_diagnosis",
    title: "Pest & Disease Diagnosis",
    subtitle: "Photo & Symptom Based Identification",
    description: "Upload leaf/stalk photos to identify fungal, bacterial, or pest issues and get exact chemical/organic treatment plans.",
    icon: Bug,
    color: "from-rose-500/20 to-rose-950/40 text-rose-400 border-rose-500/30",
    badge: "Photo Upload Ready",
  },
  {
    id: "crop_selection",
    title: "Crop Selection Advisor",
    subtitle: "Season & Soil Optimal Planting",
    description: "Find the most profitable and climate-suited crops based on your region, soil type, and upcoming season.",
    icon: Sprout,
    color: "from-emerald-500/20 to-emerald-950/40 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "fertilizer_nutrition",
    title: "Fertilizer & Nutrition",
    subtitle: "Dosage & Application Schedules",
    description: "Calculate precise fertilizer types (NPK, Urea, Micronutrients) and timing for seedling to maturity stages.",
    icon: TestTube,
    color: "from-amber-500/20 to-amber-950/40 text-amber-400 border-amber-500/30",
  },
  {
    id: "irrigation_water_management",
    title: "Irrigation & Water Strategy",
    subtitle: "Method & Interval Optimization",
    description: "Get tailored watering schedules based on crop growth phase, drip/flood methods, and regional weather.",
    icon: Droplet,
    color: "from-blue-500/20 to-blue-950/40 text-blue-400 border-blue-500/30",
  },
  {
    id: "soil_health",
    title: "Soil Health & Improvement",
    subtitle: "pH Balance & Organic Conditioning",
    description: "Interpret soil symptoms or pH test results to build a multi-stage organic and bio-fertilizer soil plan.",
    icon: Layers,
    color: "from-amber-700/20 to-amber-950/40 text-amber-300 border-amber-600/30",
  },
  {
    id: "weather_risk_advisory",
    title: "Weather Risk Protection",
    subtitle: "Frost, Flood & Wind Mitigation",
    description: "Short-term risk mitigation strategies against unexpected frost, unseasonal rainfall, or heatwaves.",
    icon: CloudLightning,
    color: "from-purple-500/20 to-purple-950/40 text-purple-400 border-purple-500/30",
  },
  {
    id: "market_post_harvest",
    title: "Market & Post-Harvest",
    subtitle: "Sell vs Hold & Storage Guidance",
    description: "Determine the best selling window, storage procedures, and estimated revenue range based on market prices.",
    icon: TrendingUp,
    color: "from-teal-500/20 to-teal-950/40 text-teal-400 border-teal-500/30",
  },
];

interface AdvisoryDomainPickerProps {
  selectedDomain: AdvisoryDomain | null;
  onSelectDomain: (domain: AdvisoryDomain) => void;
}

export const AdvisoryDomainPicker: React.FC<AdvisoryDomainPickerProps> = ({
  selectedDomain,
  onSelectDomain,
}) => {
  return (
    <div className="space-y-4">
      <div className="text-center max-w-2xl mx-auto mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Select Advisory Category</h2>
        <p className="text-sm text-slate-400 mt-1">
          Choose the agricultural domain that matches your immediate farming need.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS_CONFIG.map((domain) => {
          const Icon = domain.icon;
          const isSelected = selectedDomain === domain.id;

          return (
            <div
              key={domain.id}
              onClick={() => onSelectDomain(domain.id)}
              className={`glass-card p-5 rounded-2xl cursor-pointer transition-all relative border flex flex-col justify-between ${
                isSelected
                  ? "bg-agri-950/60 border-agri-500 ring-2 ring-agri-500/40 shadow-xl"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-agri-400">
                  <CheckCircle className="w-5 h-5 fill-agri-500/20" />
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br border ${domain.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{domain.title}</h3>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {domain.subtitle}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {domain.description}
                </p>
              </div>

              {domain.badge && (
                <div className="mt-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {domain.badge}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdvisoryDomainPicker;
