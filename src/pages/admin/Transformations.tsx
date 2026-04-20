import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const STATIC_BASE = BASE_URL.replace(/\/api$/, '');
const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${STATIC_BASE}/${url}`;

function getToken() {
  return localStorage.getItem('admin_token');
}

async function fetchTransformations() {
  const res = await fetch(`${BASE_URL}/transformations`);
  return res.json();
}

async function addTransformation(formData: FormData) {
  const res = await fetch(`${BASE_URL}/admin/transformations`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to add transformation');
  return res.json();
}

async function deleteTransformation(id: string) {
  await fetch(`${BASE_URL}/admin/transformations/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export default function Transformations() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ clientName: '', duration: '', resultDescription: '' });
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState('');
  const [afterPreview, setAfterPreview] = useState('');

  const fetchData = () => {
    setLoading(true);
    fetchTransformations().then(setItems).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'before') { setBeforeFile(file); setBeforePreview(url); }
    else { setAfterFile(file); setAfterPreview(url); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) { alert('Both before and after images are required'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('clientName', form.clientName);
      fd.append('duration', form.duration);
      fd.append('resultDescription', form.resultDescription);
      fd.append('beforeImage', beforeFile);
      fd.append('afterImage', afterFile);
      await addTransformation(fd);
      setModalOpen(false);
      setForm({ clientName: '', duration: '', resultDescription: '' });
      setBeforeFile(null); setAfterFile(null);
      setBeforePreview(''); setAfterPreview('');
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transformation?')) return;
    await deleteTransformation(id);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Transformations</h2>
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Before & after results shown on public website</p>
        </div>
        <Button onClick={() => setModalOpen(true)} className="rounded-none h-10 px-5 uppercase font-bold tracking-widest text-xs">
          <Plus className="w-4 h-4 mr-2" /> Add Transformation
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>
      ) : items.length === 0 ? (
        <div className="border border-white/5 p-12 text-center">
          <p className="text-muted-foreground uppercase tracking-widest text-sm">No transformations yet</p>
          <p className="text-muted-foreground text-xs mt-2">Add before & after photos to display on the public website</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-secondary/20 border border-white/5 overflow-hidden group">
              {/* Images */}
              <div className="flex aspect-[4/3]">
                <div className="flex-1 relative overflow-hidden border-r border-white/10">
                  <img src={getImageUrl(item.beforeImageUrl)} alt="Before"
                    className="w-full h-full object-cover grayscale brightness-75" />
                  <span className="absolute top-2 left-2 text-[9px] uppercase tracking-widest bg-black/60 text-white px-2 py-0.5">Before</span>
                </div>
                <div className="flex-1 relative overflow-hidden">
                  <img src={getImageUrl(item.afterImageUrl)} alt="After"
                    className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 text-[9px] uppercase tracking-widest bg-primary text-black font-bold px-2 py-0.5">After</span>
                </div>
              </div>
              {/* Info */}
              <div className="p-4 flex items-start justify-between gap-2">
                <div>
                  {item.clientName && <p className="font-bold uppercase tracking-tight text-sm">{item.clientName}</p>}
                  <p className="text-primary text-xs font-bold uppercase tracking-widest">{item.resultDescription}</p>
                  <p className="text-muted-foreground text-xs mt-1">{item.duration}</p>
                </div>
                <button onClick={() => handleDelete(item._id)}
                  className="p-1.5 border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors flex-shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
              className="w-full max-w-lg bg-[#111] border border-white/10 p-8 relative max-h-[90vh] overflow-y-auto">
              <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-white"><X className="w-5 h-5" /></button>
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Add Transformation</h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Image Upload */}
                <div className="grid grid-cols-2 gap-4">
                  {(['before', 'after'] as const).map((type) => {
                    const preview = type === 'before' ? beforePreview : afterPreview;
                    return (
                      <div key={type}>
                        <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">
                          {type} Image *
                        </label>
                        <label className="block cursor-pointer">
                          <input type="file" accept="image/jpeg,image/png" className="hidden"
                            onChange={(e) => handleFileChange(e, type)} />
                          <div className={`border-2 border-dashed aspect-square flex flex-col items-center justify-center transition-colors overflow-hidden
                            ${preview ? 'border-primary/30' : 'border-white/10 hover:border-white/30'}`}>
                            {preview ? (
                              <img src={preview} alt={type} className="w-full h-full object-cover" />
                            ) : (
                              <>
                                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                <span className="text-xs text-muted-foreground uppercase tracking-widest">Upload</span>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Client Name (optional)</label>
                  <input type="text" placeholder="e.g. Rahul S." value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Duration *</label>
                  <input type="text" placeholder="e.g. 12 Weeks" value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Result *</label>
                  <input type="text" placeholder="e.g. -12kg Fat Loss" value={form.resultDescription}
                    onChange={(e) => setForm({ ...form, resultDescription: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>

                <Button type="submit" disabled={saving} className="w-full rounded-none h-12 uppercase font-bold tracking-widest">
                  {saving ? "Uploading..." : "Add Transformation"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
