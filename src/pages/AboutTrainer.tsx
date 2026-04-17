import { motion } from "motion/react";
import { Trophy, Award, Users, CheckCircle2, ArrowLeft, ArrowRight, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { fetchAbout, submitLead } from "@/lib/api";
import { AnimatePresence } from "motion/react";

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
  index: number;
  key?: any;
}

const TimelineItem = ({ year, title, description, index }: TimelineItemProps) => (
  <motion.div 
    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay: index * 0.2 }}
    className={`flex flex-col md:flex-row gap-8 mb-20 relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
  >
    {/* Timeline Dot */}
    <div className="absolute left-0 md:left-1/2 top-0 w-4 h-4 bg-primary rounded-full -translate-x-1/2 z-10 hidden md:block" />
    
    <div className="w-full md:w-1/2 px-4 md:px-12 text-left md:text-right">
      {index % 2 !== 0 && <div className="hidden md:block" />}
      <div className={index % 2 === 0 ? "" : "md:text-left"}>
        <span className="text-primary font-black text-4xl mb-2 block">{year}</span>
        <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
    <div className="w-full md:w-1/2" />
  </motion.div>
);

export default function AboutTrainer() {
  const [about, setAbout] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", goal: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError("Name and phone are required."); return; }
    setError(""); setLoading(true);
    try { await submitLead(form); setSubmitted(true); }
    catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const closeModal = () => { setModalOpen(false); setSubmitted(false); setForm({ name: "", phone: "", goal: "" }); };

  useEffect(() => {
    fetchAbout().then(setAbout).catch(() => setAbout(null));
  }, []);

  const timeline = about?.milestones?.length ? about.milestones.map((m: any) => ({
    year: m.year,
    title: m.description,
    description: m.description,
  })) : [
    { year: "2018", title: "The Starting Point", description: "Started as a skinny teenager with zero knowledge of fitness. I was intimidated by the gym but driven by a desire to change my life." },
    { year: "2019", title: "The Struggles", description: "Faced multiple injuries and plateaus. I realized that hard work without science is just wasted energy. This is where the real learning began." },
    { year: "2021", title: "The Transformation", description: "After years of consistent training and studying nutrition, I achieved my peak physique. I decided to dedicate my life to helping others avoid my mistakes." },
    { year: "2024", title: "Current Status", description: "Leading Pro Athlete Fitness, I've helped over 500 individuals transform their lives. My mission is to build not just bodies, but discipline." }
  ];

  const trainerName = about?.trainerName || "Ronit Rajput";
  const bio = about?.bio || '"My journey wasn\'t about building a body; it was about building a mindset that refuses to quit."';
  const profileImage = about?.profileImageUrl
    ? (about.profileImageUrl.startsWith('http') ? about.profileImageUrl : `http://localhost:5001/${about.profileImageUrl}`)
    : "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop";

  const achievements = [
    { icon: <Trophy className="w-8 h-8" />, label: "Experience", value: "5+ Years" },
    { icon: <Award className="w-8 h-8" />, label: "Certifications", value: "Certified Coach" },
    { icon: <Users className="w-8 h-8" />, label: "Clients Trained", value: "500+" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] bg-secondary border border-white/5 overflow-hidden premium-shadow">
                <img
                  src={profileImage}
                  alt={trainerName}
                  className="w-full h-full object-cover grayscale brightness-90"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
            </motion.div>

            <div>
              <Link to="/">
                <Button variant="ghost" className="mb-8 text-muted-foreground hover:text-primary p-0">
                  <ArrowLeft className="mr-2 w-4 h-4" /> Back to Home
                </Button>
              </Link>
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Meet Your Coach</span>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] mb-8">
                {trainerName.split(' ')[0]} <br /> <span className="text-primary">{trainerName.split(' ').slice(1).join(' ')}</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
                {bio}
              </p>
              <div className="flex gap-4">
                <Button onClick={() => setModalOpen(true)} className="rounded-none px-8 h-14 uppercase font-bold tracking-widest">Start Training</Button>
                <a href="https://wa.me/919872881023" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-none px-8 h-14 uppercase font-bold tracking-widest border-white/20 hover:bg-white/5">Contact Us</Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-secondary/20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-4">My <span className="text-primary">Journey</span></h2>
              <p className="text-muted-foreground uppercase tracking-widest text-sm">From zero to elite performance</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              {/* Vertical Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 hidden md:block" />
              
              {timeline.map((item, index) => (
                <TimelineItem key={index} year={item.year} title={item.title} description={item.description} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="glass-card p-12 md:p-20 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-10" />
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl md:text-6xl font-black uppercase italic mb-12">The <span className="text-primary">Philosophy</span></h2>
                <div className="grid md:grid-cols-3 gap-12">
                  {[
                    { title: "Discipline", desc: "Doing what needs to be done, even when you don't feel like it." },
                    { title: "Consistency", desc: "Small actions repeated daily lead to massive transformations." },
                    { title: "No Shortcuts", desc: "Real results require real work. We don't sell magic pills." }
                  ].map((p, i) => (
                    <div key={i} className="space-y-4">
                      <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="text-primary w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-bold uppercase tracking-tight">{p.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section className="py-24 bg-secondary/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              {achievements.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto rounded-full">
                    <div className="text-primary">{a.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-primary mb-1">{a.value}</h3>
                    <p className="text-sm uppercase tracking-widest text-muted-foreground font-bold">{a.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Get Started Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
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
                  <p className="text-muted-foreground">We'll reach out to you shortly. Get ready to transform.</p>
                  <Button className="mt-8 rounded-none px-10 h-12 uppercase font-bold tracking-widest" onClick={closeModal}>Close</Button>
                </div>
              ) : (
                <>
                  <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-2 block">Start Your Journey</span>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-8">Get In Touch</h3>
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
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold block mb-2">Your Goal</label>
                      <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 h-12 text-sm focus:outline-none focus:border-primary transition-colors appearance-none">
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
    </div>
  );
}
