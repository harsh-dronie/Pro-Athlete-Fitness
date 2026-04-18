import { useEffect, useState, useRef } from "react";
import { Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchHero } from "@/lib/api";
import { updateHeroImages } from "@/lib/adminApi";

const BASE = "http://localhost:5001/";

export default function AdminHero() {
  const [current, setCurrent] = useState<{ backgroundImageUrl: string; trainerImageUrl: string } | null>(null);
  const [bgFile, setBgFile] = useState<File | null>(null);
  const [trainerFile, setTrainerFile] = useState<File | null>(null);
  const [bgPreview, setBgPreview] = useState("");
  const [trainerPreview, setTrainerPreview] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const bgRef = useRef<HTMLInputElement>(null);
  const trainerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHero().then(setCurrent).catch(() => {});
  }, []);

  const handleFile = (file: File, type: "bg" | "trainer") => {
    const url = URL.createObjectURL(file);
    if (type === "bg") { setBgFile(file); setBgPreview(url); }
    else { setTrainerFile(file); setTrainerPreview(url); }
  };

  const handleSave = async () => {
    if (!bgFile && !trainerFile) { setError("Select at least one image to update."); return; }
    setError(""); setSaving(true);
    try {
      const fd = new FormData();
      if (bgFile) fd.append("backgroundImage", bgFile);
      if (trainerFile) fd.append("trainerImage", trainerFile);
      const updated = await updateHeroImages(fd);
      setCurrent(updated);
      setBgFile(null); setTrainerFile(null);
      setBgPreview(""); setTrainerPreview("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentBg = current?.backgroundImageUrl
    ? (current.backgroundImageUrl.startsWith('http') ? current.backgroundImageUrl : BASE + current.backgroundImageUrl)
    : "";
  const currentTrainer = current?.trainerImageUrl
    ? (current.trainerImageUrl.startsWith('http') ? current.trainerImageUrl : BASE + current.trainerImageUrl)
    : "";

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tight">Home Page Images</h2>
        <p className="text-muted-foreground text-sm mt-1">Update the two images shown on the hero section of the home page.</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 text-primary text-sm uppercase tracking-widest font-bold mb-6 border border-primary/20 bg-primary/5 px-4 py-3">
          <CheckCircle className="w-4 h-4" /> Images updated successfully
        </div>
      )}
      {error && <p className="text-red-400 text-xs uppercase tracking-widest mb-6">{error}</p>}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Background Image */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6">
          <h3 className="font-black uppercase tracking-tight mb-1">Background Image</h3>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6">Full-width gym background behind the hero text</p>

          <div
            className="relative aspect-video bg-secondary/30 border border-white/5 overflow-hidden mb-4 cursor-pointer group"
            onClick={() => bgRef.current?.click()}
          >
            {(bgPreview || currentBg) ? (
              <img src={bgPreview || currentBg} alt="Background" className="w-full h-full object-cover grayscale opacity-60" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Upload className="w-8 h-8" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>

          <input ref={bgRef} type="file" accept="image/jpeg,image/png" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "bg")} />

          <Button variant="outline" onClick={() => bgRef.current?.click()}
            className="w-full rounded-none uppercase tracking-widest text-xs font-bold border-white/10 hover:bg-white/5">
            <Upload className="w-3 h-3 mr-2" />
            {bgPreview ? "Change Selection" : "Choose Image"}
          </Button>
          {bgFile && <p className="text-primary text-xs mt-2 uppercase tracking-widest truncate">{bgFile.name}</p>}
        </div>

        {/* Trainer Image */}
        <div className="border border-white/10 bg-[#0a0a0a] p-6">
          <h3 className="font-black uppercase tracking-tight mb-1">Trainer Image</h3>
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-6">Right-side trainer silhouette image (desktop only)</p>

          <div
            className="relative aspect-video bg-secondary/30 border border-white/5 overflow-hidden mb-4 cursor-pointer group"
            onClick={() => trainerRef.current?.click()}
          >
            {(trainerPreview || currentTrainer) ? (
              <img src={trainerPreview || currentTrainer} alt="Trainer" className="w-full h-full object-contain grayscale brightness-75" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Upload className="w-8 h-8" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
          </div>

          <input ref={trainerRef} type="file" accept="image/jpeg,image/png" className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], "trainer")} />

          <Button variant="outline" onClick={() => trainerRef.current?.click()}
            className="w-full rounded-none uppercase tracking-widest text-xs font-bold border-white/10 hover:bg-white/5">
            <Upload className="w-3 h-3 mr-2" />
            {trainerPreview ? "Change Selection" : "Choose Image"}
          </Button>
          {trainerFile && <p className="text-primary text-xs mt-2 uppercase tracking-widest truncate">{trainerFile.name}</p>}
        </div>
      </div>

      <div className="mt-8">
        <Button onClick={handleSave} disabled={saving || (!bgFile && !trainerFile)}
          className="rounded-none h-12 px-12 uppercase font-bold tracking-widest">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
