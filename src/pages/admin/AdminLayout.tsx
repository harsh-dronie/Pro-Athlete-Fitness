import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, UserCheck, LogOut, Menu, Bell, ImagePlus, UserCircle, CreditCard, Image } from "lucide-react";

const navItems = [
  { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/clients", label: "Clients", icon: Users },
  { path: "/admin/leads", label: "Leads", icon: UserCheck },
  { path: "/admin/reminders", label: "Reminders", icon: Bell },
  { path: "/admin/transformations", label: "Transformations", icon: ImagePlus },
  { path: "/admin/about", label: "About", icon: UserCircle },
  { path: "/admin/plans", label: "Plans", icon: CreditCard },
  { path: "/admin/hero", label: "Home Images", icon: Image },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-white/5 z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Pro Athlete Fitness" className="w-9 h-9 object-contain" />
            <div>
              <p className="font-black uppercase text-sm tracking-tight">Pro Athlete</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-all
                  ${active
                    ? "bg-primary text-black"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-red-400 hover:bg-red-400/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="h-16 border-b border-white/5 flex items-center px-6 gap-4 bg-[#0a0a0a] sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-muted-foreground hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
            {navItems.find(n => n.path === location.pathname)?.label || "Admin"}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
