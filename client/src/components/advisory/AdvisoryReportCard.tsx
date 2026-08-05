import React from "react";
import { AdvisoryDomain } from "../../types/advisory";
import {
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Droplet,
  TestTube,
  Layers,
  Sprout,
  Calendar,
  DollarSign,
  Info,
} from "lucide-react";

interface AdvisoryReportCardProps {
  domain: AdvisoryDomain;
  reportJson: any;
  summary: string;
  generatedAt: string;
  modelName?: string;
  language?: string;
}

export const AdvisoryReportCard: React.FC<AdvisoryReportCardProps> = ({
  domain,
  reportJson,
  summary,
  generatedAt,
  modelName = "gemini-2.5-flash",
  language = "en",
}) => {
  if (!reportJson) {
    return (
      <div className="glass-card p-6 rounded-2xl text-slate-400 text-sm italic">
        No report data available.
      </div>
    );
  }

  const formattedDate = new Date(generatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-2xl border border-agri-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-agri-950/30 shadow-xl relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-agri-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-agri-500/20 text-agri-400 rounded-xl border border-agri-500/30">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-agri-400">
                AI Agronomist Recommendation
              </span>
              <h2 className="text-xl font-extrabold text-slate-100">{summary}</h2>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p className="font-semibold text-slate-300">Generated: {formattedDate}</p>
            <p className="text-[11px] text-slate-500">Engine: {modelName} • Lang: {language.toUpperCase()}</p>
          </div>
        </div>

        {/* DOMAIN 1: Disease & Pest Diagnosis */}
        {domain === "disease_pest_diagnosis" && (
          <div className="space-y-6">
            {/* Top Metrics: Severity & Confidence */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Identified Issue</span>
                <p className="text-base font-bold text-rose-300 mt-1">{reportJson.likely_issue}</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Severity</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      reportJson.severity === "severe"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                        : reportJson.severity === "moderate"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {reportJson.severity}
                  </span>
                </div>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">AI Confidence</span>
                <p className="text-base font-bold text-slate-100 capitalize mt-1">{reportJson.confidence}</p>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center space-x-2">
                <Info className="w-4 h-4 text-agri-400" />
                <span>Diagnosis Explanation</span>
              </h4>
              <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                {reportJson.explanation}
              </p>
            </div>

            {/* Actionable Treatment Steps */}
            {Array.isArray(reportJson.treatment_steps) && reportJson.treatment_steps.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Actionable Treatment Plan</span>
                </h4>
                <div className="space-y-3">
                  {reportJson.treatment_steps.map((step: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start space-x-3 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80"
                    >
                      <div className="w-7 h-7 rounded-full bg-agri-500/20 text-agri-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border border-agri-500/30">
                        {step.step || idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-100">{step.action}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                          Timeframe: {step.timeframe}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prevention Tips */}
            {Array.isArray(reportJson.prevention_tips) && reportJson.prevention_tips.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-agri-400" />
                  <span>Long-Term Prevention Tips</span>
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                  {reportJson.prevention_tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DOMAIN 2: Crop Selection */}
        {domain === "crop_selection" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center space-x-2">
                <Sprout className="w-4 h-4 text-emerald-400" />
                <span>Recommended Crops Ranking</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportJson.recommended_crops?.map((crop: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-slate-100 text-base">{crop.crop_name}</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Score: {crop.suitability_score}/100
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{crop.notes}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2">Agronomic Reasoning</h4>
              <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                {reportJson.reasoning}
              </p>
            </div>

            {Array.isArray(reportJson.risks) && (
              <div>
                <h4 className="text-sm font-bold text-rose-400 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Key Risk Factors</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-rose-300/90 bg-rose-950/20 p-4 rounded-xl border border-rose-900/40">
                  {reportJson.risks.map((risk: string, idx: number) => (
                    <li key={idx}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DOMAIN 3: Fertilizer & Nutrition */}
        {domain === "fertilizer_nutrition" && (
          <div className="space-y-6">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 uppercase font-semibold">Nutritional Diagnosis</span>
              <p className="text-base font-bold text-amber-300 mt-1">{reportJson.diagnosis}</p>
            </div>

            {/* Fertilizer Table */}
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center space-x-2">
                <TestTube className="w-4 h-4 text-amber-400" />
                <span>Fertilizer Application Schedule</span>
              </h4>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 text-xs uppercase font-semibold">
                    <tr>
                      <th className="p-3">Product / Fertilizer</th>
                      <th className="p-3">Dosage / Acre</th>
                      <th className="p-3">Application Method</th>
                      <th className="p-3">Timing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {reportJson.fertilizer_plan?.map((item: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-900/80">
                        <td className="p-3 font-bold text-slate-100">{item.product_type}</td>
                        <td className="p-3 font-semibold text-amber-300">{item.dosage}</td>
                        <td className="p-3">{item.application_method}</td>
                        <td className="p-3 text-slate-400">{item.timing}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Safety Notes */}
            {Array.isArray(reportJson.safety_notes) && (
              <div className="bg-amber-950/20 border border-amber-800/40 p-4 rounded-xl">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Chemical Safety & Mixing Precautions</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-200/90">
                  {reportJson.safety_notes.map((note: string, idx: number) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* DOMAIN 4: Irrigation */}
        {domain === "irrigation_water_management" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Recommended Method</span>
                <p className="text-base font-bold text-blue-300 mt-1">{reportJson.recommended_method}</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Water Strategy</span>
                <p className="text-xs text-slate-300 mt-1">{reportJson.reasoning}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-3 flex items-center space-x-2">
                <Droplet className="w-4 h-4 text-blue-400" />
                <span>Watering Schedule</span>
              </h4>
              <div className="space-y-3">
                {reportJson.recommended_schedule?.map((item: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-100 text-sm">{item.frequency}</span>
                      <p className="text-xs text-slate-400 mt-0.5">{item.notes}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-bold border border-blue-500/30">
                      {item.duration_minutes} mins / run
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 5: Soil Health */}
        {domain === "soil_health" && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Soil Quality Assessment</span>
              </h4>
              <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60 leading-relaxed">
                {reportJson.assessment}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-3">Improvement Action Plan</h4>
              <div className="space-y-3">
                {reportJson.improvement_plan?.map((step: any, idx: number) => (
                  <div key={idx} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-100">{step.action}</span>
                    <span className="text-xs text-amber-400 font-semibold bg-amber-950/40 px-2.5 py-1 rounded border border-amber-800/40">
                      {step.timeframe}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 6: Weather Risk */}
        {domain === "weather_risk_advisory" && (
          <div className="space-y-6">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Weather Risk Level</span>
                <p className="text-base font-extrabold text-purple-300 mt-0.5">{reportJson.risk_summary}</p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  reportJson.risk_level === "high"
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                    : reportJson.risk_level === "medium"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                }`}
              >
                {reportJson.risk_level} Risk
              </span>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2">Immediate Protective Actions</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                {reportJson.protective_actions?.map((act: string, idx: number) => (
                  <li key={idx}>{act}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* DOMAIN 7: Market & Post-Harvest */}
        {domain === "market_post_harvest" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Selling Recommendation</span>
                <div className="mt-1">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                      reportJson.sell_or_hold_recommendation === "sell_now"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                        : reportJson.sell_or_hold_recommendation === "hold"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                    }`}
                  >
                    {reportJson.sell_or_hold_recommendation.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Revenue Range</span>
                <p className="text-base font-extrabold text-emerald-400 mt-1">
                  {reportJson.estimated_revenue_range?.currency || "INR"}{" "}
                  {reportJson.estimated_revenue_range?.low?.toLocaleString()} &mdash;{" "}
                  {reportJson.estimated_revenue_range?.high?.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-300 mb-2">Market Analysis & Reasoning</h4>
              <p className="text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800 leading-relaxed">
                {reportJson.reasoning}
              </p>
            </div>

            {Array.isArray(reportJson.storage_tips) && (
              <div>
                <h4 className="text-sm font-bold text-slate-300 mb-2">Storage & Post-Harvest Guidelines</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-800">
                  {reportJson.storage_tips.map((tip: string, idx: number) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Additional Info Needed Callout (if any domain specified missing data) */}
        {Array.isArray(reportJson.additional_info_needed) && reportJson.additional_info_needed.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <h5 className="font-bold text-slate-400 flex items-center space-x-1.5 mb-1.5">
              <HelpCircle className="w-4 h-4 text-agri-400" />
              <span>Information that would improve accuracy in future requests:</span>
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              {reportJson.additional_info_needed.map((infoItem: string, idx: number) => (
                <li key={idx}>{infoItem}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisoryReportCard;
