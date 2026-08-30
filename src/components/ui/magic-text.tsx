import * as React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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

export const MagicText: React.FC<MagicTextProps> = ({
  text,
  className,
  wordClassName,
  offset = ["start 0.95", "start 0.45"],
}) => {
  const container = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset,
  });

  const words = text.split(" ");

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
