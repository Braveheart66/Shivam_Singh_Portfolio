import { motion } from "framer-motion";
import { Code2, BrainCircuit, Cloud, Layers, Database, ShieldCheck } from "lucide-react";
import { InteractiveTiltCard } from "@/components/ui/interactive-tilt-card";

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Python", "Java", "SQL", "C", "HTML/CSS"],
  },
  {
    title: "AI / ML & GenAI",
    icon: BrainCircuit,
    skills: ["Machine Learning", "Deep Learning", "NLP", "RAG", "LLM (Ollama/Qwen2.5)", "Generative AI", "PyTorch", "OpenCV"],
  },
  {
    title: "Cloud & Serverless",
    icon: Cloud,
    skills: ["AWS Lambda", "AWS DynamoDB", "AWS S3", "AWS CDK", "Amazon Rekognition", "SageMaker A2I", "Cognito"],
  },
  {
    title: "Frameworks & Libraries",
    icon: Layers,
    skills: ["Django REST", "React + Vite", "scikit-learn", "Pandas", "NumPy", "Matplotlib", "shadcn/ui"],
  },
  {
    title: "Databases & Vector DBs",
    icon: Database,
    skills: ["PostgreSQL", "Qdrant", "Redis", "SQL", "Vector Search"],
  },
  {
    title: "DevOps & Certifications",
    icon: ShieldCheck,
    skills: ["AWS ML Foundations", "AWS Agentic AI", "Oracle OCI GenAI Pro", "Docker", "Celery", "GitHub Actions", "Streamlit"],
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
        maxTilt={12}
        depth={25}
        glowColor="rgba(0, 243, 255, 0.15)"
        className="h-full bg-card border border-border rounded-2xl p-6 sm:p-8 group hover:border-primary/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-lg cursor-pointer select-none"
      >
        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Header with 3D translation */}
          <div style={{ transform: "translateZ(25px)", transformStyle: "preserve-3d" }} className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all duration-300">
                <Icon size={20} />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">
                {cat.title}
              </h3>
            </div>
          </div>

          {/* Skill chips with 3D elevation */}
          <div style={{ transform: "translateZ(15px)", transformStyle: "preserve-3d" }} className="flex flex-wrap gap-2 pt-1">
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
