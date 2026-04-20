import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const STATIC_BASE = BASE_URL.replace(/\/api$/, '');
const getImageUrl = (url: string) => url?.startsWith('http') ? url : `${STATIC_BASE}/${url}`;
function getToken() { return localStorage.getItem('admin_token'); }

async function fetchAbout() {
  const res = await fetch(`${BASE_URL}/about`);
  if (res.status === 404) return null;
  return res.json();
}

async function saveAbout(formData: FormData) {
  const res = await fetch(`${BASE_URL}/admin/about`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to save');
  return res.json();
}

export default function About() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profilePreview, setProfilePreview] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    trainerName: '',
    bio: '',
    milestones: [{ year: '', description: '' }],
  });

  useEffect(() => {
    fetchAbout().then((data) => {
      if (data) {
        setForm({
          trainerName: data.trainerName || '',
          bio: data.bio || '',
          milestones: data.milestones?.length ? data.milestones : [{ year: '', description: '' }],
        });
        if (data.profileImageUrl) setProfilePreview(getImageUrl(data.profileImageUrl));
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const addMilestone = () => setForm({ ...form, milestones: [...form.milestones, { year: '', description: '' }] });
  const removeMilestone = (i: number) => setForm({ ...form, milestones: form.milestones.filter((_, idx) => idx !== i) });
  const updateMilestone = (i: number, key: string, val: string) => {
    const updated = [...form.milestones];
    updated[i] = { ...updated[i], [key]: val };
    setForm({ ...form, milestones: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('trainerName', form.trainerName);
      fd.append('bio', form.bio);
      fd.append('milestones', JSON.stringify(form.milestones));
      if (profileFile) fd.append('profileImage', profileFile);
      await saveAbout(fd);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted-foreground text-sm uppercase tracking-widest">Loading...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">About Content</h2>
        <p className="text-muted-foreground text-xs uppercase tracking-widest">Updates reflect on the public website</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image */}
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-3">Profile Photo</label>
          <label className="cursor-pointer inline-block">
            <input type="file" accept="image/jpeg,image/png" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setProfileFile(f); setProfilePreview(URL.createObjectURL(f)); }
              }} />
            <div className="w-28 h-28 border-2 border-dashed border-white/10 hover:border-white/30 transition-colors overflow-hidden flex items-center justify-center">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center">
                  <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Upload</span>
                </div>
              )}
            </div>
          </label>
        </div>

        {/* Trainer Name */}
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Trainer Name</label>
          <input type="text" value={form.trainerName} onChange={(e) => setForm({ ...form, trainerName: e.target.value })}
            placeholder="e.g. Ronit Rajput"
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
        </div>

        {/* Bio */}
        <div>
          <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Bio</label>
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Write a short bio..."
            rows={4}
            className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Journey / Milestones</label>
            <button type="button" onClick={addMilestone}
              className="flex items-center gap-1 text-xs text-primary uppercase tracking-widest font-bold hover:underline">
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {form.milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 items-start">
                <input type="text" value={m.year} onChange={(e) => updateMilestone(i, 'year', e.target.value)}
                  placeholder="Year" className="w-24 bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-3 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                <input type="text" value={m.description} onChange={(e) => updateMilestone(i, 'description', e.target.value)}
                  placeholder="What happened this year..." className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-11 text-sm focus:outline-none focus:border-primary transition-colors" />
                {form.milestones.length > 1 && (
                  <button type="button" onClick={() => removeMilestone(i)}
                    className="p-2 border border-white/10 text-muted-foreground hover:text-red-400 hover:border-red-400/30 transition-colors mt-0.5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={saving} className="rounded-none h-12 px-10 uppercase font-bold tracking-widest">
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
