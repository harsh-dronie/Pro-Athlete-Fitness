import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Zap, Users, ShieldCheck } from "lucide-react";

export default function Services() {
  const services = [
    {
      title: "Weight Loss",
      description: "Science-backed nutrition and training protocols to melt fat while preserving muscle.",
      icon: <Target className="w-10 h-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Muscle Gain",
      description: "Hypertrophy focused programs designed to build a powerful, athletic physique.",
      icon: <Zap className="w-10 h-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1581009146145-b5ef03a94e77?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Personal Training",
      description: "One-on-one elite coaching with personalized attention to form and intensity.",
      icon: <Users className="w-10 h-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Beginner Friendly",
      description: "Foundational programs to help you start your fitness journey with confidence.",
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
      image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Expertise</span>
            <h2 className="text-4xl md:text-6xl font-extrabold uppercase leading-tight">
              Elite Training <br />
              <span className="text-muted-foreground">For Elite Results</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm">
            We don't do generic. Every program is engineered to push your limits and deliver measurable transformations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group relative h-[450px] overflow-hidden border-white/5 bg-secondary rounded-none">
                <div className="absolute inset-0 z-0">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                </div>
                
                <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
                  <div className="mb-6 transform group-hover:-translate-y-2 transition-transform duration-500">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold uppercase mb-4 tracking-tight group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    {service.description}
                  </p>
                  <div className="mt-6 w-12 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
