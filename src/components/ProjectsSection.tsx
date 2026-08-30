import { motion, useInView, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowUpRight, Github, ExternalLink, Activity, Cpu, ShieldCheck, Database, Cloud, Zap, CheckCircle2, GitBranch, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: "hitl",
    index: "01",
    category: "Serverless & Cloud AI",
    title: "HITL Content Moderation Engine",
    subtitle: "Enterprise Serverless Content Safety Pipeline with Human-in-the-Loop Routing",
    overview:
      "Engineered an automated, high-throughput content moderation pipeline deployed natively via AWS CDK. The system inspects user-uploaded media for inappropriate, toxic, or non-compliant content using Amazon Rekognition, dynamically applying a 3-tier confidence routing policy to achieve ultra-fast auto-approvals while redirecting ambiguous cases to human reviewers via SageMaker Ground Truth A2I.",
    workflow: [
      {
        step: "01",
        title: "Ingestion & Event Trigger",
        desc: "Media uploaded to Amazon S3 emits EventBridge events, triggering decoupled AWS Lambda functions for preprocessing and thumbnail normalization.",
        icon: Cloud,
      },
      {
        step: "02",
        title: "Automated Rekognition Scoring",
        desc: "Amazon Rekognition analyzes visual and textual toxicities, computing multi-label confidence scores across explicit categories.",
        icon: Zap,
      },
      {
        step: "03",
        title: "3-Tier Routing Policy",
        desc: "High confidence (>95%) auto-approves to DynamoDB. Ambiguous cases (60-95%) route to SageMaker A2I Human Reviewer portal. Unsafe (<60%) triggers quarantine & SNS alerts.",
        icon: GitBranch,
      },
      {
        step: "04",
        title: "Audit & Streamlit Portal",
        desc: "Reviewers inspect quarantined assets via an authenticated Ground Truth interface, while analytics query DynamoDB GSIs for real-time compliance metrics.",
        icon: ShieldCheck,
      },
    ],
    metrics: [
      { label: "Architecture", value: "100% Serverless (AWS CDK)" },
      { label: "Auto-Approval", value: "< 500ms Execution" },
      { label: "Cost Optimization", value: "~85% vs Full Human Review" },
      { label: "Safety Policy", value: "3-Tier Confidence Routing" },
    ],
    tech: ["AWS CDK", "Lambda", "Amazon Rekognition", "SageMaker A2I", "DynamoDB", "Streamlit", "EventBridge", "S3"],
    gradient: "from-primary/30 via-primary/10 to-transparent",
    accentGlow: "rgba(0, 243, 255, 0.25)",
    demoLink: "https://hitl-content-moderation.vercel.app/",
    githubLink: "https://github.com/Braveheart66",
  },
  {
    id: "notybrain",
    index: "02",
    category: "Local RAG & Knowledge Intelligence",
    title: "NotyBrain – Privacy-First AI PKM",
    subtitle: "Offline RAG Pipeline & Semantic Knowledge Graph for Personal Notes",
    overview:
      "A privacy-first personal knowledge management SPA that enables semantic note-taking and deep grounded question answering without cloud data leaks. Features a local retrieval-augmented generation (RAG) pipeline running Qwen2.5 via Ollama, dense vector indexing with Qdrant, and an interactive dynamic Knowledge Graph visualization to trace conceptual relations across notes.",
    workflow: [
      {
        step: "01",
        title: "Parsing & Chunking",
        desc: "Markdown notes and PDF documents are parsed, stripped of noise, and split via semantic-aware hierarchical chunking with metadata tagging.",
        icon: Database,
      },
      {
        step: "02",
        title: "Qdrant Vector Indexing",
        desc: "Generates dense embedding vectors stored in a local Qdrant collection with payload filtering for tag-based semantic retrieval.",
        icon: Zap,
      },
      {
        step: "03",
        title: "Grounded Local RAG",
        desc: "Top-k retrieved passages are injected into Qwen2.5 via Ollama with strict context constraints, generating answers with exact markdown citations.",
        icon: Cpu,
      },
      {
        step: "04",
        title: "Graph Exploration UI",
        desc: "React + Vite frontend renders an interactive force-directed Knowledge Graph connected via Django REST and PostgreSQL note storage.",
        icon: Activity,
      },
    ],
    metrics: [
      { label: "Privacy Model", value: "Zero Cloud Data Leakage" },
      { label: "Local LLM", value: "Qwen2.5 via Ollama" },
      { label: "Vector Search", value: "Sub-50ms Qdrant HNSW" },
      { label: "Citations", value: "100% Grounded Line References" },
    ],
    tech: ["React + Vite", "Django REST", "Qdrant", "Ollama (Qwen2.5)", "PostgreSQL", "Docker", "FastEmbed", "TailwindCSS"],
    gradient: "from-accent/30 via-accent/10 to-transparent",
    accentGlow: "rgba(0, 120, 255, 0.25)",
    demoLink: "https://noty-brain.vercel.app/",
    githubLink: "https://github.com/Braveheart66",
  },
  {
    id: "deforestation",
    index: "03",
    category: "Computer Vision & Remote Sensing",
    title: "Drone & Satellite Deforestation AI",
    subtitle: "Remote Sensing Satellite Pipeline for Multi-Temporal Canopy Loss Tracking",
    overview:
      "An automated geospatial intelligence pipeline designed to quantify deforestation rates across large ecological zones. Combines Sentinel-2 and Landsat multi-spectral imagery with normalized difference vegetation index (NDVI) anomaly calculations to generate temporal loss maps, automated encroachment alerts, and ecological impact reports.",
    workflow: [
      {
        step: "01",
        title: "Multi-Spectral Ingestion",
        desc: "Retrieves geo-referenced satellite and drone imagery across multi-band spectral channels (NIR and Red) for historical intervals.",
        icon: Cloud,
      },
      {
        step: "02",
        title: "NDVI Vegetation Indexing",
        desc: "Calculates pixel-wise Normalized Difference Vegetation Index: (NIR - Red) / (NIR + Red) to isolate healthy photosynthetic canopy.",
        icon: Activity,
      },
      {
        step: "03",
        title: "Temporal Drift & Anomaly AI",
        desc: "Computer vision segmentation detects pixel-level vegetation decline, filtering seasonal variances to isolate illegal canopy loss.",
        icon: Cpu,
      },
      {
        step: "04",
        title: "Geospatial Dashboard",
        desc: "Renders interactive multi-layer map overlays with loss acreage calculations, severity classifications, and exportable audit reports.",
        icon: ShieldCheck,
      },
    ],
    metrics: [
      { label: "Spectral Analysis", value: "NIR & Red NDVI Modeling" },
      { label: "Resolution", value: "Multi-Scale Satellite & Drone" },
      { label: "Change Detection", value: "Temporal Anomaly Isolation" },
      { label: "Reporting", value: "Automated Geospatial Alerting" },
    ],
    tech: ["Python", "Computer Vision", "NDVI Modeling", "OpenCV", "Geospatial", "Deep Learning", "Streamlit", "NumPy"],
    gradient: "from-primary/30 via-primary/10 to-transparent",
    accentGlow: "rgba(0, 243, 255, 0.25)",
    demoLink: "https://satellite-deforestation-monitoring.vercel.app/",
    githubLink: "https://github.com/Braveheart66",
  },
  {
    id: "fatigue",
    index: "04",
    category: "Temporal Deep Learning & Edge AI",
    title: "AI Driver Fatigue Drift Monitor",
    subtitle: "Continuous Temporal Drift Modeling with Explainable AI Attributions",
    overview:
      "A real-time edge computer vision framework that models continuous fatigue progression rather than isolated frame blinks. Utilizes a hybrid BiLSTM-GRU architecture trained with weakly supervised Multiple Instance Learning (MIL) to track subtle temporal drift patterns (eye closure velocity, yawning frequency, head pose) with sub-20ms inference and Integrated Gradients XAI.",
    workflow: [
      {
        step: "01",
        title: "Facial Landmark Stream",
        desc: "Captures 60fps video stream, extracting 468 3D facial landmarks to calculate Eye Aspect Ratio (EAR) and Mouth Aspect Ratio (MAR).",
        icon: Activity,
      },
      {
        step: "02",
        title: "Temporal Drift Model",
        desc: "BiLSTM-GRU network processes sliding temporal windows to capture continuous micro-sleep progression and subtle cumulative fatigue drift.",
        icon: Cpu,
      },
      {
        step: "03",
        title: "Weakly Supervised MIL",
        desc: "Multiple Instance Learning classifies multi-second video bags, isolating high-risk temporal segments without tedious frame-level annotation.",
        icon: GitBranch,
      },
      {
        step: "04",
        title: "Edge Inference & XAI",
        desc: "ONNX Runtime delivers sub-20ms edge inference with Integrated Gradients attribution heatmaps and multi-stage auditory alarm triggers.",
        icon: Zap,
      },
    ],
    metrics: [
      { label: "Inference Latency", value: "< 20ms (ONNX Runtime)" },
      { label: "Architecture", value: "BiLSTM-GRU + MIL" },
      { label: "Explainability", value: "Integrated Gradients XAI" },
      { label: "Stream Processing", value: "60 FPS Real-time CV" },
    ],
    tech: ["PyTorch", "BiLSTM-GRU", "OpenCV", "ONNX Runtime", "Streamlit", "Docker", "Explainable AI (XAI)", "NumPy"],
    gradient: "from-accent/30 via-accent/10 to-transparent",
    accentGlow: "rgba(0, 120, 255, 0.25)",
    demoLink: "https://driverfatiguedrift-hpu2fcp8xe9lmxbqjx2appk.streamlit.app/",
    githubLink: "https://github.com/Braveheart66",
  },
];

const ProjectShowcaseCard = ({ project, i }: { project: typeof projects[0]; i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Scroll-driven Parallax Animation for each Project Card
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 25, restDelta: 0.001 });

  const scale = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.93, 1, 1, 0.96]);
  const opacity = useTransform(smoothProgress, [0, 0.15, 0.85, 1], [0.4, 1, 1, 0.6]);
  const y = useTransform(smoothProgress, [0, 1], ["40px", "-40px"]);

  return (
    <motion.div
      ref={cardRef}
      id={project.id}
      style={{
        scale,
        opacity,
        y,
      }}
      className="relative rounded-3xl bg-card/90 backdrop-blur-xl border border-border/80 p-6 sm:p-8 lg:p-12 overflow-hidden shadow-2xl hover:border-primary/50 transition-all duration-500 mb-20 last:mb-0 group"
    >
      {/* Top Accent Gradient Header */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${project.gradient}`} />

      {/* Dynamic Ambient Background Glow */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-500 opacity-20 group-hover:opacity-40"
        style={{ background: project.accentGlow }}
      />

      {/* Card Header & Meta */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border/60 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-primary font-bold text-sm tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/30 shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              PROJECT {project.index}
            </span>
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {project.category}
            </span>
          </div>
          <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-primary/80 font-mono mt-1">
            {project.subtitle}
          </p>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-primary text-black font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.25)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer"
          >
            <span>Live Demo</span>
            <ExternalLink size={15} />
          </a>
          <a
            href={project.githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-border/80 hover:border-primary/60 text-foreground hover:text-primary transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm font-medium bg-secondary/40 backdrop-blur-sm cursor-pointer"
          >
            <Github size={16} />
            <span className="hidden sm:inline">Source</span>
          </a>
        </div>
      </div>

      {/* Main Content Grid: Overview & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 border-b border-border/60 relative z-10">
        {/* Deep Overview (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            System Overview & Engineering Architecture
          </h4>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            {project.overview}
          </p>

          {/* Tech Stack Pills */}
          <div className="pt-4">
            <h5 className="font-mono text-xs uppercase tracking-widest text-muted-foreground/80 mb-3">
              Technologies & Infrastructure
            </h5>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs font-mono font-medium rounded-lg bg-secondary/80 border border-border/60 text-secondary-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics / Highlights Grid (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <h4 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Key Engineering Highlights
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {project.metrics.map((m) => (
              <div
                key={m.label}
                className="p-4 rounded-xl bg-secondary/40 border border-border/50 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between"
              >
                <span className="text-[11px] font-mono uppercase text-muted-foreground tracking-wider mb-1">
                  {m.label}
                </span>
                <span className="text-sm font-semibold text-foreground font-display">
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Architecture & Workflow Pipeline */}
      <div className="pt-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h4 className="font-mono text-xs sm:text-sm uppercase tracking-widest text-primary flex items-center gap-2">
            <GitBranch size={16} />
            System Architecture & Pipeline Workflow
          </h4>
          <span className="text-xs text-muted-foreground font-mono">
            4-Stage Execution Flow (Click to Inspect)
          </span>
        </div>

        {/* 4-Stage Connected Workflow Visualizer with Interactive Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {project.workflow.map((node, stepIdx) => {
            const Icon = node.icon;
            const isSelected = activeWorkflowStep === stepIdx;

            return (
              <motion.div
                key={node.step}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setActiveWorkflowStep(stepIdx)}
                className={`group p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-primary/10 border-primary shadow-[0_0_25px_rgba(0,243,255,0.2)]"
                    : "bg-secondary/30 border-border/60 hover:border-primary/40 hover:bg-secondary/50"
                }`}
              >
                {/* Step Number Badge */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold text-xs px-2.5 py-0.5 rounded border transition-colors ${
                        isSelected ? "bg-primary text-black border-primary font-black" : "bg-black/50 border-border text-primary"
                      }`}>
                        STEP {node.step}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h5 className="font-display font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors mb-2">
                    {node.title}
                  </h5>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {node.desc}
                  </p>
                </div>

                {/* Progress indicator bar */}
                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[11px] font-mono text-muted-foreground/80">
                  <span>Stage {stepIdx + 1} of 4</span>
                  <CheckCircle2 size={13} className={isSelected ? "text-primary" : "text-primary/70"} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-80px" });

  // Overall Section Scroll Progress Indicator
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <section
      id="projects"
      className="border-b border-border bg-background/80 backdrop-blur-[1px] relative z-10 overflow-hidden py-16 sm:py-24"
      ref={containerRef}
    >
      {/* Dynamic Background Grid Animation */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d0a_1px,transparent_1px),linear-gradient(to_bottom,#1f293d0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Ambient background lighting */}
      <div className="absolute -right-40 top-1/4 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[160px] pointer-events-none" />
      <div className="absolute -left-40 bottom-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[160px] pointer-events-none" />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-8 lg:px-16 relative">
        {/* Section Header */}
        <div ref={inViewRef} className="mb-14 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6"
          >
            <div>
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Featured Systems & Applications
              </p>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-foreground">
                Selected <span className="text-primary">Engineering</span> Work
              </h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base max-w-lg font-sans font-light">
              High-throughput architectures, privacy-first local RAG systems, and production edge ML models built for scale and verifiable accuracy.
            </p>
          </motion.div>

          {/* Dynamic Scroll-Tracker Progress Bar */}
          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Quick Jump Pill Navigation */}
            <div className="flex flex-wrap gap-2">
              {projects.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-secondary/50 hover:bg-primary/20 text-muted-foreground hover:text-primary border border-border/60 hover:border-primary/40 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,243,255,0.15)]"
                >
                  {p.index}. {p.title.split("–")[0].split("(")[0]}
                </a>
              ))}
            </div>

            {/* Scroll Indicator */}
            <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
              <span className="tracking-widest uppercase text-[10px]">SCROLL TO EXPLORE</span>
              <div className="w-28 h-1.5 bg-secondary/80 rounded-full overflow-hidden border border-border/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent origin-left"
                  style={{ scaleX: smoothProgress }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Spacious Showcase Cards with Parallax Motion */}
        <div className="space-y-16">
          {projects.map((project, i) => (
            <ProjectShowcaseCard key={project.id} project={project} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
