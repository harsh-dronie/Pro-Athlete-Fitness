import { motion } from "motion/react";
import { CheckCircle2, Trophy, Clock, Flame } from "lucide-react";

export default function WhyChooseUs() {
  const points = [
    {
      title: "Customized Nutrition",
      desc: "No cookie-cutter diets. We build plans around your lifestyle and preferences.",
      icon: <Flame className="w-8 h-8" />
    },
    {
      title: "Elite Coaching",
      desc: "Direct access to expert trainers with years of experience in high-performance sports.",
      icon: <Trophy className="w-8 h-8" />
    },
    {
      title: "Flexible Scheduling",
      desc: "Training that fits your busy schedule, whether in-person or online.",
      icon: <Clock className="w-8 h-8" />
    },
    {
      title: "Proven Results",
      desc: "A track record of hundreds of successful transformations across all fitness levels.",
      icon: <CheckCircle2 className="w-8 h-8" />
    }
  ];

  return (
    <section id="why-us" className="py-24 relative overflow-hidden">
      {/* Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] font-black text-white/5 uppercase select-none pointer-events-none whitespace-nowrap z-0">
        Discipline
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">The Advantage</span>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-tight mb-8">
              Why Choose <br />
              <span className="text-primary">Pro Athlete Fitness</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-lg">
              We believe that fitness is not just about looking good—it's about building a mind and body that can handle any challenge.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {points.map((point, i) => (
                <div key={point.title} className="flex flex-col gap-4">
                  <div className="w-14 h-14 bg-secondary flex items-center justify-center border border-white/5 text-primary">
                    {point.icon}
                  </div>
                  <div>
                    <h4 className="font-bold uppercase tracking-tight mb-2">{point.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square relative z-10 overflow-hidden border-8 border-secondary">
              <img 
                src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop" 
                alt="Gym Training" 
                className="w-full h-full object-cover grayscale"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Decorative boxes */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary -z-10" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-2 border-primary/30 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
