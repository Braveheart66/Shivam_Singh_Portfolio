import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "HITL Content Moderation Engine",
    desc: "Serverless, event-driven content moderation pipeline on AWS CDK with Rekognition scoring, 3-tier routing (auto-approve, human review, quarantine), DynamoDB GSI querying, and SageMaker Ground Truth A2I reviewer portal.",
    tech: ["AWS CDK", "Lambda", "Rekognition", "SageMaker A2I", "DynamoDB", "Streamlit"],
    gradient: "from-primary/20 to-accent/20",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-2",
    link: "https://github.com/Braveheart66"
  },
  {
    title: "NotyBrain – AI PKM System",
    desc: "Full-stack, privacy-first knowledge management SPA with a local RAG pipeline (Qwen2.5 via Ollama), Qdrant vector search, grounded Q&A with citations, and Knowledge Graph API.",
    tech: ["React + Vite", "Django REST", "Qdrant", "Ollama", "PostgreSQL", "Docker"],
    gradient: "from-accent/20 to-primary/20",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Braveheart66"
  },
  {
    title: "Drone-Based Deforestation AI",
    desc: "AI-powered remote sensing pipeline using NDVI analysis and geospatial satellite imagery to detect and quantify temporal deforestation patterns.",
    tech: ["Python", "Computer Vision", "NDVI Analysis", "Deep Learning", "Geospatial"],
    gradient: "from-primary/20 to-primary/10",
    colSpan: "md:col-span-1",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Braveheart66"
  },
  {
    title: "AI Driver Fatigue Drift Monitor",
    desc: "Real-time fatigue monitoring framework modeling continuous temporal drift using BiLSTM-GRU architecture, weakly supervised MIL, and sub-20ms inference with XAI attributions.",
    tech: ["PyTorch", "Computer Vision", "OpenCV", "Streamlit", "ONNX", "Docker"],
    gradient: "from-accent/20 to-accent/10",
    colSpan: "md:col-span-2",
    rowSpan: "md:row-span-1",
    link: "https://github.com/Braveheart66"
  },
];

const ProjectCard = ({ project, i }: { project: typeof projects[0]; i: number }) => {
  const [hovered, setHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLAnchorElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setSpotlightPos({ x: mouseX, y: mouseY });

    const xPct = (mouseX / rect.width - 0.5) * 2;
    const yPct = (mouseY / rect.height - 0.5) * 2;
    setRotate({ x: -yPct * 8, y: xPct * 8 });
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => {
    setHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * i, ease: "easeOut" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: hovered
          ? `perspective(1200px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateY(-2px)`
          : 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0px)',
        transition: hovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
      }}
      className={`relative group bg-card border-b border-border md:border-b md:border-r last:border-b-0 md:last:border-b-0 overflow-hidden block ${project.colSpan} ${project.rowSpan} hover:border-primary/50 transition-colors duration-300 cursor-pointer`}
    >
      {/* Dynamic Cursor Spotlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 243, 255, 0.18), transparent 70%)`,
        }}
      />

      {/* Background Graphic Area */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
        style={{ transform: "translateZ(10px)" }}
      >
        <motion.div
          animate={{ x: hovered ? "100%" : "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent -skew-x-12"
        />
      </div>

      <div className="relative z-20 p-8 md:p-12 h-full flex flex-col" style={{ transform: "translateZ(25px)" }}>
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <motion.div
            animate={{ rotate: hovered ? 45 : 0 }}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center bg-background/50 text-muted-foreground group-hover:text-primary group-hover:border-primary transition-colors"
          >
            <ArrowUpRight size={20} />
          </motion.div>
        </div>

        <p className="text-muted-foreground text-sm md:text-base mb-8 max-w-md flex-grow leading-relaxed">{project.desc}</p>

        <div className="flex flex-wrap gap-2 mt-auto">
          {project.tech.map((t) => (
            <span key={t} className="text-xs px-3 py-1 bg-secondary text-secondary-foreground uppercase tracking-wider font-semibold border border-transparent group-hover:border-primary/30 group-hover:text-foreground transition-colors rounded-md">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  useGSAP(() => {
    // Only apply pinning on larger screens to avoid mobile jank
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: leftColRef.current,
        pinSpacing: false,
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <section id="projects" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-12 relative">

        {/* Left Column - Pinned Title */}
        <div
          ref={leftColRef}
          className="md:col-span-4 p-6 lg:p-10 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-center bg-glass backdrop-blur-md relative z-10"
        >
          <div ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">
                Selected Work
              </p>
              <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter text-foreground">
                Built<br />
                For<br />
                <span className="text-primary">Scale</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content Grid */}
        <div ref={rightColRef} className="md:col-span-8 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ perspective: '1200px' }}>
            {projects.map((project, i) => (
              <ProjectCard key={project.title} project={project} i={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProjectsSection;
