import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LanguageSwitcher from "../ui/LanguageSwitcher";
import {
  Sprout,
  LayoutDashboard,
  Tractor,
  FileSpreadsheet,
  TrendingUp,
  User as UserIcon,
  LogOut,
  ShieldAlert,
  Menu,
  X,
  PlusCircle,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-agri-500 to-agri-700 rounded-xl text-white shadow-lg glow-agri group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-agri-400 via-emerald-200 to-white bg-clip-text text-transparent">
                AgriAdvisor <span className="text-agri-400">AI</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-semibold text-agri-400/80 tracking-widest">
                Digital Agronomist
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/dashboard")
                    ? "bg-agri-500/20 text-agri-400 border border-agri-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/farms"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/farms") || location.pathname.startsWith("/farms")
                    ? "bg-agri-500/20 text-agri-400 border border-agri-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Tractor className="w-4 h-4" />
                <span>My Farms</span>
              </Link>

              <Link
                to="/advisory/history"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/advisory/history")
                    ? "bg-agri-500/20 text-agri-400 border border-agri-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Advisories</span>
              </Link>

              <Link
                to="/market-prices"
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/market-prices")
                    ? "bg-agri-500/20 text-agri-400 border border-agri-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Market Prices</span>
              </Link>

              {profile?.role === "admin" && (
                <Link
                  to="/admin/market-prices"
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/admin/market-prices")
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-amber-300/80 hover:text-amber-200 hover:bg-amber-950/40"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              )}
            </div>
          )}

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageSwitcher />

            {user ? (
              <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
                <Link
                  to="/advisory/new"
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-gradient-to-r from-agri-600 to-agri-500 hover:from-agri-500 hover:to-agri-400 text-white rounded-lg text-sm font-semibold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>New Advisory</span>
                </Link>

                <Link
                  to="/profile"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Profile Settings"
                >
                  <UserIcon className="w-5 h-5" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold bg-agri-600 hover:bg-agri-500 text-white rounded-lg shadow-md transition-all"
                >
                  Sign Up Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="px-3 py-2 border-b border-slate-800/80 mb-2">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-semibold text-agri-400 truncate">{profile?.full_name || user.email}</p>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <LayoutDashboard className="w-5 h-5 text-agri-400" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/advisory/new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-white bg-agri-600 hover:bg-agri-500"
              >
                <PlusCircle className="w-5 h-5" />
                <span>Get AI Advisory</span>
              </Link>
              <Link
                to="/farms"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <Tractor className="w-5 h-5 text-agri-400" />
                <span>My Farms</span>
              </Link>
              <Link
                to="/advisory/history"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <FileSpreadsheet className="w-5 h-5 text-agri-400" />
                <span>Advisory History</span>
              </Link>
              <Link
                to="/market-prices"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <TrendingUp className="w-5 h-5 text-agri-400" />
                <span>Market Prices</span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
              >
                <UserIcon className="w-5 h-5 text-slate-400" />
                <span>Profile Settings</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-rose-400 hover:bg-rose-950/30"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 text-sm font-medium text-slate-200 bg-slate-800 rounded-lg"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-2.5 text-sm font-semibold text-white bg-agri-600 rounded-lg"
              >
                Sign Up Free
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
