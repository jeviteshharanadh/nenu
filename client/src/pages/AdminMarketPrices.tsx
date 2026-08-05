import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { apiClient } from "../lib/apiClient";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { ShieldAlert, Plus, Trash2, Loader2, CheckCircle2 } from "lucide-react";

export const AdminMarketPrices: React.FC = () => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-market-prices"],
    queryFn: () => apiClient.get<{ marketPrices: any[] }>("/market-prices"),
  });

  const createMutation = useMutation({
    mutationFn: (body: any) => apiClient.post("/admin/market-prices", body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-prices"] });
      queryClient.invalidateQueries({ queryKey: ["market-prices"] });
      setSuccessMsg("Market price row created successfully!");
      reset();
      setTimeout(() => setSuccessMsg(null), 3000);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/market-prices/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-market-prices"] });
      queryClient.invalidateQueries({ queryKey: ["market-prices"] });
      setDeleteId(null);
    },
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      crop_name: "Wheat (HD 2967)",
      region: "Punjab",
      price_per_kg: 24.5,
      unit: "kg",
      recorded_date: new Date().toISOString().split("T")[0],
    },
  });

  const prices = data?.marketPrices || [];

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100">Admin Market Price Management</h1>
          <p className="text-xs text-amber-300/80">Protected Admin Route &mdash; Add or modify market prices reference dataset</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center space-x-2 text-emerald-300 text-xs bg-emerald-950/50 p-4 rounded-xl border border-emerald-800">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Add New Market Price Form */}
      <form
        onSubmit={handleSubmit((data) => createMutation.mutate({ ...data, price_per_kg: Number(data.price_per_kg) }))}
        className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4"
      >
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-2">Add / Update Market Price Entry</h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Crop Name</label>
            <input type="text" {...register("crop_name", { required: true })} className="w-full glass-input rounded-lg px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Region</label>
            <input type="text" {...register("region", { required: true })} className="w-full glass-input rounded-lg px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Price / KG</label>
            <input type="number" step="0.01" {...register("price_per_kg", { required: true })} className="w-full glass-input rounded-lg px-3 py-2 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Date</label>
            <input type="date" {...register("recorded_date")} className="w-full glass-input rounded-lg px-3 py-2 text-xs" />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg shadow-md flex items-center justify-center space-x-1"
            >
              {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>Save Entry</span>
            </button>
          </div>
        </div>
      </form>

      {/* Admin Price List Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Crop Name</th>
                <th className="p-3">Region</th>
                <th className="p-3">Price / KG</th>
                <th className="p-3">Recorded Date</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {prices.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/80">
                  <td className="p-3 font-bold text-slate-100">{p.crop_name}</td>
                  <td className="p-3">{p.region}</td>
                  <td className="p-3 font-bold text-amber-400">₹{p.price_per_kg}</td>
                  <td className="p-3 text-slate-400">{p.recorded_date}</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setDeleteId(p.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Price Entry?"
        message="Are you sure you want to delete this market price record?"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminMarketPrices;
