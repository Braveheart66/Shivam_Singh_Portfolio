import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Code2, BrainCircuit, Cloud, Layers, Database, ShieldCheck } from "lucide-react";

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java", "SQL", "C", "HTML/CSS"],
    color: "from-primary to-primary/60",
    glow: "rgba(0, 243, 255, 0.15)",
  },
  {
    title: "AI / ML & GenAI",
    icon: BrainCircuit,
    skills: ["Machine Learning", "Deep Learning", "NLP", "RAG", "LLM (Ollama/Qwen2.5)", "Generative AI", "PyTorch", "OpenCV"],
    color: "from-accent to-accent/60",
    glow: "rgba(0, 120, 255, 0.18)",
  },
  {
    title: "Cloud & Serverless",
    icon: Cloud,
    skills: ["AWS Lambda", "AWS DynamoDB", "AWS S3", "AWS CDK", "Amazon Rekognition", "SageMaker A2I", "Cognito"],
    color: "from-primary to-accent",
    glow: "rgba(0, 243, 255, 0.15)",
  },
  {
    title: "Frameworks & Libraries",
    icon: Layers,
    skills: ["Django REST", "React + Vite", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "shadcn/ui"],
    color: "from-primary/80 to-accent/80",
    glow: "rgba(0, 243, 255, 0.12)",
  },
  {
    title: "Databases & Vector DBs",
    icon: Database,
    skills: ["PostgreSQL", "Qdrant", "Redis", "SQL", "Vector Search"],
    color: "from-accent/80 to-primary/80",
    glow: "rgba(0, 120, 255, 0.15)",
  },
  {
    title: "DevOps & Certifications",
    icon: ShieldCheck,
    skills: ["AWS ML Foundations", "AWS Agentic AI", "Oracle OCI GenAI Pro", "Docker", "Celery", "GitHub Actions", "Streamlit"],
    color: "from-primary to-primary/80",
    glow: "rgba(0, 243, 255, 0.15)",
  },
];

const SkillCard = ({ cat, i, inView }: { cat: typeof skillCategories[0]; i: number; inView: boolean }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setSpotlightPos({ x: mouseX, y: mouseY });

    const xPct = (mouseX / rect.width - 0.5) * 2;
    const yPct = (mouseY / rect.height - 0.5) * 2;
    setRotate({ x: -yPct * 8, y: xPct * 8 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const Icon = cat.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.08 * i, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-5px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-6 md:p-8 group hover:border-primary/60 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_0_35px_rgba(0,243,255,0.18)] cursor-pointer select-none"
    >
      {/* Top glowing accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cat.color} opacity-30 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Dynamic Cursor Spotlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${cat.glow}, transparent 70%)`,
        }}
      />

      <div style={{ transform: "translateZ(25px)" }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300">
              <Icon size={20} />
            </div>
            <h3 className="font-display font-bold text-lg md:text-xl text-foreground group-hover:text-primary transition-colors">
              {cat.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {cat.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1.5 text-xs bg-secondary/60 hover:bg-primary/15 text-muted-foreground hover:text-foreground uppercase tracking-wider font-semibold border border-border/50 hover:border-primary/40 transition-all duration-200 rounded-lg backdrop-blur-sm"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["40px", "-40px"]);

  return (
    <section id="skills" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative z-10 overflow-hidden" ref={sectionRef}>
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], ["60px", "-60px"]) }}
        className="absolute -left-40 top-1/2 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[130px] pointer-events-none"
      />

      <div className="max-w-[90rem] mx-auto border-x border-border p-8 md:p-16 lg:p-20 relative" ref={ref}>
        <motion.div
          style={{ y: parallaxY }}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-xs mb-3">Skills & Stack</p>
          <h2 className="font-display text-3xl md:text-6xl font-bold uppercase tracking-tight">
            Tools & <span className="text-primary">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.title} cat={cat} i={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
