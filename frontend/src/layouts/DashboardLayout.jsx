import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Scan URL", href: "/dashboard/scan", icon: ScanSearch },
    { name: "History", href: "/dashboard/history", icon: History },
    ...(isAdmin ? [{ name: "Admin", href: "/dashboard/admin", icon: Settings }] : []),
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const getPageTitle = () => {
    if (location.pathname === "/dashboard/settings") return "Settings";
    return navigation.find((n) => n.href === location.pathname)?.name || "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 shrink-0">
        {/* Logo */}
        <div className="p-5 flex items-center space-x-3 border-b border-slate-800">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Phishing Guard</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Menu</p>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 border border-transparent"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span className="text-sm font-medium">{item.name}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800 space-y-1">
          <Link
            to="/dashboard/settings"
            className={`flex items-center space-x-3 px-3 py-2.5 mb-3 rounded-xl transition-all duration-200 group border ${
              location.pathname === "/dashboard/settings"
                ? "bg-slate-700/50 text-white border-slate-600"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100 border-transparent"
            }`}
          >
            <Settings className="w-5 h-5 text-slate-500 group-hover:text-slate-300" />
            <span className="text-sm font-medium">Settings</span>
          </Link>

          <div className="px-3 py-2.5 flex items-center space-x-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || "User")}`}
                alt="User"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "User"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email || ""}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent"
          >
            <LogOut className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-white">Phishing Guard</span>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-slate-900 pt-16 px-4">
            <nav className="space-y-1 mt-4">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? "bg-blue-500/15 text-blue-400"
                        : "text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                  <span>Log out</span>
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Desktop Topbar */}
        <header className="hidden md:flex h-14 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 items-center justify-between px-8 sticky top-0 z-10">
          <div className="text-base font-semibold text-white">{getPageTitle()}</div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-300 font-medium">System Active</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
