import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminPlans, createPlan, updatePlan, deletePlan } from "@/lib/adminApi";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  features: string[];
  badge?: string;
  isActive: boolean;
  order: number;
}

const emptyForm = {
  name: "",
  description: "",
  price: "",
  discountedPrice: "",
  duration: "",
  features: "",
  badge: "",
  isActive: true,
  order: "0",
};

export default function AdminPlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try { setPlans(await getAdminPlans()); }
    catch { setError("Failed to load plans"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEdit = (plan: Plan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      description: plan.description,
      price: String(plan.price),
      discountedPrice: plan.discountedPrice ? String(plan.discountedPrice) : "",
      duration: plan.duration,
      features: plan.features.join("\n"),
      badge: plan.badge || "",
      isActive: plan.isActive,
      order: String(plan.order),
    });
    setError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration) {
      setError("Name, price and duration are required.");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined,
      duration: form.duration,
      features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
      badge: form.badge || undefined,
      isActive: form.isActive,
      order: Number(form.order),
    };
    try {
      if (editing) { await updatePlan(editing._id, payload); }
      else { await createPlan(payload); }
      setShowForm(false);
      await load();
    } catch {
      setError("Failed to save plan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    try { await deletePlan(id); await load(); }
    catch { setError("Failed to delete plan."); }
  };

  const toggleActive = async (plan: Plan) => {
    try { await updatePlan(plan._id, { isActive: !plan.isActive }); await load(); }
    catch { setError("Failed to update plan."); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Plans & Pricing</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage your training plans shown on the public site.</p>
        </div>
        <Button onClick={openCreate} className="rounded-none uppercase tracking-widest font-bold">
          <Plus className="w-4 h-4 mr-2" /> Add Plan
        </Button>
      </div>

      {error && <p className="text-red-400 text-xs uppercase tracking-widest mb-4">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="uppercase tracking-widest text-sm">No plans yet. Add your first plan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const discount = plan.discountedPrice
              ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100)
              : 0;
            return (
              <div key={plan._id} className={`border ${plan.isActive ? "border-white/10" : "border-white/5 opacity-50"} bg-[#0a0a0a] p-6 flex flex-col gap-4`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black uppercase tracking-tight text-lg">{plan.name}</h3>
                      {plan.badge && (
                        <span className="bg-primary text-background text-[10px] font-black uppercase tracking-widest px-2 py-0.5">{plan.badge}</span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs">{plan.description}</p>
                  </div>
                  <button onClick={() => toggleActive(plan)} title={plan.isActive ? "Deactivate" : "Activate"}
                    className={`w-8 h-8 flex items-center justify-center border ${plan.isActive ? "border-primary text-primary" : "border-white/20 text-muted-foreground"} hover:opacity-80 transition-opacity`}>
                    <Check className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-end gap-2">
                  <span className="text-2xl font-black text-primary">₹{(plan.discountedPrice ?? plan.price).toLocaleString()}</span>
                  {plan.discountedPrice && (
                    <span className="text-muted-foreground line-through text-sm mb-0.5">₹{plan.price.toLocaleString()}</span>
                  )}
                  {discount > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-0.5">{discount}% OFF</span>
                  )}
                </div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{plan.duration}</p>

                <ul className="space-y-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary rounded-full shrink-0" />{f}
                    </li>
                  ))}
                </ul>

                <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                  <Button size="sm" variant="ghost" onClick={() => openEdit(plan)} className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold">
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(plan._id)} className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-400/5">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: "rgba(0,0,0,0.7)" }} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div className="w-full max-w-md bg-[#0a0a0a] border-l border-white/10 h-full overflow-y-auto p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tight">{editing ? "Edit Plan" : "New Plan"}</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            {[
              { label: "Plan Name *", key: "name", type: "text", placeholder: "e.g. Pro" },
              { label: "Description", key: "description", type: "text", placeholder: "Short description" },
              { label: "Price (₹) *", key: "price", type: "number", placeholder: "e.g. 5000" },
              { label: "Discounted Price (₹)", key: "discountedPrice", type: "number", placeholder: "Leave blank if no discount" },
              { label: "Duration *", key: "duration", type: "text", placeholder: "e.g. 1 Month" },
              { label: "Badge", key: "badge", type: "text", placeholder: "e.g. Most Popular" },
              { label: "Display Order", key: "order", type: "number", placeholder: "0" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Features (one per line)</label>
              <textarea
                rows={6}
                placeholder={"Custom workout plan\nDiet guidance\nWeekly check-ins"}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-yellow-400" />
              <label htmlFor="isActive" className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Active (visible on site)</label>
            </div>

            {error && <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>}

            <Button onClick={handleSave} disabled={saving} className="rounded-none h-12 uppercase font-bold tracking-widest">
              {saving ? "Saving..." : editing ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
