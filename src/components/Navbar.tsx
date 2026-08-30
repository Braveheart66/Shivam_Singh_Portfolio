import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Sparkles, Send } from "lucide-react";
import { LiquidButton, MetalButton } from "@/components/ui/button";

const links = ["About", "Skills", "Projects", "Experience", "Contact"];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Home Brand Button */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-primary/30 bg-primary/10 hover:border-primary hover:bg-primary/20 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.15)] cursor-pointer"
        >
          <span className="text-primary font-mono text-xs tracking-wider">&lt;</span>
          <span className="font-display font-black text-base tracking-wider text-white group-hover:text-primary transition-colors">
            SHIVAM.DEV
          </span>
          <span className="text-primary font-mono text-xs tracking-wider">/&gt;</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-80 ml-0.5" />
        </motion.button>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="text-xs lg:text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
            >
              {l}
            </button>
          ))}

          {/* Quick Contact Metal Button in Navbar */}
          <MetalButton
            variant="primary"
            onClick={() => scrollTo("contact")}
            className="text-xs px-3.5 py-1.5 h-8 font-mono uppercase tracking-wider flex items-center gap-1.5"
          >
            <Send size={12} />
            <span>Connect</span>
          </MetalButton>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2 rounded-lg bg-secondary/50 border border-border/60"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong px-6 pb-6 border-b border-border/60 space-y-2"
        >
          {links.map((l) => (
            <button
              key={l}
              onClick={() => scrollTo(l)}
              className="block w-full text-left py-2.5 text-sm font-mono uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors border-b border-border/30 last:border-0"
            >
              {l}
            </button>
          ))}
          <div className="pt-3">
            <MetalButton
              variant="primary"
              onClick={() => scrollTo("contact")}
              className="w-full text-xs font-mono uppercase tracking-wider py-2"
            >
              <span>Get In Touch</span>
            </MetalButton>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
