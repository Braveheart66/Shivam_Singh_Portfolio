import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Github, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

const ContactSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sending, setSending] = useState(false);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["50px", "-30px"]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/shivamsinghraghuvanshi1234@gmail.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `New Portfolio Inquiry from ${name}`,
          _template: "table",
        }),
      });

      if (response.ok) {
        toast.success("Message sent successfully! I'll get back to you soon.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        // Fallback
        window.open(`mailto:shivamsinghraghuvanshi1234@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`);
        toast.success("Opening your email client to send message...");
      }
    } catch {
      window.open(`mailto:shivamsinghraghuvanshi1234@gmail.com?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`);
      toast.success("Opening your email client to send message...");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative overflow-hidden" ref={sectionRef}>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]) }}
        className="absolute right-1/4 bottom-0 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none"
      />

      <div className="max-w-[90rem] mx-auto border-x border-border p-8 md:p-16 lg:p-20 relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-14"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-xs mb-3">Contact</p>
          <h2 className="font-display text-3xl md:text-6xl font-bold uppercase tracking-tight mb-4">
            Let's Build <span className="text-primary">Together</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Have a project idea, open role, or just want to connect? I'd love to hear from you.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass rounded-2xl p-8 md:p-10 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6 relative z-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <label className="text-sm text-muted-foreground mb-2 block">Name</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pointer-events-auto cursor-text relative z-20"
                placeholder="Your name"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label className="text-sm text-muted-foreground mb-2 block">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all pointer-events-auto cursor-text relative z-20"
                placeholder="your@email.com"
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-20"
          >
            <label className="text-sm text-muted-foreground mb-2 block">Message</label>
            <textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none pointer-events-auto cursor-text relative z-20"
              placeholder="Tell me about your project..."
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={sending}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto px-8 py-3 rounded-lg font-medium text-primary-foreground bg-gradient-to-r from-primary to-accent hover:shadow-[0_0_30px_hsl(199,89%,48%,0.3)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {sending ? (
              <span className="animate-pulse">Sending Message...</span>
            ) : (
              <>
                <Send size={16} /> Send Message
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex justify-center gap-6 mt-10"
        >
          {[
            { icon: Github, href: "https://github.com/Braveheart66", label: "GitHub" },
            { icon: Linkedin, href: "https://linkedin.com/in/shivam-singh-93ab0b2a7", label: "LinkedIn" },
            { icon: Mail, href: "mailto:shivamsinghraghuvanshi1234@gmail.com", label: "Email" },
          ].map((social, i) => (
            <motion.a
              key={social.label}
              href={social.href}
              aria-label={social.label}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4, scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              className="w-12 h-12 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:neon-glow transition-all duration-300"
            >
              <social.icon size={20} />
            </motion.a>
          ))}
        </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
