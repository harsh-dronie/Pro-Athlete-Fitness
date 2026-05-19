import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, UserCheck, AlertTriangle, IndianRupee } from "lucide-react";
import { getDashboard } from "@/lib/adminApi";

interface Stats {
  totalClients: number;
  activeClients: number;
  expiringSoon: number;
  monthlyRevenue: number;
}

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-secondary/30 border border-white/5 p-6 flex items-center gap-5"
  >
    <div className={`w-12 h-12 flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{label}</p>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight mb-1">Dashboard</h2>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Overview of your gym</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Clients" value={stats?.totalClients ?? 0} color="bg-primary/10 text-primary" />
        <StatCard icon={UserCheck} label="Active Clients" value={stats?.activeClients ?? 0} color="bg-green-500/10 text-green-400" />
        <StatCard icon={AlertTriangle} label="Expiring Soon" value={stats?.expiringSoon ?? 0} color="bg-yellow-500/10 text-yellow-400" />
        <StatCard icon={IndianRupee} label="Monthly Revenue" value={`₹${stats?.monthlyRevenue ?? 0}`} color="bg-blue-500/10 text-blue-400" />
      </div>
    </div>
  );
}
