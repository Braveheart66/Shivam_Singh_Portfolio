import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";

const skillCategories = [
  { title: "Languages", skills: ["Python", "Java", "SQL", "C", "HTML/CSS"], color: "from-primary to-primary/60" },
  { title: "AI / ML & GenAI", skills: ["Machine Learning", "Deep Learning", "NLP", "RAG", "LLM (Ollama/Qwen2.5)", "Generative AI", "PyTorch", "OpenCV"], color: "from-accent to-accent/60" },
  { title: "Cloud & Serverless", skills: ["AWS Lambda", "AWS DynamoDB", "AWS S3", "AWS CDK", "Amazon Rekognition", "SageMaker A2I", "Cognito"], color: "from-primary to-accent" },
  { title: "Frameworks & Libraries", skills: ["Django REST", "React + Vite", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "shadcn/ui"], color: "from-primary/80 to-accent/80" },
  { title: "Databases & Vector DBs", skills: ["PostgreSQL", "Qdrant", "Redis", "SQL", "Vector Search"], color: "from-accent/80 to-primary/80" },
  { title: "DevOps & Certifications", skills: ["AWS ML Foundations", "AWS Agentic AI", "Oracle OCI GenAI Pro", "Docker", "Celery", "GitHub Actions", "Streamlit"], color: "from-primary to-primary/80" },
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

    const xPct = (mouseX / rect.width - 0.5) * 2; // -1 to 1
    const yPct = (mouseY / rect.height - 0.5) * 2; // -1 to 1
    setRotate({ x: -yPct * 10, y: xPct * 10 });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

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
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-4px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className="bg-card border border-border/80 rounded-xl p-6 md:p-8 group hover:border-primary/60 transition-colors duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] cursor-pointer select-none"
    >
      {/* Top glowing accent line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Dynamic Cursor Spotlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 243, 255, 0.18), transparent 70%)`,
        }}
      />

      <div style={{ transform: "translateZ(25px)" }}>
        <h3 className="font-display font-bold text-lg md:text-xl mb-4 text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
          <span>{cat.title}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_#00f3ff] transition-all" />
        </h3>
        <div className="flex flex-wrap gap-2">
          {cat.skills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 text-xs bg-secondary/80 text-secondary-foreground uppercase tracking-wider font-semibold border border-border/50 group-hover:border-primary/30 group-hover:text-foreground transition-all duration-300 rounded-md"
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
