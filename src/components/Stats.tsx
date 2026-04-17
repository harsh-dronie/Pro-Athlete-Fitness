import { motion } from "motion/react";

export default function Stats() {
  const stats = [
    { value: "500+", label: "Transformations" },
    { value: "15+", label: "Expert Trainers" },
    { value: "3+", label: "Years Experience" },
    { value: "98%", label: "Client Success" },
  ];

  return (
    <section className="py-20 bg-primary text-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-2">
                {stat.value}
              </h3>
              <p className="font-bold uppercase tracking-widest text-xs md:text-sm opacity-80">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
