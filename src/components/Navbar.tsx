import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Send } from "lucide-react";
import { LiquidButton } from "@/components/ui/button";

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
        scrolled ? "glass-strong border-b border-border/60 py-2.5" : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Home Brand Liquid Glass Button */}
        <LiquidButton
          size="sm"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="px-4 py-1.5 h-9 text-xs sm:text-sm font-mono font-bold tracking-wider"
        >
          <span className="text-primary font-mono text-xs tracking-wider">&lt;</span>
          <span className="font-display font-black text-sm sm:text-base tracking-wider text-white">
            SHIVAM.DEV
          </span>
          <span className="text-primary font-mono text-xs tracking-wider">/&gt;</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping opacity-90 ml-1" />
        </LiquidButton>

        {/* Desktop Nav Links using Liquid Glass Buttons */}
        <div className="hidden md:flex items-center gap-2 lg:gap-3">
          {links.map((l) => (
            <LiquidButton
              key={l}
              size="sm"
              onClick={() => scrollTo(l)}
              className="text-xs font-mono uppercase tracking-wider px-3.5 py-1 h-8 text-white/80 hover:text-white"
            >
              {l}
            </LiquidButton>
          ))}

          {/* Quick Connect Liquid Glass Button */}
          <LiquidButton
            size="sm"
            onClick={() => scrollTo("contact")}
            className="text-xs px-4 py-1.5 h-8 font-mono uppercase tracking-wider flex items-center gap-1.5 text-primary ml-2"
          >
            <Send size={12} />
            <span>Connect</span>
          </LiquidButton>
        </div>

        {/* Mobile toggle */}
        <LiquidButton
          size="icon"
          className="md:hidden h-9 w-9 p-0"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </LiquidButton>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong px-6 py-4 border-b border-border/60 space-y-2 mt-2"
        >
          {links.map((l) => (
            <LiquidButton
              key={l}
              size="sm"
              onClick={() => scrollTo(l)}
              className="w-full text-left justify-start py-2 text-xs font-mono uppercase tracking-wider text-white/90"
            >
              {l}
            </LiquidButton>
          ))}
          <div className="pt-2">
            <LiquidButton
              size="sm"
              onClick={() => scrollTo("contact")}
              className="w-full py-2 text-xs font-mono uppercase tracking-wider text-primary"
            >
              <Send size={12} className="mr-1" />
              <span>Get In Touch</span>
            </LiquidButton>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
