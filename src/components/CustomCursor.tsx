import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useVelocity, useTransform } from "framer-motion";

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);
    const [combatMode, setCombatMode] = useState(false);
    const [lasers, setLasers] = useState<{ id: number; x: number; y: number; targetX: number; targetY: number; angle: number }[]>([]);

    // Target ref for BB8 tracking
    const targetRef = useRef<{ x: number, y: number } | null>(null);
    const lastFiredRef = useRef<number>(0);

    // Mouse position values
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Spring physics for smooth trailing effect
    const springConfig = { damping: 28, stiffness: 320, mass: 0.4 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    // Calculate velocity for diagonal banking effect
    const cursorXVelocity = useVelocity(cursorXSpring);
    const cursorTilt = useTransform(cursorXVelocity, [-800, 800], [-18, 18]);

    // Throttled BB8 cache & laser combat check
    useEffect(() => {
        let lastCheck = 0;
        let lastMove = 0;

        const updateBB8Position = () => {
            const bb8 = document.getElementById("bb8-target");
            if (bb8) {
                const rect = bb8.getBoundingClientRect();
                targetRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            }
        };

        const handleScroll = () => {
            updateBB8Position();
        };

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);

            const now = performance.now();
            if (now - lastCheck > 60) {
                lastCheck = now;
                updateBB8Position();

                if (targetRef.current) {
                    const dx = targetRef.current.x - e.clientX;
                    const dy = targetRef.current.y - e.clientY;
                    const dist = Math.hypot(dx, dy);
                    const inRange = dist < 280 && dist > 40;
                    setCombatMode(inRange);

                    if (inRange && now - lastFiredRef.current > 350) {
                        lastFiredRef.current = now;
                        const angle = Math.atan2(dy, dx);
                        const laserId = Date.now() + Math.random();
                        setLasers((prev) => [
                            ...prev.slice(-4),
                            {
                                id: laserId,
                                x: e.clientX,
                                y: e.clientY,
                                targetX: targetRef.current!.x,
                                targetY: targetRef.current!.y,
                                angle,
                            },
                        ]);

                        // Auto cleanup laser after animation
                        setTimeout(() => {
                            setLasers((prev) => prev.filter((l) => l.id !== laserId));
                        }, 500);
                    }
                }
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        const handlePointerOver = (e: MouseEvent) => {
            const now = performance.now();
            if (now - lastMove < 30) return;
            lastMove = now;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            if (
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.getAttribute("role") === "button" ||
                target.classList?.contains("cursor-pointer") ||
                target.closest("a") !== null ||
                target.closest("button") !== null ||
                target.closest('[role="button"]') !== null
            ) {
                setIsPointer(true);
            } else {
                setIsPointer(false);
            }
        };

        window.addEventListener("mousemove", moveCursor, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("mouseleave", handleMouseLeave);
        window.addEventListener("mouseenter", handleMouseEnter);
        window.addEventListener("mouseover", handlePointerOver, { passive: true });

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mouseenter", handleMouseEnter);
            window.removeEventListener("mouseover", handlePointerOver);
        };
    }, [cursorX, cursorY, isVisible]);

    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
        return null;
    }

    // Determine final TIE Fighter rotation (aim at target if in combat mode)
    let finalRotation: any = cursorTilt;
    if (combatMode && targetRef.current) {
        const dx = targetRef.current.x - cursorX.get();
        const dy = targetRef.current.y - cursorY.get();
        finalRotation = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    return (
        <>
            {/* The outer glowing trail ring */}
            <motion.div
                className="fixed top-0 left-0 w-20 h-20 md:w-28 md:h-28 rounded-full pointer-events-none z-[9998] transition-opacity duration-300 will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible && !isPointer ? 0.25 : 0,
                    background: combatMode
                        ? "radial-gradient(circle, rgba(34, 197, 94, 0.45) 0%, rgba(34, 197, 94, 0) 70%)"
                        : "radial-gradient(circle, rgba(0, 243, 255, 0.35) 0%, rgba(0, 243, 255, 0) 70%)",
                }}
            />
            {/* The active TIE Fighter cursor */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 md:w-14 md:h-14 pointer-events-none z-[9999] will-change-transform"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                    rotate: finalRotation,
                }}
                animate={{
                    scale: isPointer ? 1.4 : combatMode ? 1.25 : 1,
                }}
                transition={{ scale: { type: "spring", stiffness: 350, damping: 22 } }}
            >
                <img
                    src="/tie-fighter-cursor-bg-transparent.png"
                    alt="Cursor"
                    className={`w-full h-full object-contain filter ${combatMode ? "drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" : "drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]"}`}
                    loading="eager"
                />
            </motion.div>

            {/* Laser Blaster Bolts fired at BB8 */}
            {lasers.map((laser) => (
                <motion.div
                    key={laser.id}
                    className="fixed top-0 left-0 w-7 h-[3px] bg-green-400 rounded-full z-[9997] pointer-events-none shadow-[0_0_10px_2px_#22c55e,0_0_20px_4px_rgba(34,197,94,0.6)]"
                    style={{
                        rotate: `${laser.angle}rad`,
                        translateX: "-50%",
                        translateY: "-50%",
                    }}
                    initial={{ x: laser.x, y: laser.y, opacity: 1, scaleX: 1 }}
                    animate={{ x: laser.targetX, y: laser.targetY, opacity: 0, scaleX: 1.8 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                />
            ))}
        </>
    );
};

export default CustomCursor;
