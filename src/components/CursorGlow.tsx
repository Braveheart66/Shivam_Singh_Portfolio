import { useEffect, useRef } from "react";

const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;
    let frameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updateGlow = () => {
      // Smooth lerp follow
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${currentX - 200}px, ${currentY - 200}px, 0)`;
      }
      frameId = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    frameId = requestAnimationFrame(updateGlow);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed top-0 left-0 pointer-events-none z-40 hidden md:block will-change-transform"
      style={{
        width: 320,
        height: 320,
        background: "radial-gradient(circle, rgba(0, 243, 255, 0.035) 0%, rgba(0, 120, 255, 0.015) 40%, transparent 70%)",
        transform: "translate3d(-500px, -500px, 0)",
      }}
    />
  );
};

export default CursorGlow;
