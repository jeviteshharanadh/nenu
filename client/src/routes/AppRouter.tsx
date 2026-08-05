import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import FarmsList from "../pages/FarmsList";
import FarmDetail from "../pages/FarmDetail";
import FarmFormPage from "../pages/FarmFormPage";
import AdvisoryNew from "../pages/AdvisoryNew";
import AdvisoryDetail from "../pages/AdvisoryDetail";
import AdvisoryHistory from "../pages/AdvisoryHistory";
import MarketPrices from "../pages/MarketPrices";
import Profile from "../pages/Profile";
import AdminMarketPrices from "../pages/AdminMarketPrices";
import NotFound from "../pages/NotFound";

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Farmer Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms"
        element={
          <ProtectedRoute>
            <FarmsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/new"
        element={
          <ProtectedRoute>
            <FarmFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/:farmId"
        element={
          <ProtectedRoute>
            <FarmDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/farms/:farmId/edit"
        element={
          <ProtectedRoute>
            <FarmFormPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/advisory/new"
        element={
          <ProtectedRoute>
            <AdvisoryNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/history"
        element={
          <ProtectedRoute>
            <AdvisoryHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/advisory/:requestId"
        element={
          <ProtectedRoute>
            <AdvisoryDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/market-prices"
        element={
          <ProtectedRoute>
            <MarketPrices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Protected Admin Routes */}
      <Route
        path="/admin/market-prices"
        element={
          <ProtectedRoute requireAdminRole={true}>
            <AdminMarketPrices />
          </ProtectedRoute>
        }
      />

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
