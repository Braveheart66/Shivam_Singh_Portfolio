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
}

export const InteractiveTiltCard = React.forwardRef<HTMLDivElement, InteractiveTiltCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      maxTilt = 10.5,
      depth = 30,
      glowColor = "rgba(0, 243, 255, 0.15)",
      ...props
    },
    ref
  ) => {
    // --- 3D Tilt Animation Logic using Framer Motion Springs ---
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    const rotateX = useTransform(springY, [-0.5, 0.5], [`${maxTilt}deg`, `-${maxTilt}deg`]);
    const rotateY = useTransform(springX, [-0.5, 0.5], [`-${maxTilt}deg`, `${maxTilt}deg`]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const { width, height, left, top } = rect;
      if (!width || !height) return;
      const mouseXVal = e.clientX - left;
      const mouseYVal = e.clientY - top;
      const xPct = mouseXVal / width - 0.5;
      const yPct = mouseYVal / height - 0.5;
      mouseX.set(xPct);
      mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={cn(
          "relative will-change-transform",
          className
        )}
        {...(props as any)}
      >
        <div
          style={{
            transform: `translateZ(${depth}px)`,
            transformStyle: "preserve-3d",
          }}
          className={cn("h-full w-full", innerClassName)}
        >
          {children}
        </div>
      </motion.div>
    );
  }
);

InteractiveTiltCard.displayName = "InteractiveTiltCard";

export default InteractiveTiltCard;
