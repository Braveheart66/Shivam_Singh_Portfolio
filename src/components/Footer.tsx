import React from "react";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";

const LeetCodeIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

export const socialMenuItems = [
  {
    title: "GitHub",
    icon: <Github size={22} />,
    href: "https://github.com/Braveheart66",
    gradientFrom: "#1f2937",
    gradientTo: "#8b5cf6",
  },
  {
    title: "LinkedIn",
    icon: <Linkedin size={22} />,
    href: "https://linkedin.com/in/shivam-singh-93ab0b2a7",
    gradientFrom: "#006699",
    gradientTo: "#00b4d8",
  },
  {
    title: "LeetCode",
    icon: <LeetCodeIcon size={22} />,
    href: "https://leetcode.com/u/ShivamSingh_44/",
    gradientFrom: "#f59e0b",
    gradientTo: "#ea580c",
  },
  {
    title: "Email",
    icon: <Mail size={22} />,
    href: "mailto:shivamsinghraghuvanshi1234@gmail.com",
    gradientFrom: "#059669",
    gradientTo: "#10b981",
  },
];

export const GradientSocialMenu = () => {
  return (
    <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 py-4">
      {socialMenuItems.map(({ title, icon, href, gradientFrom, gradientTo }, idx) => (
        <li
          key={idx}
          style={
            {
              "--gradient-from": gradientFrom,
              "--gradient-to": gradientTo,
            } as React.CSSProperties
          }
          className="relative w-[56px] h-[56px] sm:w-[60px] sm:h-[60px] bg-[#111317] border border-white/10 shadow-lg rounded-full flex items-center justify-center transition-all duration-500 hover:w-[160px] sm:hover:w-[180px] hover:shadow-none group cursor-pointer"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={title}
            className="absolute inset-0 flex items-center justify-center rounded-full overflow-hidden"
          >
            {/* Gradient background on hover */}
            <span className="absolute inset-0 rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] opacity-0 transition-all duration-500 group-hover:opacity-100"></span>

            {/* Blur glow */}
            <span className="absolute top-[10px] inset-x-0 h-full rounded-full bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] blur-[15px] opacity-0 -z-10 transition-all duration-500 group-hover:opacity-60"></span>

            {/* Icon */}
            <span className="relative z-10 transition-all duration-500 group-hover:scale-0 delay-0 text-white/80 group-hover:text-white">
              {icon}
            </span>

            {/* Title */}
            <span className="absolute text-white uppercase tracking-wider text-xs sm:text-sm font-bold transition-all duration-500 scale-0 group-hover:scale-100 delay-150 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {title}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
};

const Footer = () => (
  <footer className="border-t border-border py-12 px-6 text-center bg-background/95 relative z-10">
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center gap-8">
      {/* Expanding Gradient Social Menu */}
      <GradientSocialMenu />

      <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-6 border-t border-border/40 text-xs font-mono text-muted-foreground gap-4">
        <p>
          <span className="text-primary font-bold">Shivam Singh</span> — Architecting Scalable Cloud Systems & Intelligent AI Backends.
        </p>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer"
        >
          <span>BACK TO TOP</span>
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  </footer>
);

export default Footer;
