import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { AdvisoryDomain, Farm } from "../types/advisory";
import AdvisoryDomainPicker from "../components/advisory/AdvisoryDomainPicker";
import AdvisoryRequestForm from "../components/advisory/AdvisoryRequestForm";
import { ArrowLeft, Loader2, PlusCircle, Sparkles } from "lucide-react";

export const AdvisoryNew: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedFarmId = searchParams.get("farmId") || undefined;
  const navigate = useNavigate();

  const [selectedDomain, setSelectedDomain] = useState<AdvisoryDomain | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch farmer's farms
  const { data, isLoading: isLoadingFarms } = useQuery({
    queryKey: ["farms"],
    queryFn: () => apiClient.get<{ farms: Farm[] }>("/farms"),
  });

  const farms = data?.farms || [];

  const handleFormSubmit = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const res = await apiClient.post<{ message: string; request: any }>("/advisory-requests", formData);
      if (res.request?.id) {
        navigate(`/advisory/${res.request.id}`);
      }
    } catch (err: any) {
      console.error("Advisory request error:", err);
      alert(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingFarms) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Loading farm profiles...</p>
      </div>
    );
  }

  if (farms.length === 0) {
    return (
      <div className="glass-card p-10 rounded-3xl text-center space-y-4 max-w-md mx-auto my-12 border border-slate-800">
        <h2 className="text-xl font-bold text-slate-100">No Farm Registered</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          You must register at least one farm profile before submitting an advisory request.
        </p>
        <Link
          to="/farms/new"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-agri-600 hover:bg-agri-500 text-white text-xs font-bold rounded-xl shadow-md"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Farm First</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Step Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            if (selectedDomain) setSelectedDomain(null);
            else navigate(-1);
          }}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{selectedDomain ? "Back to Domain Picker" : "Back"}</span>
        </button>

        <div className="flex items-center space-x-2 text-xs font-semibold text-agri-400 bg-agri-500/10 px-3 py-1 rounded-full border border-agri-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Gemini 2.5 Flash Server Pipeline</span>
        </div>
      </div>

      {/* Step 1: Domain Selection */}
      {!selectedDomain ? (
        <AdvisoryDomainPicker
          selectedDomain={selectedDomain}
          onSelectDomain={(domain) => setSelectedDomain(domain)}
        />
      ) : (
        /* Step 2: Dynamic Form */
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-slate-100 capitalize">
              {selectedDomain.replace(/_/g, " ")} Request
            </h1>
            <p className="text-xs text-slate-400">
              Provide context and photos for instant server-side AI evaluation
            </p>
          </div>

          <AdvisoryRequestForm
            farms={farms}
            initialFarmId={preselectedFarmId}
            domain={selectedDomain}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </div>
      )}
    </div>
  );
};

export default AdvisoryNew;
