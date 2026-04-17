import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop" 
          alt="Gym Background" 
          className="w-full h-full object-cover grayscale opacity-40"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-[0.3em] mb-6">
              Elite Training by Ronit Rajput
            </span>
            <h1 className="text-6xl md:text-8xl font-extrabold leading-[0.9] uppercase mb-8">
              Believe in <span className="text-primary">Yourself</span>. <br />
              Build <span className="italic font-light">Discipline</span>.
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
              Premium personal training and fat loss programs designed for high-performers who demand excellence in every aspect of life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/plans">
                <Button size="lg" className="rounded-none h-16 px-10 text-lg font-bold uppercase tracking-widest group">
                  Join Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/transformations">
                <Button size="lg" variant="outline" className="rounded-none h-16 px-10 text-lg font-bold uppercase tracking-widest border-white/20 hover:bg-white/5">
                  <Play className="mr-2 w-5 h-5 fill-current" />
                  View Results
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-16 flex items-center gap-8"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-background overflow-hidden bg-muted">
                  <img 
                    src={`https://i.pravatar.cc/150?u=${i}`} 
                    alt="Client" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wider">500+ Success Stories</p>
              <div className="flex text-primary gap-0.5 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[80%] z-0 hidden lg:block">
        <motion.img 
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=2070&auto=format&fit=crop" 
          alt="Trainer" 
          className="w-full h-full object-contain grayscale brightness-75"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
