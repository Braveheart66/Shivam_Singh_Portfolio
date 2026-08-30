import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Award, Cloud, ShieldCheck } from "lucide-react";
import { MagicText } from "@/components/ui/magic-text";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    icon: Trophy,
    title: "AWS Certified in ML & Agentic AI",
    desc: "Certified in AWS Machine Learning Foundations & AWS Agentic AI architectures, building serverless AI workflows and agentic pipelines.",
    colSpan: "md:col-span-1"
  },
  {
    icon: Award,
    title: "Oracle OCI GenAI Professional",
    desc: "Certified in Oracle Cloud Infrastructure Generative AI Professional & AI Foundations, specializing in LLMs, vector search, and enterprise RAG.",
    colSpan: "md:col-span-1"
  },
  {
    icon: Cloud,
    title: "Production Serverless Architectures",
    desc: "Architected resilient event-driven cloud systems on AWS CDK with DLQs, retry policies, SNS alerting, DynamoDB GSIs, and least-privilege IAM.",
    colSpan: "md:col-span-1"
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First AI & RAG Engineering",
    desc: "Designed zero-leakage local LLM ingestion pipelines (Qwen2.5/Ollama) with Qdrant vector indexing, grounded source citations, and graph visualization.",
    colSpan: "md:col-span-1"
  },
];

const ExperienceCard = ({ item, i }: { item: typeof achievements[0]; i: number }) => {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.08 * i, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`bg-card p-8 md:p-10 group border border-border hover:border-primary/50 transition-all duration-300 flex flex-col justify-between ${item.colSpan}`}
    >
      <div>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
            <item.icon className="text-primary" size={24} />
          </div>
          <h3 className="font-display font-bold text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
        </div>
        <MagicText
          text={item.desc}
          offset={["start 0.98", "start 0.45"]}
          className="text-muted-foreground text-sm md:text-base leading-relaxed"
        />
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const inViewRef = useRef(null);
  const inView = useInView(inViewRef, { once: true, margin: "-100px" });

  useGSAP(() => {
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
    <section id="experience" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-12 relative">

        {/* Left Column - Pinned */}
        <div
          ref={leftColRef}
          className="md:col-span-5 lg:col-span-4 p-6 lg:p-10 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-center bg-glass backdrop-blur-md relative z-10"
        >
          <div ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">Experience</p>
              <h2 className="font-display text-2xl sm:text-3xl md:text-3xl lg:text-4xl xl:text-5xl font-bold uppercase leading-[1.05] tracking-tight text-foreground break-words">
                Achievements<br />
                &<br />
                <span className="text-primary">Milestones</span>
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Scrolling Content */}
        <div ref={rightColRef} className="md:col-span-7 lg:col-span-8 flex flex-col p-8 md:p-12 justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {achievements.map((item, i) => (
              <ExperienceCard key={item.title} item={item} i={i} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
