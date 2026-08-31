import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface MagicTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  offset?: any;
}

interface WordProps {
  children: string;
  progress: any;
  range: number[];
  className?: string;
}

const Word: React.FC<WordProps> = ({ children, progress, range, className }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className={cn("relative inline-block mr-1 leading-relaxed", className)}>
      <span className="absolute opacity-20 select-none">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  );
};

// Lightweight Mobile Word Renderer using pure CSS / whileInView
const MobileWord: React.FC<{ children: string; index: number; total: number; className?: string }> = ({
  children,
  index,
  total,
  className,
}) => {
  return (
    <span className={cn("relative inline-block mr-1 leading-relaxed", className)}>
      <span className="absolute opacity-20 select-none">{children}</span>
      <motion.span
        initial={{ opacity: 0.2 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-20px" }}
        transition={{ duration: 0.3, delay: Math.min(0.4, (index / total) * 0.4) }}
      >
        {children}
      </motion.span>
    </span>
  );
};

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className,
  wordClassName,
  offset = ["start 0.95", "start 0.45"],
}) => {
  const container = useRef<HTMLParagraphElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset,
  });

  const words = text.split(" ");

  if (isMobile) {
    return (
      <p ref={container} className={cn("flex flex-wrap leading-relaxed", className)}>
        {words.map((word, i) => (
          <MobileWord key={i} index={i} total={words.length} className={wordClassName}>
            {word}
          </MobileWord>
        ))}
      </p>
    );
  }

  return (
    <p ref={container} className={cn("flex flex-wrap leading-relaxed", className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} className={wordClassName}>
            {word}
          </Word>
        );
      })}
    </p>
  );
};

export default MagicText;
