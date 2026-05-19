import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, CheckCircle } from "lucide-react";
import { useState } from "react";
import { submitLead } from "@/lib/api";

export default function CTA() {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setError("Name and phone are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await submitLead(form);
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070&auto=format&fit=crop"
          alt="Gym"
          className="w-full h-full object-cover grayscale opacity-10"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-secondary/50 backdrop-blur-xl border border-white/5 p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 -mr-16 -mt-16 rotate-45" />
          <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-8 block">Ready to start?</span>
          <h2 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-10">
            Stop Making <br />
            <span className="text-primary">Excuses</span>. <br />
            Start Making <span className="italic font-light">History</span>.
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Join the elite community of high-performers who have transformed their lives through our proven training systems.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" onClick={() => setModalOpen(true)} className="rounded-none h-16 px-12 text-lg font-bold uppercase tracking-widest w-full sm:w-auto group">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <a
              href="https://wa.me/919872881023"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" className="rounded-none h-16 px-12 text-lg font-bold uppercase tracking-widest w-full border-white/20 hover:bg-white/5">
                Contact Us
              </Button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setModalOpen(false); setSubmitted(false); setForm({ name: "", phone: "", goal: "" }); } }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#111] border border-white/10 p-8 relative"
            >
              <button
                onClick={() => { setModalOpen(false); setSubmitted(false); setForm({ name: "", phone: "", goal: "" }); }}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">You're In!</h3>
                  <p className="text-muted-foreground">We'll reach out to you shortly. Get ready to transform.</p>
                  <Button className="mt-8 rounded-none px-10 h-12 uppercase font-bold tracking-widest" onClick={() => { setModalOpen(false); setSubmitted(false); }}>
                    Close
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-2 block">Start Your Journey</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Get In Touch</h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Your Goal</label>
                      <select
                        value={form.goal}
                        onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors appearance-none"
                      >
                        <option value="" className="bg-[#111]">Select a goal</option>
                        <option value="Fat Loss" className="bg-[#111]">Fat Loss</option>
                        <option value="Muscle Gain" className="bg-[#111]">Muscle Gain</option>
                        <option value="Body Recomposition" className="bg-[#111]">Body Recomposition</option>
                        <option value="General Fitness" className="bg-[#111]">General Fitness</option>
                        <option value="Athletic Performance" className="bg-[#111]">Athletic Performance</option>
                      </select>
                    </div>

                    {error && <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full rounded-none h-14 uppercase font-bold tracking-widest text-base mt-2">
                      {loading ? "Submitting..." : "Submit & Get Started"}
                      {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
