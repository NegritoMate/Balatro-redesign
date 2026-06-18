import { useState, useRef, MouseEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Sparkles, AlertOctagon, Heart, Coins, ShieldAlert, Award } from "lucide-react";

export interface JokerData {
  id: string;
  name: string;
  rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
  multiplier: string;
  chips: string;
  description: string;
  technicalCode: string;
  synergyClass: string;
  baseWinRate: number;
  comboPotential: number;
  artStyle: {
    bg: string;
    glow: string;
    accent: string;
    symbol: string | ReactNode;
  };
}

interface JokerCardProps {
  joker: JokerData;
  onSelect?: (joker: JokerData) => void;
}

export default function JokerCard({ joker, onSelect }: JokerCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Mouse coords relative to center of card
    const x = e.clientX - rect.left - width / 2;
    const y = e.clientY - rect.top - height / 2;
    
    // Normalize coordinates (-0.5 to 0.5) and scale to tilt angle
    const rotateX = -(y / height) * 25; // max 25 degrees tilt
    const rotateY = (x / width) * 25;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const copyTechnicalCode = (e: MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(joker.technicalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case "Legendary":
        return "bg-purple-950 text-purple-400 border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]";
      case "Rare":
        return "bg-rose-950 text-rose-400 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
      case "Uncommon":
        return "bg-cyan-950 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]";
      default:
        return "bg-slate-900 text-slate-400 border-slate-700/50";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect?.(joker)}
      style={{
        perspective: 1000,
      }}
      className="relative w-full aspect-[2.5/4.2] cursor-pointer group select-none"
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: isHovered ? 1.03 : 1,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 150,
          mass: 0.5,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
        className={`w-full h-full rounded-xl bg-gradient-to-b from-[#0F191B] to-[#0D1517] border-2 ${
          isHovered ? "border-[#DE443B]" : "border-[#1A262C]"
        } relative overflow-hidden flex flex-col p-4 shadow-2xl transition-colors duration-300`}
      >
        {/* Swirling Holographic Overlay for high tier cards */}
        <div
          className={`absolute inset-0 opacity-10 mix-blend-color-dodge pointer-events-none transition-opacity duration-300 ${
            isHovered ? "opacity-25" : "opacity-10"
          } bg-gradient-to-tr ${joker.artStyle.glow}`}
        />

        {/* HUD Matrix grid background lines */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-10 pointer-events-none" />

        {/* 1px Tech Border Details */}
        <div className="absolute top-2 left-2 right-2 bottom-2 border border-dashed border-[#1A262C] pointer-events-none rounded-lg" />

        {/* Header section (Rarity & Code) */}
        <div className="flex items-center justify-between z-10 mb-4" style={{ transform: "translateZ(30px)" }}>
          <span
            className={`text-[8px] font-pixel tracking-wider uppercase px-2 py-0.5 border rounded-xs ${getRarityBadgeStyle(
              joker.rarity
            )}`}
          >
            {joker.rarity}
          </span>
          <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
            {joker.id}
          </span>
        </div>

        {/* Card Artwork Showcase (Procedural CSS Canvas/SVGs) */}
        <div
          className={`relative flex-1 rounded-lg ${joker.artStyle.bg} flex items-center justify-center overflow-hidden border border-[#1A262C] mb-4 group-hover:border-white/10 transition-colors`}
          style={{ transform: "translateZ(40px)" }}
        >
          {/* Circular Hologram aura inside artwork */}
          <div className="absolute w-28 h-28 rounded-full bg-black/40 border border-white/5 flex items-center justify-center animate-[pulse_3s_infinite]" />
          
          {/* Geometric card-back patterns */}
          <div className="absolute w-20 h-32 border border-white/5 rotate-12 flex items-center justify-center" />
          <div className="absolute w-20 h-32 border border-white/5 -rotate-12 flex items-center justify-center" />

          {/* Core Joker Graphic Symbol */}
          <div className="relative text-white z-10 flex flex-col items-center">
            {joker.artStyle.symbol}
          </div>

          {/* Interactive Floating Micro-stats */}
          <div className="absolute bottom-2 left-2 flex gap-1 items-center bg-[#070B0C]/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-[#1A262C]">
            <Coins className="w-2.5 h-2.5 text-yellow-500" />
            <span className="text-[8px] font-pixel text-yellow-500">$6</span>
          </div>

          <div className="absolute top-2 right-2 flex gap-1 items-center bg-[#070B0C]/80 backdrop-blur-md px-1.5 py-0.5 rounded border border-[#1A262C]">
            <Award className="w-2.5 h-2.5 text-cyan-400" />
            <span className="text-[8px] font-pixel text-cyan-400">Lv.2</span>
          </div>
        </div>

        {/* Joker Name Info */}
        <div className="mb-3 z-10" style={{ transform: "translateZ(25px)" }}>
          <h3 className="text-sm font-pixel text-white tracking-tight uppercase line-clamp-1">
            {joker.name}
          </h3>
          <div className="flex gap-2 items-center mt-1">
            <span className="text-[10px] text-gray-400 font-sans tracking-wide">
              {joker.synergyClass}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="text-[10px] text-emerald-400 font-mono">
              {joker.multiplier}
            </span>
          </div>
        </div>

        {/* Performance Statistics Bar HUD */}
        <div className="space-y-1.5 mt-auto z-10" style={{ transform: "translateZ(20px)" }}>
          {/* Win Rate Bar */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-0.5 text-gray-400">
              <span className="flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-[spin_4s_linear_infinite]" /> Win Rate Impact
              </span>
              <span>{joker.baseWinRate}%</span>
            </div>
            <div className="h-1 bg-[#070B0C] border border-[#1A262C] rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isHovered ? `${joker.baseWinRate}%` : "30%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-600 to-amber-500"
              />
            </div>
          </div>

          {/* Combo Potential */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-0.5 text-gray-400">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-2.5 h-2.5 text-cyan-400" /> Combo Potential
              </span>
              <span>{joker.comboPotential}/10</span>
            </div>
            <div className="h-1 bg-[#070B0C] border border-[#1A262C] rounded-sm overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: isHovered ? `${joker.comboPotential * 10}%` : "15%" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-cyan-600 to-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Hover Inspect Detail Overlay (GSAP / slide-up overlay) */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-[2px] bg-[#0A0F11]/98 z-30 p-4 rounded-xl flex flex-col justify-between border border-[#DE443B] glow-red hologram-screen"
            >
              <div>
                <div className="flex items-center justify-between border-b border-[#1A262C] pb-2 mb-3">
                  <span className="text-[9px] font-pixel text-[#DE443B]">INSPECT HUD v1.0</span>
                  <div className="flex items-center gap-1 bg-[#1A262C] px-1.5 py-0.5 rounded text-[8px] font-mono text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-[ping_1.5s_infinite]" /> SYNC
                  </div>
                </div>

                <h4 className="text-xs font-pixel text-white uppercase tracking-wider mb-2">
                  {joker.name}
                </h4>

                <p className="text-[11px] text-gray-300 font-sans leading-relaxed mb-3">
                  {joker.description}
                </p>

                <div className="grid grid-cols-2 gap-2 mt-4 bg-black/30 p-2 rounded border border-[#1A262C]">
                  <div>
                    <span className="block text-[8px] text-gray-500 font-pixel">CHIPS</span>
                    <span className="text-xs font-pixel text-blue-400">{joker.chips || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-gray-500 font-pixel">MULT</span>
                    <span className="text-xs font-pixel text-rose-500">{joker.multiplier || "N/A"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-auto">
                <button
                  onClick={copyTechnicalCode}
                  className="w-full flex items-center justify-center gap-2 bg-[#10191B] hover:bg-[#DE443B] py-2 px-3 rounded-lg border border-[#1A262C] text-[10px] font-pixel uppercase tracking-wide text-white transition-all duration-200"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? "COPIED CODE!" : "GENERATE XML"}
                </button>
                <div className="text-[8px] text-center text-gray-500 font-mono tracking-tighter">
                  UUID: BAL-{joker.id.toUpperCase()}-3000
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
