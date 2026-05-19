import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Trash2, Edit2, IndianRupee, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getClients, createClient, updateClient, deleteClient, recordPayment } from "@/lib/adminApi";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
function getToken() { return localStorage.getItem('admin_token'); }
async function sendReminder(clientId: string) {
  const res = await fetch(`${BASE_URL}/admin/clients/${clientId}/send-reminder`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return res.json();
}

const EXPIRY_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400 border-green-500/20",
  expiring_soon: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  expired: "bg-red-500/10 text-red-400 border-red-500/20",
};

const emptyForm = { name: "", phone: "", email: "", planDuration: 1, personalTraining: false, notes: "" };

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentModal, setPaymentModal] = useState<any>(null);
  const [editClient, setEditClient] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [payForm, setPayForm] = useState({ amount: "", planDuration: 1 });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const fetchClients = () => {
    setLoading(true);
    getClients(filter || undefined)
      .then(setClients)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, [filter]);

  const openAdd = () => { setEditClient(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (c: any) => { setEditClient(c); setForm({ name: c.name, phone: c.phone, email: c.email || "", planDuration: c.planDuration, personalTraining: c.personalTraining, notes: c.notes || "" }); setModalOpen(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editClient) await updateClient(editClient._id, form);
      else await createClient(form);
      setModalOpen(false);
      fetchClients();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client?")) return;
    await deleteClient(id);
    fetchClients();
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await recordPayment(paymentModal._id, { amount: Number(payForm.amount), planDuration: Number(payForm.planDuration) });
      setPaymentModal(null);
      fetchClients();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Clients</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Manage gym members</p>
        </div>
        <div className="flex gap-3">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-4 h-10 text-xs uppercase tracking-widest focus:outline-none focus:border-primary">
            <option value="">All</option>
            <option value="active" className="bg-[#111]">Active</option>
            <option value="expiring_soon" className="bg-[#111]">Expiring Soon</option>
            <option value="expired" className="bg-[#111]">Expired</option>
          </select>
          <Button onClick={openAdd} className="rounded-none h-10 px-5 uppercase font-bold tracking-widest text-xs">
            <Plus className="w-4 h-4 mr-2" /> Add Client
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>
      ) : clients.length === 0 ? (
        <div className="border border-white/5 p-12 text-center">
          <p className="text-muted-foreground uppercase tracking-widest text-sm">No clients yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {clients.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-secondary/20 border border-white/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-bold uppercase tracking-tight">{c.name}</h3>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border ${EXPIRY_COLORS[c.expiryStatus]}`}>
                    {c.expiryStatus?.replace("_", " ")}
                  </span>
                  {c.personalTraining && <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 border bg-primary/10 text-primary border-primary/20">PT</span>}
                </div>
                <p className="text-sm text-muted-foreground">{c.phone}</p>
                <div className="flex gap-4 mt-1 flex-wrap">
                  <p className="text-xs text-muted-foreground">Plan: <span className="text-white font-bold">{c.planDuration}m</span></p>
                  <p className="text-xs text-muted-foreground">Expires: <span className="text-white font-bold">{new Date(c.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></p>
                  {c.lastPaymentDate && <p className="text-xs text-muted-foreground">Last paid: <span className="text-white font-bold">{new Date(c.lastPaymentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></p>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPaymentModal(c)} className="p-2 border border-white/10 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors" title="Record Payment">
                  <IndianRupee className="w-4 h-4" />
                </button>
                <button onClick={() => { sendReminder(c._id).then(() => alert('Reminder sent!')).catch(() => alert('Failed')); }}
                  className="p-2 border border-white/10 text-muted-foreground hover:text-yellow-400 hover:border-yellow-400/30 transition-colors" title="Send SMS Reminder">
                  <Bell className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(c)} className="p-2 border border-white/10 text-muted-foreground hover:text-white hover:border-white/30 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c._id)} className="p-2 border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-md bg-[#111] border border-white/10 p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">{editClient ? "Edit Client" : "Add Client"}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                {[
                  { label: "Full Name *", key: "name", type: "text", placeholder: "Client name" },
                  { label: "Phone *", key: "phone", type: "tel", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Email", key: "email", type: "email", placeholder: "optional" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">{label}</label>
                    <input type={type} placeholder={placeholder} value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Plan Duration (months)</label>
                  <select value={form.planDuration} onChange={(e) => setForm({ ...form, planDuration: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 h-11 text-sm focus:outline-none focus:border-primary">
                    {[1, 2, 3, 6, 12].map(m => <option key={m} value={m} className="bg-[#111]">{m} Month{m > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pt" checked={form.personalTraining} onChange={(e) => setForm({ ...form, personalTraining: e.target.checked })}
                    className="w-4 h-4 accent-primary" />
                  <label htmlFor="pt" className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Personal Training</label>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes..."
                    rows={3} className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
                </div>
                <Button type="submit" disabled={saving} className="w-full rounded-none h-12 uppercase font-bold tracking-widest">
                  {saving ? "Saving..." : editClient ? "Update Client" : "Add Client"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setPaymentModal(null); }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-sm bg-[#111] border border-white/10 p-8 relative">
              <button onClick={() => setPaymentModal(null)} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-black uppercase tracking-tight mb-1">Record Payment</h3>
              <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6">{paymentModal.name}</p>
              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Amount (₹)</label>
                  <input type="number" placeholder="e.g. 2000" value={payForm.amount} onChange={(e) => setPayForm({ ...payForm, amount: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Extend Plan (months)</label>
                  <select value={payForm.planDuration} onChange={(e) => setPayForm({ ...payForm, planDuration: Number(e.target.value) })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 h-11 text-sm focus:outline-none focus:border-primary">
                    {[1, 2, 3, 6, 12].map(m => <option key={m} value={m} className="bg-[#111]">{m} Month{m > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <Button type="submit" disabled={saving} className="w-full rounded-none h-12 uppercase font-bold tracking-widest">
                  {saving ? "Saving..." : "Record Payment"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
