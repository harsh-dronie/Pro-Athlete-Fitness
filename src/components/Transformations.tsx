import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchTransformations } from "@/lib/api";
import { getImageUrl } from "@/lib/api";

export default function Transformations() {
  const [transformations, setTransformations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransformations()
      .then(setTransformations)
      .catch(() => setTransformations([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (transformations.length === 0) return null;

  const preview = transformations.slice(0, 3);

  return (
    <section id="transformations" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Real Results</span>
          <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-tight mb-6">
            The Proof Is In <br />
            <span className="text-primary italic">The Process</span>
          </h2>
          <p className="text-muted-foreground">
            Witness the incredible transformations of our clients who committed to the discipline and followed the plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {preview.map((item, i) => {
            const beforeImg = getImageUrl(item.beforeImageUrl);
            const afterImg = getImageUrl(item.afterImageUrl);

            return (
              <motion.div
                key={item._id || i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary mb-6">
                  <div className="absolute top-4 left-4 z-20">
                    <Badge className="rounded-none bg-background/80 backdrop-blur-sm text-white border-none uppercase tracking-widest text-[10px]">Before</Badge>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="rounded-none bg-primary text-background border-none uppercase tracking-widest text-[10px] font-bold">After</Badge>
                  </div>
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 h-full overflow-hidden border-r border-background z-10">
                      <img
                        src={beforeImg}
                        alt="Before"
                        className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="w-1/2 h-full overflow-hidden">
                      <img
                        src={afterImg}
                        alt="After"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-xl font-bold uppercase tracking-tight">{item.clientName || 'Anonymous'}</h4>
                    <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{item.resultDescription}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">{item.duration}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <Link to="/transformations">
            <Button size="lg" className="rounded-none h-14 px-12 uppercase font-bold tracking-widest group">
              See All Transformations
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
