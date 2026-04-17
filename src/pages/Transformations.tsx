import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchTransformations } from "@/lib/api";

const TransformationCard = ({ transformation, index }: { transformation: any, index: number, key?: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="group relative bg-secondary/30 border border-white/5 overflow-hidden hover:border-primary/50 transition-all duration-500"
  >
    <div className="relative aspect-[4/3] overflow-hidden flex">
      {/* Before Image */}
      <div className="relative flex-1 overflow-hidden border-r border-white/10">
        <img 
          src={transformation.beforeImg} 
          alt="Before" 
          className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/20 text-[10px] uppercase tracking-widest">Before</Badge>
        </div>
      </div>
      {/* After Image */}
      <div className="relative flex-1 overflow-hidden">
        <img 
          src={transformation.afterImg} 
          alt="After" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-primary text-black border-none text-[10px] uppercase tracking-widest font-bold">After</Badge>
        </div>
      </div>
    </div>

    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{transformation.name}</h3>
          <p className="text-primary font-bold text-sm uppercase tracking-widest">{transformation.result}</p>
        </div>
        <div className="flex text-primary">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-4 pt-4 border-t border-white/5">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Duration: <span className="text-foreground font-bold">{transformation.duration}</span>
        </div>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Program: <span className="text-foreground font-bold">{transformation.program}</span>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function TransformationsPage() {
  const [transformations, setTransformations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransformations()
      .then(setTransformations)
      .catch(() => setTransformations([]))
      .finally(() => setLoading(false));
  }, []);

  const staticFallback = [
    {
      clientName: "Alex Johnson",
      duration: "12 Weeks",
      resultDescription: "-15kg Fat Loss",
      beforeImageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
      afterImageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef03a7403f?q=80&w=2070&auto=format&fit=crop"
    },
    {
      clientName: "Sarah Miller",
      duration: "16 Weeks",
      resultDescription: "+5kg Muscle Gain",
      beforeImageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2070&auto=format&fit=crop",
      afterImageUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2070&auto=format&fit=crop"
    },
    {
      clientName: "Michael Chen",
      duration: "8 Weeks",
      resultDescription: "Core Strength",
      beforeImageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop",
      afterImageUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=2070&auto=format&fit=crop"
    },
  ];

  const data = transformations.length > 0 ? transformations : (loading ? [] : staticFallback);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="pt-24">
        {/* Header Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block"
            >
              Real People. Real Results.
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black uppercase italic leading-[0.9] mb-8"
            >
              Client <br /> <span className="text-primary">Transformations</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto uppercase tracking-widest leading-relaxed"
            >
              Witness the power of discipline and consistency. These are not just body changes; they are life changes.
            </motion.p>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[120px] -z-10" />
        </section>

        {/* Grid Section */}
        <section className="py-24 bg-secondary/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                <p className="text-muted-foreground col-span-3 text-center">Loading...</p>
              ) : data.map((item, index) => (
                <TransformationCard key={index} transformation={{
                  name: item.clientName || 'Anonymous',
                  duration: item.duration,
                  result: item.resultDescription,
                  program: item.duration,
                  beforeImg: item.beforeImageUrl?.startsWith('http') ? item.beforeImageUrl : `http://localhost:5001/${item.beforeImageUrl}`,
                  afterImg: item.afterImageUrl?.startsWith('http') ? item.afterImageUrl : `http://localhost:5001/${item.afterImageUrl}`,
                }} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center">
            <div className="glass-card p-16 md:p-24 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] -z-10" />
              <h2 className="text-4xl md:text-7xl font-black uppercase italic mb-8 leading-tight">
                Start Your <br />
                <span className="text-primary text-glow">Transformation</span> Today
              </h2>
              <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto uppercase tracking-widest">
                Don't wait for the "perfect" time. The perfect time is now. Join the elite team.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button className="rounded-none px-12 h-16 uppercase font-bold tracking-widest text-lg group">
                  Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Button>
                <Link to="/about-trainer">
                  <Button variant="outline" className="rounded-none px-12 h-16 uppercase font-bold tracking-widest text-lg border-white/10 hover:bg-white/5">
                    Meet the Coach
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
