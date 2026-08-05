import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Farm } from "../types/advisory";
import FarmForm from "../components/farms/FarmForm";
import { ArrowLeft, Loader2 } from "lucide-react";

export const FarmFormPage: React.FC = () => {
  const { farmId } = useParams<{ farmId?: string }>();
  const isEditing = !!farmId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch initial farm data if editing
  const { data, isLoading: isLoadingInitial } = useQuery({
    queryKey: ["farm", farmId],
    queryFn: () => apiClient.get<{ farm: Farm }>(`/farms/${farmId}`),
    enabled: isEditing,
  });

  const saveMutation = useMutation({
    mutationFn: (formData: any) => {
      if (isEditing) {
        return apiClient.patch<{ farm: Farm }>(`/farms/${farmId}`, formData);
      } else {
        return apiClient.post<{ farm: Farm }>("/farms", formData);
      }
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      queryClient.invalidateQueries({ queryKey: ["farm", farmId] });
      navigate(res.farm ? `/farms/${res.farm.id}` : "/farms");
    },
  });

  if (isEditing && isLoadingInitial) {
    return (
      <div className="p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
        <p className="text-xs text-slate-400 mt-2">Loading farm record for editing...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto">
      <Link to="/farms" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Cancel & Return to Farms</span>
      </Link>

      <div className="text-center space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-100">
          {isEditing ? "Edit Farm Profile" : "Register New Farm"}
        </h1>
        <p className="text-xs text-slate-400">
          Accurate farm location and soil type ensures contextual AI crop recommendations
        </p>
      </div>

      <FarmForm
        initialValues={data?.farm}
        onSubmit={async (payload) => {
          await saveMutation.mutateAsync(payload);
        }}
        isLoading={saveMutation.isPending}
        submitLabel={isEditing ? "Update Farm Record" : "Save & Register Farm"}
      />
    </div>
  );
};

export default FarmFormPage;
