import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";
import { Farm } from "../types/advisory";
import FarmCard from "../components/farms/FarmCard";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Tractor, PlusCircle, Loader2, Search } from "lucide-react";

export const FarmsList: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteFarmId, setDeleteFarmId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["farms"],
    queryFn: () => apiClient.get<{ farms: Farm[] }>("/farms"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/farms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      setDeleteFarmId(null);
    },
  });

  const farms = data?.farms || [];
  const filteredFarms = farms.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.soil_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center space-x-2">
            <Tractor className="w-6 h-6 text-agri-400" />
            <span>My Farm Holdings ({farms.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Register and manage your farm locations, soil characteristics, and crops.
          </p>
        </div>

        <Link
          to="/farms/new"
          className="px-5 py-2.5 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 w-fit transition-all glow-agri"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Farm</span>
        </Link>
      </div>

      {/* Search Input */}
      {farms.length > 0 && (
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter farms by name, region, or soil..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs"
          />
        </div>
      )}

      {/* Farms Grid */}
      {isLoading ? (
        <div className="p-12 text-center glass-card rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin text-agri-400 mx-auto" />
          <p className="text-xs text-slate-400 mt-2">Loading farm profiles...</p>
        </div>
      ) : filteredFarms.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-dashed border-slate-700 max-w-xl mx-auto">
          <Tractor className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-100">No Farms Found</h3>
          <p className="text-xs text-slate-400">
            {searchTerm ? "No farms match your search criteria." : "You haven't registered any farms yet."}
          </p>
          {!searchTerm && (
            <Link
              to="/farms/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-agri-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Farm Profile Now</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map((farm) => (
            <FarmCard key={farm.id} farm={farm} onDelete={(id) => setDeleteFarmId(id)} />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteFarmId}
        title="Delete Farm Profile?"
        message="Are you sure you want to remove this farm? All associated advisory history will be permanently deleted."
        confirmLabel="Yes, Delete Farm"
        onConfirm={() => deleteFarmId && deleteMutation.mutate(deleteFarmId)}
        onCancel={() => setDeleteFarmId(null)}
      />
    </div>
  );
};

export default FarmsList;
