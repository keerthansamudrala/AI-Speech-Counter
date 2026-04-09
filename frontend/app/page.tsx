"use client";
import { useState } from "react";
import AudioUploader from "./components/AudioUploader";
import SpeechComponent from "./components/SpeechComponent";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 font-sans px-4 relative overflow-y-auto pt-16 pb-16">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-fuchsia-500/20 via-transparent to-transparent opacity-60 pointer-events-none fixed"></div>
      <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-500/20 via-transparent to-transparent opacity-60 pointer-events-none fixed"></div>

      {!analysisResult && (
        <div className="text-center mb-12 z-10 animate-in fade-in slide-in-from-top-6 duration-700">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl">
            AI Speech <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-indigo-400">Counter</span>
          </h1>
        </div>
      )}

      <div className="w-full z-10 flex flex-col items-center">
        {analysisResult ? (
          <SpeechComponent 
            result={analysisResult} 
            onReset={() => setAnalysisResult(null)} 
          />
        ) : (
          <AudioUploader 
            onAnalysisComplete={(data) => setAnalysisResult(data)} 
          />
        )}
      </div>
    </main>
  );
}