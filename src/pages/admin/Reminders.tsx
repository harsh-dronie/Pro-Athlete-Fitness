import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bell, Phone } from "lucide-react";
import { getReminders } from "@/lib/adminApi";

const Section = ({ title, color, clients }: { title: string; color: string; clients: any[] }) => (
  <div>
    <div className={`flex items-center gap-2 mb-3`}>
      <Bell className={`w-4 h-4 ${color}`} />
      <h3 className={`text-xs font-black uppercase tracking-widest ${color}`}>{title}</h3>
      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/5`}>{clients.length}</span>
    </div>
    {clients.length === 0 ? (
      <p className="text-muted-foreground text-xs uppercase tracking-widest pl-6">No clients</p>
    ) : (
      <div className="space-y-2 pl-6">
        {clients.map((c, i) => (
          <motion.div key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-secondary/20 border border-white/5 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="font-bold uppercase tracking-tight text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">Expires: {new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
            </div>
            <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-widest hover:underline">
              <Phone className="w-3 h-3" /> {c.phone}
            </a>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

export default function Reminders() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReminders().then(setData).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Reminders</h2>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Clients whose plans are expiring</p>
      </div>
      <div className="space-y-8">
        <Section title="Expiring Today" color="text-red-400" clients={data?.today ?? []} />
        <Section title="Expiring in 2 Days" color="text-yellow-400" clients={data?.in2Days ?? []} />
        <Section title="Expiring in 7 Days" color="text-blue-400" clients={data?.in7Days ?? []} />
      </div>
    </div>
  );
}
