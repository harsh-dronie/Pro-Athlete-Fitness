import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getLeads, updateLeadStatus } from "@/lib/adminApi";

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  converted: "bg-green-500/10 text-green-400 border-green-500/20",
  not_interested: "bg-red-500/10 text-red-400 border-red-500/20",
};

const STATUSES = ["new", "contacted", "converted", "not_interested"];

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchLeads = () => {
    setLoading(true);
    getLeads(filter || undefined)
      .then(setLeads)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLeads(); }, [filter]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateLeadStatus(id, status);
    fetchLeads();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Leads</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Website enquiries</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white/5 border border-white/10 text-white px-4 h-10 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
        >
          <option value="">All Leads</option>
          {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s.replace("_", " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>
      ) : leads.length === 0 ? (
        <div className="border border-white/5 p-12 text-center">
          <p className="text-muted-foreground uppercase tracking-widest text-sm">No leads yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map((lead, i) => (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-secondary/20 border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold uppercase tracking-tight">{lead.name}</h3>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border ${STATUS_COLORS[lead.status]}`}>
                    {lead.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{lead.phone}</p>
                {lead.goal && <p className="text-xs text-primary uppercase tracking-widest mt-1">{lead.goal}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(lead.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                className="bg-white/5 border border-white/10 text-white px-3 h-9 text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
              >
                {STATUSES.map(s => <option key={s} value={s} className="bg-[#111]">{s.replace("_", " ")}</option>)}
              </select>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
