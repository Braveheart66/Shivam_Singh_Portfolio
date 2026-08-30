import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sparkles, Brain, Palette, Code } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import InteractiveModel from "./ui/InteractiveModel";
import { MagicText } from "./ui/magic-text";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "2023 – 2027",
    title: "B.Tech, Computer Science Engineering (AI)",
    desc: "Pursuing Bachelor of Technology in Computer Science & Engineering with specialization in Artificial Intelligence."
  },
  {
    year: "2023",
    title: "Intermediate (12th Grade)",
    desc: "Senior Secondary School Examination — Secured 84.17%."
  },
  {
    year: "2021",
    title: "High School (10th Grade)",
    desc: "Secondary School Examination — Secured 95.00%."
  },
];

const AboutSection = () => {
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
    <section id="about" className="border-b border-border bg-background/75 backdrop-blur-[1px] relative z-10 overflow-hidden" ref={containerRef}>
      <div className="max-w-[90rem] mx-auto border-x border-border grid grid-cols-1 md:grid-cols-2 relative">

        {/* Left Column - Pinned */}
        <div
          ref={leftColRef}
          className="md:col-span-1 p-8 md:p-16 border-b md:border-b-0 md:border-r border-border h-fit md:h-screen flex flex-col justify-center relative overflow-hidden"
        >
          {/* Subtle 3D background integrated into the pinned section */}
          <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
              <InteractiveModel color="hsl(151, 55%, 52%)" distort={0.4} speed={1} />
            </Canvas>
          </div>

          <div className="relative z-10" ref={inViewRef}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-primary font-medium tracking-widest uppercase text-xs mb-4">About Me</p>
              <h2 className="font-display text-4xl md:text-7xl font-bold uppercase leading-[0.9] tracking-tighter mb-8 text-foreground">
                Scalable<br />
                <span className="text-primary">Engineering</span>
              </h2>
              <MagicText
                text="I'm Shivam Singh — a software engineer and AI practitioner specializing in scalable backend architectures, cloud-native pipelines, and Generative AI systems. I focus on architecting resilient, high-throughput systems, event-driven serverless backends, and privacy-first local LLM workflows with precision and performance."
                className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-md font-sans font-light"
              />
            </motion.div>
          </div>
        </div>

        {/* Right Column - The Journey Timeline */}
        <div ref={rightColRef} className="md:col-span-1 flex flex-col p-8 md:p-16 justify-center min-h-[500px] md:min-h-screen">
          <div className="max-w-lg">
            <p className="text-primary font-medium tracking-widest uppercase text-xs mb-3">Academic Milestones</p>
            <h3 className="font-display text-3xl md:text-5xl font-bold uppercase mb-12 tracking-tight text-foreground">The Journey</h3>

            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1 * i }}
                  className="relative pl-8 border-l border-border hover:border-primary transition-colors duration-300 group"
                >
                  <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-border group-hover:bg-primary group-hover:shadow-[0_0_10px_rgba(0,243,255,0.8)] transition-all duration-300" />
                  <span className="text-primary font-display font-bold text-sm tracking-widest uppercase block mb-1">{item.year}</span>
                  <h4 className="font-display font-semibold text-xl mb-2 text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
