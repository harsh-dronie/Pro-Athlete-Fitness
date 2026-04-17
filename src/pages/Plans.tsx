import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchPlans, submitLead } from "@/lib/api";
import { AnimatePresence } from "motion/react";

interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  duration: string;
  features: string[];
  badge?: string;
}

export default function Plans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlans()
      .then(setPlans)
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (plan: Plan) => {
    setSelectedPlan(plan);
    setForm({ name: "", phone: "", goal: plan.name });
    setSubmitted(false);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPlan(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Name and phone are required."); return; }
    setError(""); setSubmitting(true);
    try {
      await submitLead({ name: form.name, phone: form.phone, goal: `${selectedPlan?.name} - ${form.goal}` });
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fallbackPlans: Plan[] = [
    {
      _id: "1",
      name: "Starter",
      description: "Perfect for beginners looking to kickstart their fitness journey.",
      price: 3000,
      duration: "1 Month",
      features: ["Personalized workout plan", "Diet guidance", "Weekly check-ins", "WhatsApp support"],
    },
    {
      _id: "2",
      name: "Pro",
      description: "For serious athletes ready to take their training to the next level.",
      price: 8000,
      discountedPrice: 7000,
      duration: "3 Months",
      badge: "Most Popular",
      features: ["Custom workout program", "Full nutrition plan", "Bi-weekly video calls", "24/7 WhatsApp support", "Progress tracking", "Supplement guidance"],
    },
    {
      _id: "3",
      name: "Elite",
      description: "The ultimate transformation package for maximum results.",
      price: 15000,
      discountedPrice: 12000,
      duration: "6 Months",
      features: ["Elite training program", "Macro-based meal plan", "Weekly video calls", "Priority support", "Body composition analysis", "Supplement plan", "Lifestyle coaching"],
    },
  ];

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24">
        {/* Header */}
        <section className="py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Invest In Yourself</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase leading-[0.9] mb-6">
              Choose Your <br /><span className="text-primary italic">Plan</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Every plan is designed to deliver real results. Pick the one that matches your commitment level.
            </p>
          </motion.div>
        </section>

        {/* Plans Grid */}
        <section className="pb-24">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {displayPlans.map((plan, i) => {
                  const isPopular = plan.badge === "Most Popular";
                  const discount = plan.discountedPrice
                    ? Math.round(((plan.price - plan.discountedPrice) / plan.price) * 100)
                    : 0;

                  return (
                    <motion.div
                      key={plan._id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className={`relative flex flex-col border ${isPopular ? "border-primary" : "border-white/10"} bg-secondary/40 backdrop-blur-sm`}
                    >
                      {plan.badge && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-background text-xs font-black uppercase tracking-widest px-4 py-1">
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className={`p-8 border-b ${isPopular ? "border-primary/30" : "border-white/5"}`}>
                        <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{plan.name}</h3>
                        <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                        <div className="flex items-end gap-3 mb-2">
                          <span className="text-4xl font-black text-primary">
                            ₹{(plan.discountedPrice ?? plan.price).toLocaleString()}
                          </span>
                          {plan.discountedPrice && (
                            <span className="text-muted-foreground line-through text-lg mb-1">
                              ₹{plan.price.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{plan.duration}</span>
                          {discount > 0 && (
                            <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-2 py-0.5">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-8 flex-1 flex flex-col">
                        <ul className="space-y-3 flex-1 mb-8">
                          {plan.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-3 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                              <span className="text-muted-foreground">{f}</span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          onClick={() => openModal(plan)}
                          className={`rounded-none h-12 uppercase font-bold tracking-widest w-full group ${isPopular ? "" : "bg-white/10 hover:bg-primary text-white hover:text-background"}`}
                          variant={isPopular ? "default" : "ghost"}
                        >
                          Get Started
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* WhatsApp CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="text-muted-foreground mb-4 text-sm uppercase tracking-widest">Not sure which plan is right for you?</p>
              <a href="https://wa.me/919872881023" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="rounded-none h-14 px-10 uppercase font-bold tracking-widest border-white/20 hover:bg-white/5">
                  Chat With Ronit on WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Enroll Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-[#111] border border-white/10 p-8 relative"
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-muted-foreground hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-black uppercase tracking-tight mb-2">You're In!</h3>
                  <p className="text-muted-foreground">We'll reach out to confirm your <span className="text-primary font-bold">{selectedPlan?.name}</span> plan shortly.</p>
                  <Button className="mt-8 rounded-none px-10 h-12 uppercase font-bold tracking-widest" onClick={closeModal}>Close</Button>
                </div>
              ) : (
                <>
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-2 block">Enroll Now</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-1">{selectedPlan?.name} Plan</h3>
                  <p className="text-muted-foreground text-sm mb-8">
                    ₹{(selectedPlan?.discountedPrice ?? selectedPlan?.price ?? 0).toLocaleString()} / {selectedPlan?.duration}
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Full Name *</label>
                      <input type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Phone Number *</label>
                      <input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/30 px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    {error && <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>}
                    <Button type="submit" disabled={submitting} className="w-full rounded-none h-14 uppercase font-bold tracking-widest text-base mt-2">
                      {submitting ? "Submitting..." : "Confirm Enrollment"}
                      {!submitting && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
