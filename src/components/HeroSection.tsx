import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from "framer-motion";
import { ArrowDown, Send, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Sparkles, PresentationControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

const TitleSparkles = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-[2px] h-[2px] bg-primary rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: '0 0 10px 1px rgba(0, 255, 128, 0.8)',
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1.5, 0],
          y: [0, -30],
          x: [0, (Math.random() - 0.5) * 30],
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 5,
          ease: "easeInOut"
        }}
      />
    ))}
  </div>
);

const roles = ["Software Engineer", "AI & ML Practitioner", "Cloud & Backend Architect", "Generative AI Specialist"];

const Hotspot = ({ label, onClick, position }: { label: string, onClick: () => void, position: [number, number, number] }) => (
  <Html position={position} center distanceFactor={10}>
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="group relative flex flex-col items-center justify-center p-3 cursor-pointer"
    >
      {/* Subtle Outer Glow */}
      <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/10 animate-pulse blur-md group-hover:bg-primary/20 transition-colors duration-300" />
      <div className="absolute inset-0 w-6 h-6 m-auto rounded-full bg-primary/20 animate-ping opacity-30" />

      {/* Light Gradient Button */}
      <div className="relative w-3.5 h-3.5 rounded-full bg-gradient-to-br from-white via-primary/40 to-primary/20 shadow-[0_0_12px_rgba(0,243,255,0.6)] border border-white/30 transition-transform duration-300 group-hover:scale-125" />

      {/* Label HUD */}
      <div className="mt-2 px-2.5 py-0.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 shadow-md">
        <span className="text-[10px] md:text-[9px] font-bold tracking-[0.2em] uppercase text-white/90 whitespace-nowrap">
          {label}
        </span>
      </div>
    </button>
  </Html>
);

function LaserCannons({ pointer, isFixed }: { pointer: { x: number; y: number }; isFixed: boolean }) {
  const lasersRef = useRef<Array<{ mesh: THREE.Mesh; dir: THREE.Vector3; age: number }>>([]);
  const groupRef = useRef<THREE.Group>(null);
  const lastFired = useRef<number>(0);
  const firedFlag = useRef<boolean>(false);

  useFrame((state, delta) => {
    const px = pointer.x;
    const py = pointer.y;
    const mag = Math.sqrt(px * px + py * py);
    const now = performance.now();

    // Fast cursor movement fires twin plasma cannons
    if (isFixed && mag > 0.65 && !firedFlag.current && now - lastFired.current > 180) {
      firedFlag.current = true;
      lastFired.current = now;

      [-0.45, 0.45].forEach((offsetX) => {
        const geom = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 8);
        const mat = new THREE.MeshBasicMaterial({
          color: "#ff2233",
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.Mesh(geom, mat);
        mesh.position.set(offsetX, 0.05, 0.2);
        const dir = new THREE.Vector3(px * 0.4, py * 0.4, 1.4).normalize();
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        if (groupRef.current) {
          groupRef.current.add(mesh);
          lasersRef.current.push({ mesh, dir, age: 0 });
        }
      });
    } else if (mag < 0.4) {
      firedFlag.current = false;
    }

    // Update active lasers imperatively
    for (let i = lasersRef.current.length - 1; i >= 0; i--) {
      const laser = lasersRef.current[i];
      laser.age += delta;
      laser.mesh.position.addScaledVector(laser.dir, 24 * delta);
      if (laser.mesh.material instanceof THREE.MeshBasicMaterial) {
        laser.mesh.material.opacity = Math.max(0, 1 - laser.age / 0.75);
      }
      if (laser.age > 0.75) {
        if (groupRef.current) groupRef.current.remove(laser.mesh);
        laser.mesh.geometry.dispose();
        lasersRef.current.splice(i, 1);
      }
    }
  });

  return <group ref={groupRef} />;
}

function StarfighterModel({ isFixed, scrollScale = 1, targetBaseRotation = [0, 0, 0], currentView = 'front', onViewChange, ...props }: { isFixed: boolean, scrollScale?: number, targetBaseRotation?: [number, number, number], currentView?: string, onViewChange?: (view: any) => void } & any) {
  const { scene } = useGLTF("/star_wars_ship.glb");
  const [scale, setScale] = useState<[number, number, number]>([4, 4, 4]);
  const groupRef = useRef<THREE.Group>(null);
  const baseRotationRef = useRef(new THREE.Euler(0, 0, 0));
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScale(window.innerWidth < 768 ? [2.0, 2.0, 2.0] : [5.2, 5.2, 5.2]);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    pointerRef.current.x = state.pointer.x;
    pointerRef.current.y = state.pointer.y;

    // Smooth Euler lerp
    baseRotationRef.current.x = THREE.MathUtils.lerp(baseRotationRef.current.x, targetBaseRotation[0], 0.08);
    baseRotationRef.current.y = THREE.MathUtils.lerp(baseRotationRef.current.y, targetBaseRotation[1], 0.08);
    baseRotationRef.current.z = THREE.MathUtils.lerp(baseRotationRef.current.z, targetBaseRotation[2], 0.08);

    if (isFixed) {
      const isFront = currentView === 'front';
      const targetRotationX = isFront ? (-state.pointer.y * 0.3 + baseRotationRef.current.x) : baseRotationRef.current.x;
      const targetRotationY = isFront ? (state.pointer.x * 0.35 + baseRotationRef.current.y) : baseRotationRef.current.y;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);

      const targetPosX = state.pointer.x * 0.4;
      const targetPosY = state.pointer.y * 0.4;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.08);
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.0015;
    } else {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, baseRotationRef.current.x, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, baseRotationRef.current.y, 0.08);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.08);
    }
  });

  return (
    <group ref={groupRef} scale={Math.max(0.001, scrollScale)}>
      <group scale={scale}>
        <Center>
          <primitive object={scene} rotation={[0, 0, 0]} {...props} />
        </Center>

        <group position={[0, 0.04, -0.33]}>
          <Sparkles count={90} scale={[0.1, 0.1, 0.3]} size={1.5} speed={3} color="#00f3ff" opacity={0.9} />
          <pointLight intensity={20} distance={1.2} color="#00f3ff" />
        </group>

        {/* Wingtip Laser Cannons */}
        <LaserCannons pointer={pointerRef.current} isFixed={isFixed} />

        {/* Dynamic View Hotspots */}
        {isFixed && (
          <group>
            {currentView === 'front' && (
              <>
                <Hotspot label="Left" position={[-0.64, 0, 0]} onClick={() => onViewChange?.('left')} />
                <Hotspot label="Right" position={[0.64, 0, 0]} onClick={() => onViewChange?.('right')} />
                <Hotspot label="Top" position={[0, 0.33, 0]} onClick={() => onViewChange?.('top')} />
              </>
            )}

            {currentView === 'back' && (
              <>
                <Hotspot label="Right" position={[-0.64, 0, 0]} onClick={() => onViewChange?.('right')} />
                <Hotspot label="Left" position={[0.64, 0, 0]} onClick={() => onViewChange?.('left')} />
                <Hotspot label="Top" position={[0, 0.33, 0]} onClick={() => onViewChange?.('top')} />
                <Hotspot label="Front" position={[0, 0.09, 0.73]} onClick={() => onViewChange?.('front')} />
              </>
            )}

            {(currentView === 'left' || currentView === 'right' || currentView === 'top') && (
              <>
                <Hotspot label="Front" position={[0, 0.09, 0.64]} onClick={() => onViewChange?.('front')} />
                <Hotspot label="Rear" position={[0, 0.18, -0.73]} onClick={() => onViewChange?.('back')} />
              </>
            )}
          </group>
        )}
      </group>
    </group>
  );
}

const HeroStarStreaks = ({ progress }: { progress: number }) => {
  // Only exists and appears when scrolling takes place (never behind the intro text)
  if (progress <= 0.08) return null;

  const count = 300;
  const [lines, colors] = useMemo(() => {
    const positions = new Float32Array(count * 6);
    const colors = new Float32Array(count * 6);
    const colorPalette = ["#00f3ff", "#ffffff", "#0078ff", "#a5f3fc", "#e0e7ff"];

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 32;
      const angle = Math.random() * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = Math.random() * -800;
      const length = 35 + Math.random() * 50;
      positions[i * 6] = x;
      positions[i * 6 + 1] = y;
      positions[i * 6 + 2] = z;
      positions[i * 6 + 3] = x;
      positions[i * 6 + 4] = y;
      positions[i * 6 + 5] = z - length;
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
  useFrame(() => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 4.5;
    for (let i = 0; i < count; i++) {
      pos[i * 6 + 2] += speed;
      pos[i * 6 + 5] += speed;
      if (pos[i * 6 + 2] > 100) {
        pos[i * 6 + 2] = -800;
        pos[i * 6 + 5] = -850;
      }
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  const streakOpacity = Math.min(0.6, (progress - 0.08) * 1.6);

  return (
    <group position={[0, 2, 0]}>
      <lineSegments ref={meshRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={streakOpacity} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

useGLTF.preload("/star_wars_ship.glb");

const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const [isModelFixed, setIsModelFixed] = useState(false);
  const [modelScaleProgress, setModelScaleProgress] = useState(0);
  const [activeView, setActiveView] = useState<'front' | 'back' | 'left' | 'right' | 'top'>('front');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const viewRotations: Record<string, [number, number, number]> = {
    front: [0.2, 0, 0], // Slight tilt downwards
    back: [0, Math.PI, 0],
    left: [0, -Math.PI / 2, 0],
    right: [0, Math.PI / 2, 0],
    top: [Math.PI / 2, 0, 0],
  };

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    // Sequence 1: Intro Text Entrance
    tl.fromTo(introRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }
    )
      // Sequence 2: Reveal rest of Hero UI
      .fromTo(".hero-line", { scaleX: 0 }, { scaleX: 1, duration: 1.0, transformOrigin: "left center" }, "-=0.3")
      .fromTo(".hero-tag", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.7 }, "-=0.7")
      .fromTo(".hero-role", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "-=0.5")
      .fromTo(buttonsRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");

    if (textRef.current) {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%",
          scrub: 1.0,

          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const scaleStart = 0.02;
            const scaleEnd = 0.75;
            const progress = self.progress;
            const clampedProgress = gsap.utils.clamp(scaleStart, scaleEnd, progress);
            const newScale = gsap.utils.mapRange(scaleStart, scaleEnd, 0, 1, clampedProgress);
            setModelScaleProgress(newScale);
            setIsModelFixed(progress > scaleEnd);

            if (introRef.current) {
              if (progress > 0) {
                if (tl.isActive()) tl.progress(1);

                const introScroll = gsap.utils.clamp(0, 1, progress / 0.22);
                gsap.set(introRef.current, {
                  opacity: Math.max(0, 1 - introScroll * 1.4),
                  y: -introScroll * 140,
                  scale: 1 - introScroll * 0.05,
                });
              } else if (progress === 0 && !tl.isActive()) {
                gsap.set(introRef.current, { opacity: 1, y: 0, scale: 1 });
              }
            }
          }
        }
      });
    }
  }, { scope: sectionRef });

  useEffect(() => {
    if (isModelFixed) {
      setText("Software Engineer");
      return;
    }

    const current = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) setTimeout(() => setIsDeleting(true), 1500);
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setRoleIndex((i) => (i + 1) % roles.length);
        }
      }
    }, isDeleting ? 35 : 70);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, isModelFixed]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-end px-4 sm:px-6 lg:px-20 xl:px-32 pb-4 overflow-hidden bg-transparent border-b border-border z-20 w-full max-w-full">
      <div className="absolute inset-x-0 top-0 h-px bg-border/40" />
      <div className="absolute inset-y-0 left-[10%] w-px bg-border/20 hidden md:block" />
      <div className="absolute inset-y-0 right-[10%] w-px bg-border/20 hidden md:block" />

      {/* Main Intro Text Overlay */}
      <div
        ref={introRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-start pt-[14vh] md:justify-center md:pt-0 pointer-events-none px-4 text-center will-change-transform"
      >
        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">
          Turning Ideas into <span className="text-primary italic">Intelligent</span> Products
        </h1>
        <p className="text-base md:text-xl text-muted-foreground font-light tracking-[0.3em] uppercase max-w-2xl px-4">
          AI, cloud, and engineering working together.
        </p>
      </div>

      {/* 3D Cosmos and Spaceship Canvas - Transparent to let OG ParticleBackground show */}
      <div className="middle-3d-model absolute inset-0 z-0 pointer-events-auto flex items-center justify-center overflow-hidden">
        <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} camera={{ fov: 45, position: [0, 0, 15] }} className="w-full h-full">
          <ambientLight intensity={1.8} />
          <spotLight position={[10, 10, 10]} angle={0.25} penumbra={1} intensity={4 + (modelScaleProgress * 6)} color="#ffffff" />
          <spotLight position={[0, 5, 5]} angle={0.35} penumbra={0.8} intensity={4 + modelScaleProgress * 8} color="#00f3ff" />
          <pointLight position={[-10, -10, -10]} intensity={2} color="#0078ff" />

          {/* Star streaks only appear when scrolling */}
          <group position={[0, isMobile ? 1.8 : 0, 0]}>
            <HeroStarStreaks progress={modelScaleProgress} />
          </group>
          <PresentationControls global cursor={false} speed={3} config={{ mass: 1, tension: 800 }} snap={{ mass: 1.5, tension: 1000 }} rotation={[0, 0, 0]} polar={[-Math.PI / 2.5, Math.PI / 2.5]} azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}>
            <group position={[0, isMobile ? 1.8 : 0, 0]}>
              <StarfighterModel isFixed={isModelFixed} scrollScale={modelScaleProgress} targetBaseRotation={viewRotations[activeView]} currentView={activeView} onViewChange={setActiveView} />
            </group>
          </PresentationControls>
        </Canvas>
      </div>

      <div ref={textRef} className="relative z-10 w-full max-w-[90rem] mx-auto pointer-events-none">
        <div className="border-t border-border pt-6 lg:pt-8 relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-8 min-h-[140px] lg:min-h-0">
          <div className="flex flex-col lg:flex-row lg:items-end lg:gap-24">
            {/* Desktop/Tablet Name Section */}
            <div className="hero-tag hidden lg:block">
              <div className="hero-line h-[2px] w-12 bg-primary mb-6" />
              <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mb-2">Portfolio</p>
              <p className="text-foreground text-xl md:text-2xl font-bold">Shivam Singh</p>
            </div>

            <div className="hero-role flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto">
              <div className="hero-tag lg:hidden mb-4 flex flex-col items-center">
                <div className="hero-line h-[2px] w-12 bg-primary mb-4" />
                <p className="text-muted-foreground font-medium tracking-widest uppercase text-xs mb-2">Portfolio</p>
                <p className="text-foreground text-xl font-bold">Shivam Singh</p>
              </div>
              <p className="text-xl lg:text-2xl text-muted-foreground h-8 font-sans font-light tracking-wide flex items-center justify-center lg:justify-start">
                <span className="text-foreground font-medium mr-2">Role:</span> {text}<span className="animate-pulse text-primary ml-1">|</span>
              </p>
            </div>
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })} className="h-fit w-full lg:w-auto px-8 py-4 bg-primary text-black font-semibold text-sm uppercase tracking-wider hover:bg-white transition-colors duration-300 pointer-events-auto">View Projects</button>
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <a href="/Shivam_Resume.pdf" download="Shivam_Resume.pdf" className="flex-1 lg:flex-none px-4 lg:px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"><Download size={16} /> Resume</a>
              <a href="mailto:shivamsinghraghuvanshi1234@gmail.com" className="flex-1 lg:flex-none px-4 lg:px-8 py-4 border border-border text-foreground font-medium text-sm hover:border-primary hover:text-primary transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer pointer-events-auto"><Send size={16} /> Contact</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 animate-bounce text-muted-foreground hover:text-primary transition-colors hidden md:block relative z-10">
          <ArrowDown size={32} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
