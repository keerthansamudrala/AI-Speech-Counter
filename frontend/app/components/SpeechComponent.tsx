"use client";

import React, { useEffect, useState } from "react";

interface SpeechResult {
  info: string;
  transcript: string;
  filler_count: number;
  total_words: number;
  filename: string;
}

const AnimatedCounter = ({ value, label, highlightClass }: { value: number, label: string, highlightClass?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500; // 1.5s
    const incrementTime = 30; // ms
    const steps = duration / incrementTime;
    
    // Ensure increment value is at least a minimum fraction so we make progress
    const incrementValue = (value / steps) || 1;

    if (value === 0) {
      setCount(0);
      return;
    }

    const timer = setInterval(() => {
      start += incrementValue;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-full border border-white/20 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-48 h-48 md:w-56 md:h-56 transition-all hover:scale-105 hover:bg-white/10">
      <span className={`text-6xl md:text-7xl font-black drop-shadow-md mb-2 ${highlightClass || 'text-white'}`}>
        {count}
      </span>
      <span className="text-white/80 text-sm md:text-base font-bold uppercase tracking-widest text-center">
        {label}
      </span>
    </div>
  );
};

export default function SpeechComponent({ result, onReset }: { result: SpeechResult, onReset: () => void }) {
  if (!result) return null;

  return (
    <div className="w-full max-w-4xl mx-auto p-8 md:p-12 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.3)] text-white relative overflow-hidden animate-in zoom-in-95 fade-in duration-700 ease-out">
      
      {/* Background glow effects inside the card */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none rounded-[2.5rem]">
        <div className="absolute -top-[30%] -right-[10%] w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[100px] opacity-60 mix-blend-screen"></div>
        <div className="absolute -bottom-[30%] -left-[10%] w-[30rem] h-[30rem] bg-pink-500/20 rounded-full blur-[100px] opacity-60 mix-blend-screen"></div>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-indigo-300 to-purple-400 inline-block drop-shadow-sm">
          {result.info}
        </h2>
      </div>

      {/* Counters Section (Middle Top) */}
      <div className="flex flex-row justify-center items-center gap-6 md:gap-12 mb-12">
        <AnimatedCounter 
          value={result.total_words} 
          label="Total Words" 
          highlightClass="text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-blue-500" 
        />
        <AnimatedCounter 
          value={result.filler_count} 
          label="Filler Words" 
          highlightClass="text-transparent bg-clip-text bg-gradient-to-b from-pink-400 to-rose-600" 
        />
      </div>

      {/* Transcript Section (Middle Down) */}
      <div className="bg-black/30 p-6 md:p-10 rounded-3xl border border-white/10 shadow-inner w-full flex flex-col items-center">
        <h3 className="text-sm font-bold text-indigo-300/80 mb-6 uppercase tracking-[0.2em] w-full text-center">Transcript Details</h3>
        <p className="text-lg md:text-2xl leading-relaxed md:leading-loose text-white/95 font-medium bg-white/5 p-6 md:p-8 rounded-2xl border border-white/5 mx-auto max-h-[400px] overflow-y-auto w-full text-center shadow-sm">
          {result.transcript ? result.transcript : "No transcript available."}
        </p>
      </div>

      <div className="mt-12 flex justify-center">
        <button 
          onClick={onReset}
          className="px-10 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-[0_10px_25px_rgba(99,102,241,0.4)] border border-white/20 rounded-full font-bold text-base md:text-lg transition-all hover:scale-[1.03] hover:-translate-y-1 active:scale-95 text-white"
        >
          Analyze Another Speech
        </button>
      </div>
    </div>
  );
}
