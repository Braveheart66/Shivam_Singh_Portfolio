import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";



const StarStreaks = () => {
    const count = 200;
    const [lines, colors] = useMemo(() => {
        const positions = new Float32Array(count * 6);
        const colors = new Float32Array(count * 6);
        const colorPalette = ["#00f3ff", "#ffffff", "#0078ff", "#a5f3fc", "#ffffff"];

        for (let i = 0; i < count; i++) {
            const radius = 3 + Math.random() * 25;
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = Math.random() * 800 - 400;
            const length = 30 + Math.random() * 50;

            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z;

            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y;
            positions[i * 6 + 5] = z + length;

            const color = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
            colors[i * 6] = color.r;
            colors[i * 6 + 1] = color.g;
            colors[i * 6 + 2] = color.b;
            colors[i * 6 + 3] = color.r * 0.1;
            colors[i * 6 + 4] = color.g * 0.1;
            colors[i * 6 + 5] = color.b * 0.1;
        }
        return [positions, colors];
    }, []);

    const meshRef = useRef<THREE.LineSegments>(null);

    useFrame((state) => {
        if (!meshRef.current) return;

        const elapsed = state.clock.elapsedTime;
        let speed = -1.5;
        if (elapsed > 0.6) {
            const t = Math.min((elapsed - 0.6) / 0.8, 1);
            speed = THREE.MathUtils.lerp(-1.5, -40, t * t);
        }

        const pos = meshRef.current.geometry.attributes.position.array as Float32Array;

        for (let i = 0; i < count; i++) {
            pos[i * 6 + 2] += speed;
            pos[i * 6 + 5] += speed;

            if (pos[i * 6 + 2] < -800) {
                pos[i * 6 + 2] = 200;
                pos[i * 6 + 5] = 250;
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={lines.length / 3}
                    array={lines}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial vertexColors transparent opacity={0.45} blending={THREE.AdditiveBlending} />
        </lineSegments>
    );
};

const LoadingScreen = ({ onFinished }: { onFinished: () => void }) => {
    const { progress: realProgress, active } = useProgress();
    const [displayPercent, setDisplayPercent] = useState(0);
    const [loadingText, setLoadingText] = useState("Initializing Core Systems...");

    useEffect(() => {
        // Smoothly interpolate percentage towards realProgress
        const interval = setInterval(() => {
            setDisplayPercent((prev) => {
                const target = Math.max(prev, Math.round(realProgress));
                if (prev < target) return prev + 2;
                if (prev < 90 && active) return prev + 1;
                return prev;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [realProgress, active]);

    useEffect(() => {
        if (displayPercent < 35) {
            setLoadingText("Initializing Neural Engine...");
        } else if (displayPercent < 70) {
            setLoadingText("Streaming 3D Starfighter Core...");
        } else if (displayPercent < 99) {
            setLoadingText("Engaging Hyperdrive Systems...");
        } else {
            setLoadingText("Systems Nominal — Online");
            const timer = setTimeout(() => {
                onFinished();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [displayPercent, onFinished]);

    // Safety timeout in case of cached or offline state
    useEffect(() => {
        const fallback = setTimeout(() => {
            setDisplayPercent(100);
        }, 3500);
        return () => clearTimeout(fallback);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden will-change-transform"
        >
            <div className="absolute inset-0 z-0">
                <Canvas dpr={[1, 1.25]} gl={{ antialias: false, powerPreference: "high-performance" }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={75} />
                    <color attach="background" args={["#000000"]} />
                    <ambientLight intensity={0.8} />
                    <StarStreaks />
                    <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade speed={1.2} />
                </Canvas>
            </div>

            <div className="relative z-10 text-center pointer-events-none px-4">
                <motion.div
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mb-8"
                >
                    <h2 className="text-primary/70 font-mono text-xs tracking-[0.4em] uppercase mb-2">
                        System Diagnostics • {displayPercent}%
                    </h2>
                    <p className="text-white font-display text-xl md:text-2xl font-bold tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
                        {loadingText}
                    </p>
                </motion.div>

                {/* Dynamic Loading Bar */}
                <div className="w-64 md:w-80 h-[3px] bg-white/10 relative overflow-hidden mx-auto rounded-full">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(0,243,255,1)] transition-all duration-150"
                        style={{ width: `${displayPercent}%` }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
