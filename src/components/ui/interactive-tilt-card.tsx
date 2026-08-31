import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export interface InteractiveTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  depth?: number;
  maxTilt?: number;
  showGlow?: boolean;
  disabled?: boolean;
}

export const InteractiveTiltCard = React.forwardRef<HTMLDivElement, InteractiveTiltCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      depth = 15,
      maxTilt = 12,
      showGlow = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    // High-performance GPU motion values (zero React state re-render lag)
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      if (disabled) return;
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
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          whileTap={
            disabled
              ? {}
              : {
                  scale: 0.985,
                }
          }
          className={cn(
            "group relative w-full h-full rounded-2xl will-change-transform",
            className
          )}
          {...(props as any)}
        >
          {/* Subtle Dim Ambient Hover Glow (Only when showGlow is enabled) */}
          {showGlow && !disabled && (
            <div
              className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none -z-10 bg-primary/20 blur-xl"
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
