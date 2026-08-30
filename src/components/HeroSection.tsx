import { useEffect, useState, useRef, useMemo } from 'react';
import { motion } from "framer-motion";
import { ArrowDown, Send, Download } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Center, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { LiquidButton } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// Preload 3D asset immediately at module load
useGLTF.preload("/star_wars_ship.glb");

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

function LaserCannons({ pointer }: { pointer: { x: number; y: number } }) {
  const lasersRef = useRef<Array<{ mesh: THREE.Mesh; dir: THREE.Vector3; age: number }>>([]);
  const groupRef = useRef<THREE.Group>(null);
  const lastFired = useRef<number>(0);
  const firedFlag = useRef<boolean>(false);

  const spawnLasers = (px: number, py: number) => {
    [-0.45, 0.45].forEach((offsetX) => {
      const geom = new THREE.CylinderGeometry(0.02, 0.02, 0.85, 8);
      const mat = new THREE.MeshBasicMaterial({
        color: "#ff2233",
        transparent: true,
        opacity: 0.95,
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
  };

  // Safe pointerdown listener that never blocks input fields
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('form') ||
        target.closest('#contact')
      ) return;
      spawnLasers(pointer.x, pointer.y);
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [pointer]);

  useFrame((state, delta) => {
    const px = pointer.x;
    const py = pointer.y;
    const mag = Math.sqrt(px * px + py * py);
    const now = performance.now();

    // Fast cursor swing fires twin plasma cannons
    if (mag > 0.55 && !firedFlag.current && now - lastFired.current > 200) {
      firedFlag.current = true;
      lastFired.current = now;
      spawnLasers(px, py);
    } else if (mag < 0.35) {
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

function StarfighterModel({ isFixed, scrollScale = 0, targetBaseRotation = [0, 0, 0], currentView = 'front', onViewChange, globalMouse, ...props }: { isFixed: boolean, scrollScale?: number, targetBaseRotation?: [number, number, number], currentView?: string, onViewChange?: (view: any) => void, globalMouse: React.RefObject<{ x: number; y: number }> } & any) {
  const { scene } = useGLTF("/star_wars_ship.glb");
  const [scale, setScale] = useState<[number, number, number]>([4, 4, 4]);
  const groupRef = useRef<THREE.Group>(null);
  const baseRotationRef = useRef(new THREE.Euler(0, 0, 0));

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) {
        setScale([2.8, 2.8, 2.8]);
      } else if (window.innerWidth < 768) {
        setScale([3.6, 3.6, 3.6]);
      } else {
        setScale([5.5, 5.5, 5.5]);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Use global mouse coords instead of R3F state.pointer
    const mx = globalMouse.current?.x ?? 0;
    const my = globalMouse.current?.y ?? 0;

    // Smooth Euler lerp to target view angle
    baseRotationRef.current.x = THREE.MathUtils.lerp(baseRotationRef.current.x, targetBaseRotation[0], 0.06);
    baseRotationRef.current.y = THREE.MathUtils.lerp(baseRotationRef.current.y, targetBaseRotation[1], 0.06);
    baseRotationRef.current.z = THREE.MathUtils.lerp(baseRotationRef.current.z, targetBaseRotation[2], 0.06);

    // Dynamic mouse banking / cursor follow when spaceship is scrolled into view
    if (scrollScale > 0.15 || isFixed) {
      const isFront = currentView === 'front';
      const targetRotationX = isFront ? (-my * 0.45 + baseRotationRef.current.x) : baseRotationRef.current.x;
      const targetRotationY = isFront ? (mx * 0.55 + baseRotationRef.current.y) : baseRotationRef.current.y;
      const targetRotationZ = isFront ? (-mx * 0.28 + baseRotationRef.current.z) : baseRotationRef.current.z;

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.08);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotationZ, 0.08);

      const targetPosX = mx * 0.55;
      const targetPosY = my * 0.4;

      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetPosX, 0.08);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, 0.08);
    }
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 2) * 0.0025;
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
        <LaserCannons pointer={globalMouse.current ?? { x: 0, y: 0 }} />
      </group>
    </group>
  );
}

const HeroStarStreaks = ({ progress }: { progress: number }) => {
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
      positions[i * 6 + 5] = z + length;

      const c = new THREE.Color(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
      colors[i * 6] = c.r;
      colors[i * 6 + 1] = c.g;
      colors[i * 6 + 2] = c.b;
      colors[i * 6 + 3] = c.r;
      colors[i * 6 + 4] = c.g;
      colors[i * 6 + 5] = c.b;
    }
    return [positions, colors];
  }, []);

  const linesRef = useRef<THREE.LineSegments>(null);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const pos = linesRef.current.geometry.attributes.position.array as Float32Array;
    const speed = 1200 * Math.max(0.2, progress);

    for (let i = 0; i < count; i++) {
      pos[i * 6 + 2] += speed * delta;
      pos[i * 6 + 5] += speed * delta;

      if (pos[i * 6 + 2] > 20) {
        const resetZ = -600 - Math.random() * 200;
        const length = 35 + Math.random() * 50;
        pos[i * 6 + 2] = resetZ;
        pos[i * 6 + 5] = resetZ + length;
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count * 2} array={lines} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count * 2} array={colors} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={Math.min(1, progress * 1.5)} blending={THREE.AdditiveBlending} linewidth={2} />
    </lineSegments>
  );
};

useGLTF.preload("/star_wars_ship.glb");

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const globalMouseRef = useRef({ x: 0, y: 0 });

  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modelScaleProgress, setModelScaleProgress] = useState(0);
  const [modelOpacity, setModelOpacity] = useState(0);
  const [isModelFixed, setIsModelFixed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeView, setActiveView] = useState('front');
  const [heroScrolledPast, setHeroScrolledPast] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Global mouse & touch tracker — works on desktop mouse and mobile touch
  useEffect(() => {
    const handleGlobalMouse = (e: MouseEvent) => {
      // Normalize to -1..1 range like R3F's state.pointer
      globalMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const handleGlobalTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        globalMouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        globalMouseRef.current.y = -((touch.clientY / window.innerHeight) * 2 - 1);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouse, { passive: true });
    window.addEventListener('touchmove', handleGlobalTouch, { passive: true });
    window.addEventListener('touchstart', handleGlobalTouch, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouse);
      window.removeEventListener('touchmove', handleGlobalTouch);
      window.removeEventListener('touchstart', handleGlobalTouch);
    };
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
            const scaleStart = 0.05;
            const scaleEnd = 0.75;
            const exitStart = 0.78;
            const progress = self.progress;

            // Ingress & scaling
            const clampedProgress = gsap.utils.clamp(scaleStart, scaleEnd, progress);
            const inScale = gsap.utils.mapRange(scaleStart, scaleEnd, 0, 1, clampedProgress);

            // Graceful exit boost (progress 0.78 to 1.0)
            const exitProgress = gsap.utils.clamp(0, 1, (progress - exitStart) / (1.0 - exitStart));
            const exitScaleFactor = 1 + exitProgress * 1.8; // Accelerates slightly toward camera / space
            setModelScaleProgress(inScale * exitScaleFactor);

            setIsModelFixed(progress > scaleEnd && progress <= exitStart);
            setHeroScrolledPast(progress >= 0.99);

            // Graceful opacity fade out at end of hero section
            const currentOpacity = progress < scaleStart ? 0 : (progress > exitStart ? Math.max(0, 1 - exitProgress) : 1);
            setModelOpacity(currentOpacity);

            if (introRef.current) {
              if (progress > 0) {
                if (tl.isActive()) tl.progress(1);

                const introScroll = gsap.utils.clamp(0, 1, progress / 0.18);
                gsap.set(introRef.current, {
                  opacity: Math.max(0, 1 - introScroll * 1.3),
                  y: -introScroll * 350,
                  scale: 1 + introScroll * 0.15,
                  filter: `blur(${introScroll * 10}px)`
                });
              } else if (progress === 0 && !tl.isActive()) {
                gsap.set(introRef.current, { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
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
    }, isDeleting ? 40 : 80);
    return () => clearTimeout(timeout);
  }, [text, isDeleting, roleIndex, isModelFixed]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-end px-4 sm:px-6 lg:px-20 xl:px-32 pb-4 overflow-hidden bg-transparent border-b border-border z-20 w-full max-w-full">
      <TitleSparkles />

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

      {/* Sci-Fi Camera Viewpoint Switcher HUD */}
      {modelScaleProgress > 0.45 && !heroScrolledPast && modelOpacity > 0.2 && (
        <div className="absolute top-[10vh] sm:top-[12vh] md:top-[16vh] left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-1 sm:gap-2 bg-black/70 backdrop-blur-2xl px-2 py-1.5 sm:px-3 sm:py-2 rounded-full border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] pointer-events-auto transition-all duration-300 max-w-[95vw] overflow-x-auto">
          <span className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-white/70 px-1.5 hidden md:inline">VIEWPOINT:</span>
          {[
            { id: 'front', label: 'Cockpit', short: 'Cockpit' },
            { id: 'left', label: 'Left Wing', short: 'L-Wing' },
            { id: 'right', label: 'Right Wing', short: 'R-Wing' },
            { id: 'top', label: 'Top View', short: 'Top' },
            { id: 'back', label: 'Rear Engine', short: 'Engine' },
          ].map((v) => (
            <LiquidButton
              key={v.id}
              type="button"
              variant={activeView === v.id ? "cyan" : "default"}
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveView(v.id);
              }}
              className="text-[10px] sm:text-xs font-mono uppercase tracking-wider py-1 px-2.5 sm:px-3.5 h-7 sm:h-8 flex items-center gap-1 shrink-0"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeView === v.id ? 'bg-primary animate-ping' : 'bg-white/40'}`} />
              <span className="sm:hidden">{v.short}</span>
              <span className="hidden sm:inline">{v.label}</span>
            </LiquidButton>
          ))}
        </div>
      )}

      {/* 3D Cosmos and Spaceship Canvas */}
      <div
        className="middle-3d-model absolute inset-0 z-10 flex items-center justify-center overflow-hidden transition-opacity duration-300 pointer-events-none will-change-transform"
        style={{
          opacity: modelOpacity,
          visibility: modelOpacity > 0.005 ? 'visible' : 'hidden',
        }}
      >
        <Canvas
          dpr={[1, 1.25]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", precision: "mediump" }}
          camera={{ fov: isMobile ? 48 : 45, position: [0, 0, isMobile ? 16 : 15] }}
          className="w-full h-full canvas-no-events"
        >
          <ambientLight intensity={1.5 + (modelScaleProgress * 1.5)} />
          <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2 + (modelScaleProgress * 8)} color="#ffffff" />
          <pointLight position={[-10, -10, -10]} intensity={1 + (modelScaleProgress * 2)} color="#0078ff" />

          <group position={[0, isMobile ? 0.35 : 0, 0]}>
            <HeroStarStreaks progress={modelScaleProgress} />
          </group>

          <group position={[0, isMobile ? 0.35 : 0, 0]}>
            <StarfighterModel
              isFixed={isModelFixed}
              scrollScale={modelScaleProgress}
              targetBaseRotation={viewRotations[activeView]}
              currentView={activeView}
              onViewChange={setActiveView}
              globalMouse={globalMouseRef}
            />
          </group>
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

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto pointer-events-auto">
            <LiquidButton
              variant="default"
              size="lg"
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-7 py-3 font-mono text-xs uppercase tracking-wider font-bold text-white hover:text-primary"
            >
              <span>Explore Projects</span>
            </LiquidButton>
            <div className="flex flex-row gap-3 w-full sm:w-auto">
              <a href="/Shivam_Resume.pdf" download="Shivam_Resume.pdf" className="flex-1 sm:flex-none">
                <LiquidButton size="lg" className="w-full px-5 py-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white hover:text-primary">
                  <Download size={14} />
                  <span>Resume</span>
                </LiquidButton>
              </a>
              <a href="mailto:shivamsinghraghuvanshi1234@gmail.com" className="flex-1 sm:flex-none">
                <LiquidButton size="lg" className="w-full px-5 py-3 font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 text-white hover:text-primary">
                  <Send size={14} />
                  <span>Contact</span>
                </LiquidButton>
              </a>
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
