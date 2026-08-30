import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, PerspectiveCamera } from "@react-three/drei";
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
    const [loadingText, setLoadingText] = useState("Initializing Systems...");

    useEffect(() => {
        const timers = [
            setTimeout(() => setLoadingText("Synchronizing Core..."), 300),
            setTimeout(() => setLoadingText("Engaging Hyperdrive..."), 700),
            setTimeout(() => setLoadingText("Systems Nominal"), 1100),
            setTimeout(() => onFinished(), 1350)
        ];

        return () => timers.forEach(t => clearTimeout(t));
    }, [onFinished]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
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

            <div className="relative z-10 text-center pointer-events-none">
                <motion.div
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                    className="mb-8"
                >
                    <h2 className="text-primary/70 font-display text-xs tracking-[0.4em] uppercase mb-2">
                        System Online
                    </h2>
                    <p className="text-white font-display text-xl md:text-2xl font-bold tracking-widest uppercase drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">
                        {loadingText}
                    </p>
                </motion.div>

                {/* Loading Bar */}
                <div className="w-64 md:w-80 h-[3px] bg-white/10 relative overflow-hidden mx-auto rounded-full">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent shadow-[0_0_15px_rgba(0,243,255,1)]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    />
                </div>
            </div>
        </motion.div>
    );
};

export default LoadingScreen;
