import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { Hexagon } from 'lucide-react';

/**
 * Fonts: this component assumes 'Noto Sans Devanagari', 'Fraunces' and
 * 'JetBrains Mono' are available globally (load them once in your root
 * <head> / _document / index.html — not per-component):
 *
 * <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+Devanagari:wght@600;700;900&display=swap" rel="stylesheet">
 */

const TICKER_ITEMS = [
  { label: 'NIFTY 24,812', dir: 'up', delta: '0.62%' },
  { label: 'SENSEX 81,004', dir: 'down', delta: '0.14%' },
  { label: 'GOLD ₹71,230/10g', dir: 'up', delta: '0.31%' },
  { label: 'RELIANCE', dir: 'up', delta: '1.20%' },
  { label: 'USD/INR 83.41', dir: 'down', delta: '0.05%' },
];

function TickerStrip() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative z-30 w-full max-w-xl overflow-hidden rounded-full border border-amber-100/10 bg-white/[0.02] backdrop-blur-md px-1 py-2.5">
      <div className="flex w-max animate-[ticker_22s_linear_infinite] gap-8 font-mono text-[11px] tracking-wide text-slate-400 whitespace-nowrap">
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-1.5 px-2">
            {it.label}
            <span className={it.dir === 'up' ? 'text-emerald-400' : 'text-rose-400'}>
              {it.dir === 'up' ? '▲' : '▼'} {it.delta}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const shakeControls = useAnimation();

  return (
    <motion.div
      animate={shakeControls}
      className="relative h-screen w-full bg-[#05070a] overflow-hidden flex flex-col items-center justify-center font-sans"
    >
      {/* local keyframes for the shine sweep + ticker scroll */}
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes shine { 0% { left: -60%; } 45% { left: 130%; } 100% { left: 130%; } }
        @keyframes pulseGold {
          0%, 100% { box-shadow: 0 0 0 0 rgba(212,175,90,0.35), 0 12px 28px -8px rgba(212,175,90,0.4); }
          50% { box-shadow: 0 0 0 8px rgba(212,175,90,0), 0 12px 28px -8px rgba(212,175,90,0.4); }
        }
      `}</style>

      {/* Ambient glow, engineering grid, vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_900px_500px_at_50%_6%,rgba(212,175,90,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_800px_600px_at_92%_88%,rgba(212,175,90,0.07),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_700px_500px_at_6%_85%,rgba(16,185,129,0.05),transparent_60%)]" />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:48px_48px]"
        style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 90%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 30%, transparent 90%)' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.55)_100%)]" />

      {/* Main Foreground Container */}
      <div className="relative z-10 w-full max-w-6xl h-full flex flex-col items-center justify-center px-6">

        {/* Brand Logo - Top */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="absolute top-14 flex items-center gap-3"
        >
          <Hexagon className="w-6 h-6 text-amber-300/90 stroke-[2]" />
          <div className="h-5 w-px bg-slate-700" />
          <span
            className="text-2xl md:text-3xl tracking-wide pb-1 bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 bg-clip-text text-transparent"
            style={{ fontFamily: "'Noto Sans Devanagari', 'Fraunces', system-ui", fontWeight: 800 }}
          >
            धन दृष्टि
          </span>
        </motion.div>

        {/* Eyebrow label — sets a terminal / professional tone */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="absolute top-28 font-mono text-[10px] tracking-[0.35em] uppercase text-amber-200/60"
        >
          Personal Wealth Terminal
        </motion.p>


        {/* Ticker strip, above the CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
          className="absolute bottom-[15%] flex justify-center w-full"
        >
          <TickerStrip />
        </motion.div>

        {/* Center Portal: 'Let's Dive' Button */}
        <motion.button
          onClick={onEnter}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { delay: 1.8, duration: 0.5 }, scale: { delay: 1.8, duration: 0.5, type: 'spring' } }}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.97 }}
          style={{ animation: 'pulseGold 2.8s ease-in-out 2.3s infinite' }}
          className="relative z-30 px-11 py-4 rounded-full font-semibold text-sm tracking-[0.25em] uppercase text-[#3a2c0f] border border-amber-100/60 overflow-hidden bg-gradient-to-b from-[#fff6e0] via-[#f2d391] to-[#cf9e4d] shadow-xl"
        >
          <span className="relative z-10">Let's Dive →</span>
          <span
            className="absolute top-[-40%] h-[180%] w-[35%] bg-gradient-to-r from-transparent via-white/70 to-transparent rotate-[20deg]"
            style={{ animation: 'shine 3.4s ease-in-out 2.4s infinite', left: '-60%' }}
          />
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="absolute bottom-[9%] font-mono text-[11px] tracking-wide text-slate-500"
        >
          No card. No jargon. Just your money, moving.
        </motion.p>
      </div>
    </motion.div>
  );
}