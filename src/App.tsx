import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame, 
  Tv, 
  Radio, 
  ShoppingBag, 
  Dices, 
  HelpCircle, 
  RefreshCw, 
  Cpu, 
  ChevronRight, 
  Code,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign
} from "lucide-react";
import Balatro from "./components/Balatro";
import JokerCard, { JokerData } from "./components/JokerCard";
import { JOKERS_DATA } from "./data/jokers";

// Retro 8-bit sound synth trigger helper
const playSynthBeep = (freq: number, type: OscillatorType = "sine", duration: number = 0.08, volume: number = 0.04) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Swallowed safely (e.g. if browser audio context is suspended)
  }
};

export default function App() {
  // Navigation / Tabs state
  const [activeTab, setActiveTab] = useState<"sandbox" | "trilogy" | "merch">("sandbox");
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Time & Seed States
  const [utcTime, setUtcTime] = useState("");
  const [randomSeed, setRandomSeed] = useState("V7T9-M34A");
  
  // Synergy Sandbox State
  const [slottedJokers, setSlottedJokers] = useState<JokerData[]>([
    JOKERS_DATA[1], // Blueprint (Rare)
    JOKERS_DATA[2], // Baron (Rare)
    JOKERS_DATA[5], // Yorick (Legendary)
  ]);
  const [selectedHandType, setSelectedHandType] = useState<"Flush" | "Straight Flush" | "Four of a Kind" | "Full House" | "Two Pair">("Straight Flush");
  const [handLevel, setHandLevel] = useState(5);
  const [baseChips, setBaseChips] = useState(120);
  const [baseMult, setBaseMult] = useState(12);
  const [totalCalculatedScore, setTotalCalculatedScore] = useState(0);
  const [isScoringSequence, setIsScoringSequence] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  // CRT Screen filter toggles (interactive cinematic dials)
  const [scanlineDensity, setScanlineDensity] = useState(0.12);
  const [hasFlicker, setHasFlicker] = useState(true);
  const [screenHue, setScreenHue] = useState<"amber" | "green" | "cyber">("cyber");

  // Shop item detail selection
  const [selectedShopSize, setSelectedShopSize] = useState<string>("XL");
  const [shopBagCount, setShopBagCount] = useState<number>(0);
  const [activeProductDemo, setActiveProductDemo] = useState<number>(0);

  // Update dynamic telemetry variables
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.getUTCFullYear() + "-" + 
                 String(now.getUTCMonth()+1).padStart(2,'0') + "-" + 
                 String(now.getUTCDate()).padStart(2,'0') + "T" + 
                 String(now.getUTCHours()).padStart(2,'0') + ":" + 
                 String(now.getUTCMinutes()).padStart(2,'0') + ":" + 
                 String(now.getUTCSeconds()).padStart(2,'0') + "Z"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Play micro clicks
  const triggerTone = (freq: number, type: OscillatorType = "sine", duration: number = 0.08, volume: number = 0.04) => {
    if (!soundEnabled) return;
    playSynthBeep(freq, type, duration, volume);
  };

  // Generate a random deck seed
  const regenSeed = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let segment1 = "";
    let segment2 = "";
    for (let i = 0; i < 4; i++) {
      segment1 += chars.charAt(Math.floor(Math.random() * chars.length));
      segment2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setRandomSeed(`${segment1}-${segment2}`);
    triggerTone(800, "square", 0.05);
  };

  // Trigger high action scoring combination calculator
  const triggerScoreCombo = () => {
    if (isScoringSequence) return;
    setIsScoringSequence(true);
    triggerTone(300, "sawtooth", 0.15, 0.08);

    // Dynamic state climb
    let iterations = 0;
    const finalVal = calculateCurrentSynergyScore();
    
    // Scale sound frequencies as score hikes up
    const scoreValInterval = setInterval(() => {
      iterations++;
      setTotalCalculatedScore(Math.floor((finalVal / 10) * iterations));
      triggerTone(400 + iterations * 40, "triangle", 0.04, 0.06);

      if (iterations >= 10) {
        clearInterval(scoreValInterval);
        setTotalCalculatedScore(finalVal);
        setShakeScreen(true);
        triggerTone(120, "sawtooth", 0.45, 0.1); // big release impact!
        
        setTimeout(() => {
          setShakeScreen(false);
          setIsScoringSequence(false);
        }, 800);
      }
    }, 100);
  };

  // Formula to calculate score depending on equipped Jokers and Level multipliers
  const calculateCurrentSynergyScore = () => {
    let chips = baseChips + (handLevel * 30);
    let mult = baseMult + (handLevel * 3);

    // Apply active slotted jokers
    slottedJokers.forEach(j => {
      if (j.id === "gros-michel") {
        mult += 15;
      } else if (j.id === "gallow-joker") {
        // Baron
        mult = Math.round(mult * 1.5);
      } else if (j.id === "abstract") {
        mult += (slottedJokers.length * 3);
        chips += 30;
      } else if (j.id === "cerebral") {
        // Yorick
        mult = Math.round(mult * 5.0);
      } else if (j.id === "blueprint") {
        // Blueprint copies immediate right card or provides generic upgrade
        mult = Math.round(mult * 1.25);
        chips += 50;
      }
    });

    return chips * mult;
  };

  // Add card to equipped sandboxed hand (maximum 5 cards layout)
  const equipJoker = (joker: JokerData) => {
    if (slottedJokers.some(j => j.id === joker.id)) {
      // Remove it if already equipped
      setSlottedJokers(slottedJokers.filter(j => j.id !== joker.id));
      triggerTone(260, "sine", 0.1);
    } else {
      if (slottedJokers.length >= 5) {
        // Limit max 5 slots
        triggerTone(150, "triangle", 0.25, 0.08); // warning sound
        return;
      }
      setSlottedJokers([...slottedJokers, joker]);
      triggerTone(520, "sine", 0.1);
    }
  };

  const getHandTypeMultiplierLabel = () => {
    switch (selectedHandType) {
      case "Straight Flush": return { baseC: 180, baseM: 16 };
      case "Four of a Kind": return { baseC: 120, baseM: 12 };
      case "Full House": return { baseC: 80, baseM: 8 };
      case "Flush": return { baseC: 70, baseM: 7 };
      default: return { baseC: 30, baseM: 2 };
    }
  };

  // Respond whenever user adjusts base hand types
  useEffect(() => {
    const { baseC, baseM } = getHandTypeMultiplierLabel();
    setBaseChips(baseC);
    setBaseMult(baseM);
  }, [selectedHandType]);

  return (
    <div className={`min-h-screen bg-[#0A0F11] font-sans antialiased text-gray-200 transition-transform duration-200 ${
      shakeScreen ? "animate-[bounce_0.1s_infinite] scale-98 border-2 border-[#DE443B]" : ""
    }`}>
      {/* Absolute CRT Overlay Frame with dynamic variables */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-15"
        style={{
          background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.3) 50%), linear-gradient(90deg, rgba(230, 50, 50, ${scanlineDensity}), rgba(50, 230, 50, 0.03), rgba(50, 50, 230, ${scanlineDensity}))`,
          backgroundSize: "100% 3px, 5px 100%"
        }}
      />
      
      {/* Glitch CRT flickering simulator */}
      {hasFlicker && <div className="fixed inset-0 pointer-events-none z-40 bg-white/[0.003] crt-flicker" />}

      {/* Retro HUD top bar layout */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0F11]/90 backdrop-blur-md border-b border-[#1A262C] px-4 md:px-8 py-3.5 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-6">
          <div 
            onClick={() => { triggerTone(300, "square"); reinitalizeSandbox(); }}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded bg-[#DE443B] flex items-center justify-center font-pixel text-black text-sm font-bold shadow-[0_0_10px_rgba(222,68,59,0.5)]">
              B
            </div>
            <div>
              <h1 className="text-sm font-pixel font-bold tracking-tight text-white group-hover:text-[#DE443B] transition-colors">
                BALATRO redeluxe
              </h1>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 bg-[#0C1517] border border-dashed border-[#DE443B]/40 hover:border-[#DE443B]/80 rounded px-3 py-1 text-[11px] font-mono shadow-[inset_0_0_8px_rgba(222,68,59,0.05)] transition-all">
            <span className="text-gray-500 tracking-wider">GAME SEED</span>
            <span className="text-[#DE443B] font-pixel text-[10px] bg-black/50 px-2 py-0.5 rounded font-bold border border-[#DE443B]/20 tracking-normal select-all">
              {randomSeed}
            </span>
            <button 
              onClick={regenSeed}
              className="text-[#12C2E9] hover:text-white transition-colors p-0.5 hover:bg-[#12C2E9]/10 rounded cursor-pointer"
              title="Reroll Game Seed"
            >
              <RefreshCw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Real-Time UTC HUD Clock and Toggles */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {/* Audio volume controller */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSynthBeep(600, "sine", 0.05, 0.02);
            }}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled 
                ? "bg-[#102022] border-[#12C2E9]/40 text-[#12C2E9]" 
                : "bg-black/40 border-[#1A262C] text-gray-500 hover:text-gray-300"
            }`}
            title={soundEnabled ? "Disable Interactive Synth Audio" : "Enable Interactive Synth Audio"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Pre-purchase interactive button */}
          <a
            href="https://playbalatro.com"
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerTone(880)}
            className="flex items-center gap-1.5 bg-[#DE443B] hover:bg-red-500 text-black font-pixel text-[10px] py-2 px-4 rounded font-bold uppercase shadow-[0_0_12px_rgba(222,68,59,0.3)] hover:shadow-[0_0_20px_rgba(222,68,59,0.6)] transition-all"
          >
            BUY BALATRO <ChevronRight className="w-3.5 h-3.5 stroke-[3px]" />
          </a>
        </div>
      </header>

      {/* HERO SECTION / WebGL Kinetic Masterpiece */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[#1A262C]">
        {/* Background WebGL Shader Canvas wrapper */}
        <div className="absolute inset-0 z-0 opacity-45 mix-blend-screen pointer-events-none">
          <Balatro
            isRotate={false}
            mouseInteraction={true}
            pixelFilter={750}
          />
        </div>

        {/* Diagonal wire grid lines layout */}
        <div className="absolute inset-0 cyber-grid-pattern opacity-10 pointer-events-none" />

        {/* Core HUD content overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center select-none py-16 flex flex-col items-center justify-center">
          <h2
            className="text-6xl sm:text-7xl md:text-9xl font-pixel tracking-tighter text-white uppercase leading-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] text-center"
            style={{ textShadow: "0 0 20px rgba(222, 68, 59, 0.4)" }}
          >
            Balatro <br/> 
            <span className="text-[#DE443B]">Redesigned</span>
          </h2>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="h-[2px] w-8 bg-gradient-to-r from-transparent to-[#12C2E9]" />
            <p className="text-[#12C2E9] font-pixel text-xs tracking-widest uppercase">
              The Poker Roguelike
            </p>
            <span className="h-[2px] w-8 bg-gradient-to-l from-transparent to-[#12C2E9]" />
          </div>

          <p className="mt-6 text-sm sm:text-base max-w-xl mx-auto text-center text-gray-400 font-sans font-normal leading-relaxed">
            Discover illegal deck synergies, generate brain-melting card multipliers, trigger insane poker scores, and uncover rare legendary jokers in an environment of true retro-cyberpunk aesthetic luxury.
          </p>

          {/* Call to arms buttons */}
          <div className="mt-10 flex flex-wrap gap-4 justify-center items-center">
            <button
              onClick={() => {
                triggerTone(440, "sine");
                const target = document.getElementById("sandbox-panel");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#DE443B] text-black font-pixel text-[11px] py-4 px-8 rounded font-bold uppercase shadow-[0_5px_0_#9c2a24] hover:translate-y-[-2px] hover:shadow-[0_7px_0_#9c2a24] active:translate-y-[2px] active:shadow-[0_2px_0_#9c2a24] transition-all"
            >
              PLAY SYNERGY SANDBOX
            </button>
            <button
              onClick={() => {
                triggerTone(660);
                const target = document.getElementById("cinema");
                target?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-[#101F22] hover:bg-[#1A3438] text-[#12C2E9] font-pixel text-[11px] py-4 px-8 rounded font-bold uppercase border border-[#12C2E9]/40 hover:border-[#12C2E9] transition-all"
            >
              LAUNCH CINEMA BAY
            </button>
          </div>
        </div>
      </section>

      {/* CORE REDESIGNED SECTION NAV / HUD SELECT */}
      <div className="bg-[#0D1517] border-b border-[#1A262C] sticky top-[68px] z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center h-14">
          <div className="flex gap-1 md:gap-4 font-pixel text-[9px] md:text-[10px] uppercase">
            <button
              onClick={() => { triggerTone(300); setActiveTab("sandbox"); }}
              className={`px-4 py-2 border-t-2 transition-all ${
                activeTab === "sandbox" 
                  ? "border-t-[#DE443B] text-white bg-[#0A0F11]" 
                  : "border-t-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              🃏 DECK MATRIX
            </button>
            <button
              onClick={() => { triggerTone(300); setActiveTab("trilogy"); }}
              className={`px-4 py-2 border-t-2 transition-all ${
                activeTab === "trilogy" 
                  ? "border-t-[#12C2E9] text-white bg-[#0A0F11]" 
                  : "border-t-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              📺 CRT SPECTRA
            </button>
            <button
              onClick={() => { triggerTone(300); setActiveTab("merch"); }}
              className={`px-4 py-2 border-t-2 transition-all ${
                activeTab === "merch" 
                  ? "border-t-[#F4D03F] text-white bg-[#0A0F11]" 
                  : "border-t-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              🎒 MERCH CODES
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-6 font-mono text-[11px] text-gray-500">
            <span>ACTIVE BLIND: <b className="text-rose-500">THE CERULEAN BELL</b></span>
            <span>ANTE: <b>7 / 8</b></span>
            <span>ROUND STATUS: <b>PRE-FLOP</b></span>
          </div>
        </div>
      </div>

      {/* RENDER ACTIVE TAB VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        
        {/* ================== TAB 1: SANDBOX / MATRIX ================== */}
        {activeTab === "sandbox" && (
          <div id="sandbox-panel" className="space-y-16 animate-fade-in">
            
            {/* Introductory Awwwards Info Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-black/60 border border-[#1A262C] rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#DE443B]/5 rounded-full blur-3xl pointer-events-none" />
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DE443B] animate-ping" />
                  <span className="text-[#DE443B] font-pixel text-[10px] uppercase tracking-widest">Interactive Game Sandbox</span>
                </div>
                <h3 className="text-2xl md:text-4xl font-pixel uppercase tracking-tight text-white leading-tight">
                  Discover The Slotted <br/>
                  <span className="text-[#12C2E9]">Joker Combos</span>
                </h3>
                <p className="text-sm text-gray-400 font-sans max-w-xl">
                  In Balatro, every Joker alters the rule mechanics. In this redesign, we have built a fully interactive poker calculation engine. Tap to equip or un-equip Jokers below, change your poker hand level, and click <b>TRIGGER SCORE COMBO</b> to simulate a high Ante screen explosion of chips!
                </p>
              </div>

              <div className="lg:col-span-5 bg-[#0C1416] p-5 rounded-xl border border-[#1A262C] space-y-4">
                <div className="text-[10px] font-pixel text-gray-500 border-b border-[#1A262C] pb-2">
                  COMBO METRIC ENGINE
                </div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Equips:</span>
                    <span className="text-white font-bold">{slottedJokers.length}/5 Slots Utilized</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Hand Variant:</span>
                    <span className="text-[#12C2E9] font-bold">{selectedHandType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dynamic Score Projection:</span>
                    <span className="text-yellow-400 font-bold">~{(calculateCurrentSynergyScore() * 1.5).toLocaleString()} max chips</span>
                  </div>
                </div>
                <button
                  onClick={reinitalizeSandbox}
                  className="w-full bg-[#1A262C] hover:bg-[#DE443B]/20 border border-[#24353E] hover:border-[#DE443B] text-gray-400 hover:text-white py-2 px-3 rounded text-[10px] font-pixel uppercase transition-all duration-200"
                >
                  Clear Active Setup
                </button>
              </div>
            </div>

            {/* Interactive Deck Builder Sandbox Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Slotted equipped cards HUD */}
              <div className="xl:col-span-8 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 space-y-8 backdrop-blur-sm shadow-xl relative hologram-screen">
                
                {/* HUD Header */}
                <div className="flex items-center justify-between border-b border-[#1A262C] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded bg-black border border-[#1A262C]">
                      <Layers className="w-5 h-5 text-[#DE443B]" />
                    </span>
                    <div>
                      <h4 className="font-pixel text-xs text-white uppercase tracking-wider">
                        ACTIVE SYNERGY BAR (MAX 5 SLOTS)
                      </h4>
                      <p className="text-[10px] font-mono text-gray-500">Order from left-to-right impacts ultimate chip tallying</p>
                    </div>
                  </div>
                  <div className="text-xs font-mono bg-black/40 border-hud border px-3 py-1 rounded">
                    SLOTTED: <b className="text-[#DE443B]">{slottedJokers.length}</b> / 5
                  </div>
                </div>

                {/* Equipped Slots Container */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 min-h-[220px] items-center justify-center bg-black/30 p-4 rounded-xl border border-[#1A262C] relative">
                  
                  {slottedJokers.length === 0 ? (
                    <div className="col-span-full py-16 text-center text-gray-500 font-pixel text-xs tracking-tight uppercase leading-relaxed">
                      ❌ NO JOKERS SLOTTED.<br/>
                      <span className="text-[10px] text-gray-600 font-sans text-normal block mt-2">
                        Select elegant cards from the card shelf below to begin building your custom multiplier deck.
                      </span>
                    </div>
                  ) : (
                    slottedJokers.map((joker, index) => (
                      <motion.div
                        key={`slotted-${joker.id}`}
                        layoutId={`joker-${joker.id}`}
                        className="relative group cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        onClick={() => {
                          setSlottedJokers(slottedJokers.filter(j => j.id !== joker.id));
                          triggerTone(260, "sine", 0.08);
                        }}
                      >
                        {/* Numerical order locator badge */}
                        <div className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-black border border-[#DE443B] text-[9px] font-pixel text-white flex items-center justify-center z-10">
                          {index + 1}
                        </div>
                        
                        <div className={`p-3 rounded-lg border text-center ${
                          joker.rarity === "Legendary" ? "border-purple-500/40 bg-purple-950/20 shadow-lg" :
                          joker.rarity === "Rare" ? "border-rose-500/40 bg-rose-950/20 shadow-lg" :
                          joker.rarity === "Uncommon" ? "border-cyan-500/30 bg-cyan-950/20 shadow-lg" :
                          "border-[#1A262C] bg-[#0E1517]"
                        }`}>
                          <div className="text-2xl mb-1">{joker.artStyle.symbol}</div>
                          <div className="text-[10px] font-pixel text-white uppercase tracking-tighter truncate">{joker.name}</div>
                          <div className="text-[9px] font-mono text-emerald-400 mt-1">{joker.multiplier}</div>
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-[#DE443B]/90 backdrop-blur-xs flex items-center justify-center text-black font-pixel text-[9px] font-bold rounded-lg transition-opacity">
                            REMOVE
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}

                  {/* Empty Placeholders to highlight HUD space */}
                  {Array.from({ length: 5 - slottedJokers.length }).map((_, i) => (
                    <div 
                      key={`placeholder-${i}`} 
                      className="border border-dashed border-[#1A262C] h-28 rounded-lg flex items-center justify-center bg-transparent group"
                    >
                      <span className="text-[9px] font-pixel text-gray-700 select-none group-hover:text-gray-500 transition-colors">
                        EMPTY
                      </span>
                    </div>
                  ))}
                </div>

                {/* Score Projection HUD Panel */}
                <div className="bg-[#080D0E] border border-[#1A262C] p-6 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
                  
                  {/* Digital Chip Score LED Display */}
                  <div className="space-y-1.5 w-full md:w-auto">
                    <span className="text-[9px] font-pixel text-gray-500 uppercase tracking-widest block">
                      ANTE CHIPS PROJECTOR
                    </span>
                    <div className="font-pixel text-3xl sm:text-4xl text-yellow-400 tracking-tighter flex items-center gap-3">
                      <span>{isScoringSequence ? totalCalculatedScore.toLocaleString() : calculateCurrentSynergyScore().toLocaleString()}</span>
                      <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded font-mono">
                        CHIPS
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-gray-500">
                      Formulated via Base Chips ({baseChips + (handLevel * 30)}) × Mult ({baseMult + (handLevel * 3)}) following equipped coefficients.
                    </div>
                  </div>

                  {/* Large tactile action button */}
                  <button
                    onClick={triggerScoreCombo}
                    disabled={isScoringSequence}
                    className="w-full md:w-auto bg-[#DE443B] hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:shadow-none text-black font-pixel text-xs py-4 px-8 rounded-lg font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 shadow-[0_4px_14px_rgba(222,68,59,0.4)] cursor-pointer"
                  >
                    <Flame className="w-4 h-4 animate-bounce" />
                    {isScoringSequence ? "TALLYING CHIPS..." : "TRIGGER SCORE COMBO!"}
                  </button>
                </div>

              </div>

              {/* Right Column: Hand Configulators & Dials */}
              <div className="xl:col-span-4 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 space-y-6">
                <div className="border-b border-[#1A262C] pb-4">
                  <h4 className="font-pixel text-xs text-white uppercase">
                    Poker Hand Settings
                  </h4>
                  <p className="text-[9px] font-mono text-gray-500 mt-1">Simulate combinations to calculate multiplying indexes</p>
                </div>

                {/* Hand type selector */}
                <div className="space-y-3">
                  <label className="text-[10px] font-pixel text-gray-400 uppercase block">Combo Played:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(["Straight Flush", "Four of a Kind", "Full House", "Flush", "Two Pair"] as const).map((hand) => (
                      <button
                        key={hand}
                        onClick={() => { setSelectedHandType(hand); triggerTone(400, "triangle", 0.05); }}
                        className={`flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                          selectedHandType === hand
                            ? "bg-[#DE443B]/10 border-[#DE443B] text-white"
                            : "bg-black/30 border-[#1A262C] text-gray-400 hover:text-gray-200"
                        }`}
                      >
                        <span className="font-pixel text-[10px] uppercase">{hand}</span>
                        <div className="font-mono text-[10px] flex gap-2">
                          <span className="text-blue-400">
                            {hand === "Straight Flush" ? "180x16" :
                             hand === "Four of a Kind" ? "120x12" :
                             hand === "Full House" ? "80x8" :
                             hand === "Flush" ? "70x7" : "30x2"}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Combobox Hand level slider */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-pixel text-gray-400 uppercase">Combo Hand level:</label>
                    <span className="text-yellow-400 font-pixel text-xs">Level {handLevel}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={handLevel}
                    onChange={(e) => { setHandLevel(parseInt(e.target.value)); triggerTone(260 + handLevel * 25, "sine", 0.04); }}
                    className="w-full accent-[#DE443B]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-gray-500">
                    <span>LEVEL 1 (BASE)</span>
                    <span>LEVEL 15 (MAX COMBOS)</span>
                  </div>
                </div>

                {/* Ticker diagnostic display readout */}
                <div className="bg-[#070B0C] border border-[#1A262C] p-4 rounded-lg space-y-2">
                  <div className="text-[8px] font-pixel text-slate-500 uppercase tracking-widest border-b border-[#1A262C]/50 pb-1">
                    DECISIVE SYSTEM TELEMETRY
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono leading-relaxed">
                    <div>
                      <span className="text-gray-500 block">BASE SCORE:</span>
                      <span className="text-blue-400">{baseChips + (handLevel * 30)} chips</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">BASE MULT:</span>
                      <span className="text-rose-500">+{baseMult + (handLevel * 3)} mult.</span>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-[#1A262C]/40">
                      <span className="text-gray-500 block">EQUIPPED SYNERGIES:</span>
                      <p className="text-gray-300 truncate">
                        {slottedJokers.length > 0 
                          ? slottedJokers.map(j => j.name).join(", ") 
                          : "None (Raw hand parameters only)"}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Shelf catalog title */}
            <div className="space-y-4 pt-10 text-center">
              <span className="px-3.5 py-1 rounded-full text-[8px] font-pixel tracking-widest text-[#12C2E9] border border-[#12C2E9]/20 bg-black uppercase inline-block">
                ★ CHOOSE THE COMBOS BELOW ★
              </span>
              <h3 className="text-2xl md:text-3xl font-pixel uppercase tracking-tight text-white">
                THE Redesigned <span className="text-[#DE443B]">JOKERS CLASSIFICATION</span>
              </h3>
              <p className="text-sm text-gray-400 font-sans max-w-xl mx-auto">
                Hover columns to analyze technical cards stats. Tap cards to slot them straight into the dynamic interactive calculator workspace above!
              </p>
            </div>

            {/* Standard Catalog Listing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 pt-4">
              {JOKERS_DATA.map((joker) => {
                const isEquipped = slottedJokers.some(j => j.id === joker.id);
                return (
                  <div key={joker.id} className="relative">
                    {/* Floating Equippped Status Ribbon */}
                    {isEquipped && (
                      <div className="absolute top-[-8px] right-2 z-40 bg-[#DE443B] text-black font-pixel text-[8px] font-bold uppercase py-1 px-2.5 rounded-sm shadow-[0_0_8px_#DE443B/50] border border-black animate-pulse">
                        SLOTTED
                      </div>
                    )}
                    <JokerCard 
                      joker={joker} 
                      onSelect={(j) => equipJoker(j)} 
                    />
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ================== TAB 2: CRT CINEMATIC SPECTRA ================== */}
        {activeTab === "trilogy" && (
          <div id="cinema" className="space-y-12 animate-fade-in">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-[8px] font-pixel tracking-widest text-[#12C2E9] border border-[#12C2E9]/20 bg-black uppercase inline-block font-bold">
                CRT SPECTRA EXPERIENCE
              </span>
              <h2 className="text-3xl md:text-4xl font-pixel uppercase text-white leading-tight">
                Vintage Video <span className="text-[#DE443B]">Cinema Console</span>
              </h2>
              <p className="text-sm text-gray-400">
                Immerse yourself inside the software retro atmosphere. Leverage physical system dials to distort real-time filter density, simulated phosphor tubes, and classic terminal colors.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Dynamic video monitor showcase wrapper */}
              <div className="lg:col-span-8 space-y-4">
                <div className={`relative aspect-video rounded-2xl overflow-hidden border border-[#1A262C] bg-[#070B0C] shadow-2xl flex flex-col justify-between hologram-screen ${
                  screenHue === "amber" ? "bg-amber-950/20 border-amber-900/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]" :
                  screenHue === "green" ? "bg-emerald-950/20 border-emerald-950 shadow-[0_0_30px_rgba(16,185,129,0.15)]" : ""
                }`}>
                  
                  {/* Glowing bezel effect */}
                  <div className="absolute inset-0 border-[8px] border-black/80 pointer-events-none rounded-2xl z-30" />
                  
                  {/* Overlay scanline effect simulated via active slider variables */}
                  <div 
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      background: `linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%)`,
                      backgroundSize: `100% ${4 + (scanlineDensity * 20)}px`
                    }}
                  />

                  {/* Top Monitor Info Bar */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 font-mono text-[10px] text-gray-500">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        screenHue === "amber" ? "bg-amber-500" :
                        screenHue === "green" ? "bg-emerald-500" : "bg-[#12C2E9]"
                      } animate-ping`} />
                      <span className="text-white">SOURCE: BALATRO_GAMEPLAY_V2</span>
                    </div>
                    <div>FPS: 60.0 // AUTO_SCAN</div>
                  </div>

                  {/* Dynamic simulated vintage gameplay loops */}
                  <div className="absolute inset-0 flex items-center justify-center p-8 text-center bg-radial from-slate-900 to-black z-0">
                    <div className="space-y-6">
                      <div className="w-16 h-16 rounded-full bg-black/40 border border-[#DE443B] flex items-center justify-center mx-auto text-xl animate-[spin_5s_linear_infinite]">
                        🃏
                      </div>
                      <div className="space-y-2">
                        <span className="font-pixel text-xs text-white uppercase block">
                          [ SYSTEM STREAM PREPARING ]
                        </span>
                        <p className="text-[11px] font-mono text-gray-500 max-w-sm mx-auto">
                          Simulating retro visualizer telemetry loop... Watch cards swirl in psychedelic sequence inside the landing hero background!
                        </p>
                      </div>
                      <div className="flex justify-center gap-1.5 font-pixel text-[9px] text-[#12C2E9]">
                        <span className="animate-[pulse_1s_infinite]">● REC</span>
                        <span>00:14:02</span>
                      </div>
                    </div>
                  </div>

                  {/* CRT bottom controller bar inside screen */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center z-10 font-mono text-[9px] text-gray-400">
                    <div>RESOLUTION: CRT_NATIVE_480I</div>
                    <div>AUDIO: SYNTH_WAVEFORM</div>
                  </div>

                </div>

                <div className="flex justify-between items-center bg-black/40 border border-[#1A262C] p-4 rounded-xl font-mono text-xs">
                  <span className="text-gray-400">CRT Monitor Frame Emulation Tool:</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setHasFlicker(!hasFlicker); triggerTone(400); }} 
                      className={`px-3 py-1 rounded border ${hasFlicker ? "bg-[#DE443B]/20 border-[#DE443B] text-white" : "border-[#1A262C] text-gray-500 hover:text-gray-300"}`}
                    >
                      FLICKER: {hasFlicker ? "ACTIVE" : "OFF"}
                    </button>
                    <button 
                      onClick={() => { setScanlineDensity(0.12); triggerTone(500); }} 
                      className="px-3 py-1 rounded border border-[#1A262C] text-gray-400 hover:text-white"
                    >
                      RESET DIALS
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Side: Virtual analog knobs console panel */}
              <div className="lg:col-span-4 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 space-y-6">
                <div className="border-b border-[#1A262C] pb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#DE443B]" />
                  <h4 className="font-pixel text-xs text-white uppercase">
                    ANALOG CONTROL BOARD
                  </h4>
                </div>

                {/* Dial 1: Scanline density */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-mono text-gray-400">
                    <span>SCANLINE COEF:</span>
                    <span className="text-white">{(scanlineDensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.30"
                    step="0.01"
                    value={scanlineDensity}
                    onChange={(e) => { setScanlineDensity(parseFloat(e.target.value)); triggerTone(300 + scanlineDensity * 800, "triangle", 0.05); }}
                    className="w-full accent-[#DE443B]"
                  />
                  <p className="text-[9px] font-mono text-gray-500">Alters the vertical thickness and dark-gap of simulated CRT lines.</p>
                </div>

                {/* Dial 2: Color Spectrum Hub */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-pixel text-gray-400 block uppercase">SCREEN PHOSPHOR MATRICES:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => { setScreenHue("cyber"); triggerTone(440); }}
                      className={`py-2 px-3 rounded text-[10px] font-pixel tracking-tighter transition-all ${
                        screenHue === "cyber" 
                          ? "bg-[#12C2E9]/20 border border-[#12C2E9] text-[#12C2E9] shadow-[0_0_8px_rgba(18,194,233,0.2)]" 
                          : "bg-black/30 border border-[#1A262C] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      CYBER
                    </button>
                    <button
                      onClick={() => { setScreenHue("green"); triggerTone(440); }}
                      className={`py-2 px-3 rounded text-[10px] font-pixel tracking-tighter transition-all ${
                        screenHue === "green" 
                          ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]" 
                          : "bg-black/30 border border-[#1A262C] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      GREEN
                    </button>
                    <button
                      onClick={() => { setScreenHue("amber"); triggerTone(440); }}
                      className={`py-2 px-3 rounded text-[10px] font-pixel tracking-tighter transition-all ${
                        screenHue === "amber" 
                          ? "bg-amber-500/20 border border-amber-500 text-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
                          : "bg-black/30 border border-[#1A262C] text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      AMBER
                    </button>
                  </div>
                </div>

                {/* Diagnostic readout block */}
                <div className="bg-[#070B0C] border border-[#1A262C] p-4 rounded-lg space-y-2 font-mono text-[10px] leading-relaxed">
                  <div className="text-[8px] font-pixel text-[#12C2E9] uppercase tracking-widest border-b border-[#1A262C]/50 pb-1 flex items-center justify-between">
                    <span>HARDWARE DIAGNOSTIC</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-gray-500">TUBE STATUS:</span> HOT / SOLID_OK
                  </div>
                  <div>
                    <span className="text-gray-500">MAGNET COILS:</span> SYNC_LOCKED
                  </div>
                  <div>
                    <span className="text-gray-500">SIGNAL FEED:</span> SEED_{randomSeed}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* ================== TAB 3: MERCHANDISE SHOP BENTO ================== */}
        {activeTab === "merch" && (
          <div id="shop" className="space-y-12 animate-fade-in text-gray-200">
            
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="px-3.5 py-1 rounded-full text-[8px] font-pixel tracking-widest text-[#F4D03F] border border-[#F4D03F]/20 bg-black uppercase inline-block font-bold">
                PHYSICAL ARTIFACTS v1.0
              </span>
              <h2 className="text-3xl md:text-4xl font-pixel uppercase text-white leading-tight">
                Limited Balatro <span className="text-[#DE443B]">Merch Codes</span>
              </h2>
              <p className="text-sm text-gray-400">
                Unlock exclusive collector gear, apparel layers, and tangible high-end card sets directly sourced from the roguelike illegal deck enterprises.
              </p>
            </div>

            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Product 1: Vinyl soundtrack - Large Grid */}
              <div className="md:col-span-8 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 flex flex-col md:flex-row justify-between relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#12C2E9]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="space-y-6 max-w-sm flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="bg-cyan-950 text-cyan-400 border border-cyan-800/40 text-[8px] font-pixel px-2 py-0.5 rounded-xs uppercase">
                      LIMITED EXCLUSIVE
                    </span>
                    <h3 className="text-2xl font-pixel uppercase tracking-tight text-white pt-2">
                      Balatro Vinyl Soundtrack
                    </h3>
                    <p className="text-xs text-gray-400 font-sans leading-relaxed">
                      Hear those hypnotic, swirling synth themes of Balatro in premium, heavy-weight 180g colored vinyl. Features holographic cover textures.
                    </p>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex gap-4 items-baseline font-mono">
                      <span className="text-2xl text-[#12C2E9] font-bold">$38.99</span>
                      <span className="text-xs text-gray-500 line-through">$49.99</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setShopBagCount(shopBagCount + 1);
                          triggerTone(700, "sine", 0.1);
                        }}
                        className="bg-[#12C2E9] hover:bg-cyan-400 text-black font-pixel text-[10px] py-3 px-6 rounded font-bold uppercase transition-transform active:scale-95 cursor-pointer"
                      >
                        ADD TO CART
                      </button>
                      <span className="text-[10px] font-mono text-cyan-400 animate-pulse">
                        ● LIMITED RELEASE - ONLY 18 LEFT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Animated vinyl platter visual mock */}
                <div className="flex items-center justify-center p-8 relative">
                  <div className="w-48 h-48 rounded-full bg-slate-900 border-4 border-black shadow-2xl flex items-center justify-center relative group animate-[spin_12s_linear_infinite]">
                    {/* Ring decals */}
                    <div className="absolute inset-4 rounded-full border border-gray-800" />
                    <div className="absolute inset-8 rounded-full border border-gray-800/60" />
                    <div className="absolute inset-12 rounded-full border border-gray-800/30" />
                    {/* Center Balatro custom vinyl label */}
                    <div className="w-14 h-14 rounded-full bg-[#DE443B] border border-black flex items-center justify-center text-black font-pixel text-[8px] font-bold select-none shadow-inner">
                      DECK-B
                    </div>
                  </div>
                </div>

              </div>

              {/* Product 2: Balatro Joker Hoodie - Bento vertical tower */}
              <div className="md:col-span-4 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="bg-rose-950 text-rose-400 border border-rose-800/40 text-[8px] font-pixel px-2 py-0.5 rounded-xs uppercase">
                      CLOTHING HOODIE
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">IN STOCK</span>
                  </div>

                  <h3 className="text-xl font-pixel uppercase tracking-tight text-white">
                    JOKER LOGO SLEEVE HOODIE
                  </h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Heavy knitted loopback cotton hoodie with glowing, screen-printed psychedelic colors down both sleeves.
                  </p>

                  {/* Size buttons */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-pixel text-gray-500 uppercase block">SELECT DECK SIZE:</span>
                    <div className="flex gap-1.5 font-mono text-xs">
                      {["SM", "MD", "LG", "XL", "XXL"].map((sz) => (
                        <button
                          key={sz}
                          onClick={() => { setSelectedShopSize(sz); triggerTone(260); }}
                          className={`w-10 h-8 rounded border transition-colors ${
                            selectedShopSize === sz
                              ? "bg-[#DE443B]/20 border-[#DE443B] text-white"
                              : "bg-black/40 border-[#1A262C] text-gray-500 hover:text-gray-200"
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <div className="text-xl text-white font-mono font-bold">$64.00</div>
                  <button
                    onClick={() => {
                      setShopBagCount(shopBagCount + 1);
                      triggerTone(700, "sine", 0.1);
                    }}
                    className="w-full bg-[#DE443B] hover:bg-red-500 text-black font-pixel text-[10px] py-3 rounded font-bold uppercase transition-transform active:scale-95 cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                </div>

              </div>

              {/* Product 3: Holographic physical cards - Bento medium */}
              <div className="md:col-span-6 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-amber-950 text-amber-500 border border-amber-800/40 text-[8px] font-pixel px-2 py-0.5 rounded-xs uppercase">
                      CRAFT DECK
                    </span>
                    <span className="text-[10px] font-mono text-[#F4D03F]">LAST CALL</span>
                  </div>

                  <h3 className="text-xl font-pixel uppercase tracking-tight text-white">
                    Holographic Playing Cards
                  </h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Custom physical poker card set. Features foil embossed Joker cards with dynamic color shifting backings that reflect real light.
                  </p>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="flex justify-between items-baseline font-mono border-b border-[#1A262C] pb-3">
                    <span className="text-lg text-[#F4D03F] font-bold">$24.00</span>
                    <span className="text-[10px] text-gray-500">PACK OF 54 CARDS</span>
                  </div>
                  <button
                    onClick={() => {
                      setShopBagCount(shopBagCount + 1);
                      triggerTone(700, "sine", 0.1);
                    }}
                    className="w-full bg-transparent hover:bg-amber-600/10 hover:text-white text-amber-400 border border-amber-500/40 hover:border-amber-500 font-pixel text-[10px] py-3 rounded font-bold uppercase transition-all cursor-pointer"
                  >
                    SECURE DECK PACK
                  </button>
                </div>

              </div>

              {/* Product 4: Collector Poker Chips - Bento medium */}
              <div className="md:col-span-6 bg-[#0C1416]/50 rounded-2xl border border-[#1A262C] p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-purple-950 text-purple-400 border border-purple-800/40 text-[8px] font-pixel px-2 py-0.5 rounded-xs uppercase">
                      HEAVY CLAY
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">RESTOCKED</span>
                  </div>

                  <h3 className="text-xl font-pixel uppercase tracking-tight text-white">
                    Heavy Clay Poker Chips Set
                  </h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    Weighty 14g clay poker chips featuring high quality heat-transfer Balatro artwork decals. Includes carrying sleeve container.
                  </p>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="flex justify-between items-baseline font-mono border-b border-[#1A262C] pb-3">
                    <span className="text-lg text-purple-400 font-bold">$119.00</span>
                    <span className="text-[10px] text-gray-500">SET OF 250 CHIPS</span>
                  </div>
                  <button
                    onClick={() => {
                      setShopBagCount(shopBagCount + 1);
                      triggerTone(700, "sine", 0.1);
                    }}
                    className="w-full bg-transparent hover:bg-purple-600/10 hover:text-white text-purple-400 border border-purple-500/40 hover:border-purple-500 font-pixel text-[10px] py-3 rounded font-bold uppercase transition-all cursor-pointer"
                  >
                    SECURE CHIPS BOX
                  </button>
                </div>

              </div>

            </div>

            {/* Shopping Bag telemetry status notifier */}
            {shopBagCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#DE443B] text-black p-4 rounded-xl flex items-center justify-between font-pixel text-xs font-bold shadow-[0_5px_15px_rgba(222,68,59,0.3)]"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span>TOTAL CODES PREPARED FOR CHECKOUT: {shopBagCount} ITEMS</span>
                </div>
                <button
                  onClick={() => {
                    setShopBagCount(0);
                    triggerTone(300, "triangle", 0.15);
                  }}
                  className="bg-black/95 hover:bg-black text-white px-4 py-2 rounded text-[10px] tracking-wide font-pixel transition-colors cursor-pointer"
                >
                  SECURE TRANSACTIONS
                </button>
              </motion.div>
            )}

          </div>
        )}

      </main>

      {/* FOOTER - HUD style elegant grid */}
      <footer className="border-t border-[#1A262C] bg-[#070B0C] py-16 px-4 md:px-8 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#DE443B] flex items-center justify-center font-pixel text-black text-xs font-bold">
                B
              </div>
              <span className="text-xs font-pixel text-white uppercase tracking-wider">BALATRO Redux</span>
            </div>
            <p className="text-xs text-gray-500 font-sans leading-relaxed max-w-sm">
              Balatro Redesigned is an immersive Awwwards-style fansite mockup and gaming cockpit recreation. Inspired by the tactical roguelike poker deckbuilder developed by LocalThunk.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 font-mono text-[11px]">
            <span className="font-pixel text-[9px] text-[#DE443B] block uppercase tracking-wider">REPLICATED CODES</span>
            <ul className="space-y-1.5 text-gray-500">
              <li><span className="text-gray-600">v_rev:</span> REDELUXE_v2.1</li>
              <li><span className="text-gray-600">renderer:</span> WEBGL_SHADERS</li>
              <li><span className="text-gray-600">motion:</span> REACT_SPRING_GSAP</li>
              <li><span className="text-gray-600">engine:</span> BALATRO_PXS</li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3 font-mono text-[11px] md:text-right md:items-end flex flex-col">
            <span className="font-pixel text-[9px] text-[#12C2E9] block uppercase tracking-wider">LEGAL CREDITS</span>
            <div className="text-gray-500 space-y-1">
              <p>© 2026 playbalatro Redesigned.</p>
              <p>Designed with retro cyberpunk psychedelia.</p>
              <div className="flex gap-3 justify-start md:justify-end text-[10px] pt-1">
                <a href="https://playbalatro.com" target="_blank" rel="noreferrer" className="text-[#DE443B] hover:underline">OFFICIAL SITE</a>
                <span className="text-gray-700">|</span>
                <a href="https://store.steampowered.com/app/2379780/Balatro/" target="_blank" rel="noreferrer" className="text-[#12C2E9] hover:underline">STEAM PAGE</a>
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-[#1A262C]/50 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-600 font-mono text-[10px]">
          <div>LOCALTHUNK BRANDING LICENSED SIMULATION ONLY. NO MONEY EXCHANGED.</div>
          <div className="flex gap-4">
            <span>PING: 14MS</span>
            <span>CONN: SECURE_WSS</span>
            <span>SYSTEM_NODE: CLOUD_RUN_CONTAINER</span>
          </div>
        </div>
      </footer>
    </div>
  );

  // Helper action: restore sandbox presets
  function reinitalizeSandbox() {
    setSlottedJokers([
      JOKERS_DATA[1], // Blueprint (Rare)
      JOKERS_DATA[2], // Baron (Rare)
      JOKERS_DATA[5], // Yorick (Legendary)
    ]);
    setSelectedHandType("Straight Flush");
    setHandLevel(5);
    setTotalCalculatedScore(0);
    triggerTone(440, "square", 0.08, 0.03);
  }
}
