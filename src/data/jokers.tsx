import { ReactNode } from "react";
import { JokerData } from "../components/JokerCard";

export const JOKERS_DATA: JokerData[] = [
  {
    id: "gros-michel",
    name: "Gros Michel",
    rarity: "Common",
    multiplier: "+15 Mult",
    chips: "N/A",
    description: "+15 Mult. 1 in 6 chance this card is destroyed at the end of round, leaving a sweet Cavendish legacy.",
    technicalCode: "XML_JOK_GROS_MICHEL_V1",
    synergyClass: "Extinction Buff",
    baseWinRate: 58,
    comboPotential: 5,
    artStyle: {
      bg: "bg-radial from-amber-600/30 to-zinc-950",
      glow: "from-amber-600 via-yellow-500 to-transparent",
      accent: "text-amber-400",
      symbol: "🍌"
    }
  },
  {
    id: "blueprint",
    name: "The Blueprint",
    rarity: "Rare",
    multiplier: "Ability Copy",
    chips: "N/A",
    description: "Copies the ability of any Joker placed directly to its right. The holy grail of custom synergy building.",
    technicalCode: "XML_JOK_BLUEPRINT_R",
    synergyClass: "Infinite Recursion",
    baseWinRate: 94,
    comboPotential: 10,
    artStyle: {
      bg: "bg-radial from-cyan-600/30 to-zinc-950",
      glow: "from-cyan-600 via-blue-500 to-transparent",
      accent: "text-cyan-400",
      symbol: "📐"
    }
  },
  {
    id: "gallow-joker",
    name: "Baron",
    rarity: "Rare",
    multiplier: "x1.5 Mult",
    chips: "N/A",
    description: "Each King held in hand gives x1.5 Mult. Multiplies exponentially when combined with re-triggering helper hands.",
    technicalCode: "XML_JOK_BARON_ROYAL",
    synergyClass: "Aristocratic Scale",
    baseWinRate: 88,
    comboPotential: 9,
    artStyle: {
      bg: "bg-radial from-rose-600/30 to-zinc-950",
      glow: "from-rose-600 via-[#DE443B] to-transparent",
      accent: "text-rose-500",
      symbol: "👑"
    }
  },
  {
    id: "mime",
    name: "Mime",
    rarity: "Uncommon",
    multiplier: "Retrigger x1",
    chips: "N/A",
    description: "Retriggers all card abilities and scoring effects that occur from cards held in your hand.",
    technicalCode: "XML_JOK_MIME_RETRIG",
    synergyClass: "Double Trigger",
    baseWinRate: 72,
    comboPotential: 8,
    artStyle: {
      bg: "bg-radial from-slate-600/30 to-zinc-950",
      glow: "from-white/20 via-slate-500/25 to-transparent",
      accent: "text-gray-300",
      symbol: "🎭"
    }
  },
  {
    id: "abstract",
    name: "Abstract Joker",
    rarity: "Common",
    multiplier: "+3 Mult / Card",
    chips: "+30 Chips",
    description: "Provides +3 Mult for every single items currently in your Joker layout. Great general-purpose scaling.",
    technicalCode: "XML_JOK_ABSTRACT_V3",
    synergyClass: "Linear Accumulation",
    baseWinRate: 64,
    comboPotential: 6,
    artStyle: {
      bg: "bg-radial from-purple-600/30 to-zinc-950",
      glow: "from-purple-600 via-pink-500 to-transparent",
      accent: "text-purple-400",
      symbol: "🎨"
    }
  },
  {
    id: "cerebral",
    name: "Yorick",
    rarity: "Legendary",
    multiplier: "x5 Mult Max",
    chips: "+100 Chips",
    description: "Each blind beaten since obtaining Yorick grants x1 Mult (caps at x5 Mult). Pure legendary multiplier power.",
    technicalCode: "XML_JOK_LEG_YORICK_X5",
    synergyClass: "Legendary Hyper-Scale",
    baseWinRate: 98,
    comboPotential: 10,
    artStyle: {
      bg: "bg-radial from-yellow-600/30 to-zinc-950",
      glow: "from-amber-500 via-rose-500 to-transparent",
      accent: "text-yellow-400",
      symbol: "💀"
    }
  }
];
