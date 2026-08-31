import * as React from "react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MousePos {
  readonly x: number;
  readonly y: number;
}

export interface InteractiveTiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  depth?: number;
  maxTilt?: number;
  glowColor?: string;
  showPattern?: boolean;
  disabled?: boolean;
}

export const InteractiveTiltCard = React.forwardRef<HTMLDivElement, InteractiveTiltCardProps>(
  (
    {
      children,
      className,
      innerClassName,
      depth = 20,
      maxTilt = 18,
      glowColor = "rgba(0, 243, 255, 0.25)",
      showPattern = true,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);

    const handleMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const tiltX = ((x / rect.width) - 0.5) * maxTilt;
        const tiltY = ((y / rect.height) - 0.5) * -maxTilt;
        setMousePos({ x: tiltX, y: tiltY });
      },
      [disabled, maxTilt]
    );

    const handleEnter = useCallback(() => {
      if (disabled) return;
      setHovered(true);
    }, [disabled]);

    const handleLeave = useCallback(() => {
      if (disabled) return;
      setHovered(false);
      setMousePos({ x: 0, y: 0 });
    }, [disabled]);

    return (
      <div
        ref={ref}
        style={{ perspective: "1200px" }}
        className="w-full h-full transform-gpu"
      >
        <motion.div
          onMouseMove={handleMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          animate={{
            rotateX: disabled ? 0 : mousePos.y,
            rotateY: disabled ? 0 : mousePos.x,
            z: disabled ? 0 : hovered ? 25 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 35, mass: 0.8 }}
          whileTap={
            disabled
              ? {}
              : {
                  scale: 0.98,
                  rotateX: mousePos.y + 2,
                  rotateY: mousePos.x + 2,
                }
          }
          style={{ transformStyle: "preserve-3d" }}
          className={cn(
            "group relative w-full h-full overflow-hidden rounded-2xl transition-all duration-300 transform-gpu",
            className
          )}
          {...(props as any)}
        >
          {/* Subtle Geometric Background Pattern Watermark */}
          {showPattern && (
            <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-15 pointer-events-none -z-0">
              <svg className="absolute -top-3 -right-3 w-28 h-28 text-white/20" viewBox="0 0 100 100">
                <defs>
                  <pattern id="card-dot-pattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <circle cx="8" cy="8" r="1" fill="currentColor" opacity="0.4" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#card-dot-pattern)" />
              </svg>

              <motion.div
                className="absolute -bottom-3 -left-3 w-20 h-20 opacity-20"
                animate={{ rotate: hovered ? 90 : 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-white/30">
                  <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="1" rx="8" />
                  <rect x="35" y="35" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="0.5" rx="4" />
                </svg>
              </motion.div>
            </div>
          )}

          {/* Dynamic Light Sweep Highlight Overlay */}
          <motion.div
            className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
            style={{ transform: "translateZ(15px)" }}
          >
            <motion.div
              className="absolute -inset-full"
              animate={{
                background: hovered
                  ? `linear-gradient(${mousePos.x * 3 + 135}deg, transparent 35%, rgba(255,255,255,0.08) 50%, transparent 65%)`
                  : "transparent",
              }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

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

          {/* Top Specular Rim Reflection Layer */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none border border-white/10"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)`,
              transform: "translateZ(25px)",
            }}
            animate={{ opacity: hovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          />

          {/* Ambient Glow behind the card */}
          {!disabled && (
            <motion.div
              className="absolute -inset-0.5 rounded-2xl opacity-0 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${glowColor}, transparent 70%)`,
                filter: "blur(16px)",
                transform: "translateZ(-5px)",
              }}
              animate={{ opacity: hovered ? 0.25 : 0 }}
              transition={{ duration: 0.4 }}
            />
          )}
        </motion.div>
      </div>
    );
  }
);

InteractiveTiltCard.displayName = "InteractiveTiltCard";

export default InteractiveTiltCard;
