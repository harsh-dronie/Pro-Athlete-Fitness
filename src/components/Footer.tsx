import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Pro Athlete Fitness" className="w-8 h-8 object-contain" />
              <span className="font-display font-extrabold text-lg tracking-tighter uppercase">
                Pro Athlete <span className="text-primary">Fitness</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              The ultimate destination for those who demand excellence. Elite personal training and nutrition coaching for high-performers.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:text-background transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-8">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/#services" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Programs</Link></li>
              <li><Link to="/about-trainer" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">About Ronit</Link></li>
              <li><Link to="/transformations" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Transformations</Link></li>
              <li><Link to="/plans" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Plans & Pricing</Link></li>
              <li><Link to="/#contact" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-sm mb-8">Programs</h4>
            <ul className="space-y-4">
              {["Weight Loss", "Muscle Gain", "Body Recomp", "Online Coaching", "Nutrition"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm uppercase tracking-wider">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs uppercase tracking-widest">
            © 2024 Pro Athlete Fitness. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-muted-foreground hover:text-primary text-xs uppercase tracking-widest">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-xs uppercase tracking-widest">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
