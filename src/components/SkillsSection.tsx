import { motion } from "framer-motion";
import { Code2, BrainCircuit, Cloud, Layers, Database, ShieldCheck } from "lucide-react";
import { InteractiveTiltCard } from "@/components/ui/interactive-tilt-card";

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java", "SQL", "C", "HTML/CSS"],
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(0, 243, 255, 0.25)",
    iconBg: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
  },
  {
    title: "AI / ML & GenAI",
    icon: BrainCircuit,
    skills: ["Machine Learning", "Deep Learning", "NLP", "RAG", "LLM (Ollama/Qwen2.5)", "Generative AI", "PyTorch", "OpenCV"],
    color: "from-blue-500 to-indigo-500",
    glow: "rgba(59, 130, 246, 0.25)",
    iconBg: "bg-blue-500/10 border-blue-500/30 text-blue-400",
  },
  {
    title: "Cloud & Serverless",
    icon: Cloud,
    skills: ["AWS Lambda", "AWS DynamoDB", "AWS S3", "AWS CDK", "Amazon Rekognition", "SageMaker A2I", "Cognito"],
    color: "from-teal-400 to-emerald-500",
    glow: "rgba(20, 184, 166, 0.25)",
    iconBg: "bg-teal-500/10 border-teal-500/30 text-teal-400",
  },
  {
    title: "Frameworks & Libraries",
    icon: Layers,
    skills: ["Django REST", "React + Vite", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "shadcn/ui"],
    color: "from-violet-500 to-purple-500",
    glow: "rgba(139, 92, 246, 0.25)",
    iconBg: "bg-violet-500/10 border-violet-500/30 text-violet-400",
  },
  {
    title: "Databases & Vector DBs",
    icon: Database,
    skills: ["PostgreSQL", "Qdrant", "Redis", "SQL", "Vector Search"],
    color: "from-sky-400 to-cyan-500",
    glow: "rgba(14, 165, 233, 0.25)",
    iconBg: "bg-sky-500/10 border-sky-500/30 text-sky-400",
  },
  {
    title: "DevOps & Certifications",
    icon: ShieldCheck,
    skills: ["AWS ML Foundations", "AWS Agentic AI", "Oracle OCI GenAI Pro", "Docker", "Celery", "GitHub Actions", "Streamlit"],
    color: "from-emerald-400 to-green-500",
    glow: "rgba(16, 185, 129, 0.25)",
    iconBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  },
];

const SkillCard = ({ cat, i }: { cat: typeof skillCategories[0]; i: number }) => {
  const Icon = cat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <InteractiveTiltCard
        maxTilt={14}
        depth={35}
        glowColor={cat.glow}
        className="h-full bg-[#0a0d14]/90 dark:bg-[#070a10]/95 backdrop-blur-2xl border border-white/15 dark:border-white/10 rounded-2xl p-6 sm:p-8 group hover:border-primary/60 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-xl cursor-pointer select-none"
      >
        {/* Top glowing accent line */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${cat.color} opacity-40 group-hover:opacity-100 transition-opacity duration-300`} />

        {/* Ambient Top Glow */}
        <div className={`absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b ${cat.color} rounded-full blur-3xl opacity-10 group-hover:opacity-25 transition-opacity duration-500 pointer-events-none`} />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header with 3D translation */}
          <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3.5">
              <div className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,243,255,0.35)] ${cat.iconBg}`}>
                <Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">
                {cat.title}
              </h3>
            </div>
          </div>

          {/* Skill chips with 3D elevation */}
          <div style={{ transform: "translateZ(20px)", transformStyle: "preserve-3d" }} className="flex flex-wrap gap-2 pt-1">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 text-xs font-mono font-medium bg-secondary/50 hover:bg-primary/15 text-muted-foreground hover:text-primary uppercase tracking-wider border border-white/10 hover:border-primary/50 transition-all duration-200 rounded-lg backdrop-blur-sm hover:shadow-[0_0_12px_rgba(0,243,255,0.2)]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </InteractiveTiltCard>
    </motion.div>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative z-10 overflow-hidden py-16 sm:py-24">
      <div className="max-w-[90rem] mx-auto border-x border-border p-8 md:p-16 lg:p-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-xs mb-3">Skills & Stack</p>
          <h2 className="font-display text-3xl md:text-6xl font-bold uppercase tracking-tight">
            Tools & <span className="text-primary">Technologies</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: "1200px" }}>
          {skillCategories.map((cat, i) => (
            <SkillCard key={cat.title} cat={cat} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
