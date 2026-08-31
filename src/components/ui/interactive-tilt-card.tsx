import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InteractiveTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  maxTilt?: number;
  depth?: number;
  glowColor?: string;
  showGlare?: boolean;
}

export const InteractiveTiltCard = React.forwardRef<HTMLDivElement, InteractiveTiltCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      maxTilt = 12,
      depth = 30,
      glowColor = "rgba(0, 243, 255, 0.2)",
      showGlare = true,
      ...props
    },
    ref
  ) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovered, setIsHovered] = React.useState(false);
    const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });

    const springConfig = { damping: 18, stiffness: 200, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);
    const glareOpacity = useTransform(springX, [-0.5, 0, 0.5], [0.35, 0.15, 0.35]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      if (!width || !height) return;

      const clientX = e.clientX - left;
      const clientY = e.clientY - top;

      const xPct = clientX / width - 0.5;
      const yPct = clientY / height - 0.5;

      mouseX.set(xPct);
      mouseY.set(yPct);

      setGlarePos({
        x: (clientX / width) * 100,
        y: (clientY / height) * 100,
      });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <div
        ref={ref}
        style={{ perspective: "1000px" }}
        className="w-full h-full"
      >
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative w-full h-full rounded-2xl transition-shadow duration-300 will-change-transform",
            isHovered && "shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(0,243,255,0.18)]",
            className
          )}
          {...(props as any)}
        >
          {/* Living Glare & Spotlight Sheen */}
          {showGlare && (
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-2xl z-30 transition-opacity duration-300 overflow-hidden"
              style={{
                opacity: isHovered ? 1 : 0,
                background: `radial-gradient(400px circle at ${glarePos.x}% ${glarePos.y}%, ${glowColor}, transparent 60%)`,
              }}
            />
          )}

          {/* 3D Elevated Content Layer */}
          <div
            style={{
              transform: `translateZ(${depth}px)`,
              transformStyle: "preserve-3d",
            }}
            className={cn("relative z-20 h-full w-full", innerClassName)}
          >
            {children}
          </div>
        </motion.div>
      </div>
    );
  }
);

InteractiveTiltCard.displayName = "InteractiveTiltCard";

export default InteractiveTiltCard;
