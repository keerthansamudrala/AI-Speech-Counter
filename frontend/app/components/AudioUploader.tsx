"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Upload, FileAudio, Play, Pause, Trash2, CloudUpload } from "lucide-react";

export default function AudioUploader({ onAnalysisComplete }: { onAnalysisComplete?: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState<"record" | "upload">("record");
  // recording State
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio handling refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // File drag & drop
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    // Cleanup URL on unmount
    return () => {
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setUploadStatus(null);
    } catch (error) {
      console.error("Error accessing microphone", error);
      alert("Could not access microphone. Please allow microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const clearAudio = () => {
    setAudioBlob(null);
    setIsPlaying(false);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
    }
    setUploadStatus(null);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleUpload = async () => {
    if (!audioBlob) return;
    setIsUploading(true);
    setUploadStatus("Uploading...");

    const formData = new FormData();
    const extension = audioBlob.type.includes("wav") ? "wav" : audioBlob.type.includes("mp3") ? "mp3" : "webm";
    formData.append("file", audioBlob, `audio.${extension}`);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => null);
      if (response.ok) {
        setUploadStatus("Success! Audio uploaded successfully.");
        if (onAnalysisComplete && data) {
          setTimeout(() => onAnalysisComplete(data), 1000); // Slight delay for UX
        }
      } else {
        setUploadStatus("Failed to upload: " + (data?.detail || "Unknown error"));
      }
    } catch (error) {
      setUploadStatus("Error: Could not reach the server.");
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("audio/")) {
        setAudioBlob(file);
        const url = URL.createObjectURL(file);
        setAudioURL(url);
        setUploadStatus(null);
        setIsPlaying(false);
      } else {
        alert("Please drop a valid audio file.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAudioBlob(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      setUploadStatus(null);
      setIsPlaying(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] text-white relative overflow-hidden">
      {/* Background glow effects inside the card */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none rounded-3xl">
        <div className="absolute -top-[30%] -right-[20%] w-64 h-64 bg-pink-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
        <div className="absolute -bottom-[30%] -left-[20%] w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl opacity-50 mix-blend-screen"></div>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-black/30 rounded-full p-1 mb-8 shadow-inner">
        <button
          onClick={() => { setActiveTab("record"); !isRecording && setAudioBlob(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${activeTab === 'record' ? 'bg-white text-indigo-900 shadow-[0_4px_15px_rgba(255,255,255,0.3)] scale-[1.02]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
        >
          <Mic size={18} /> Record
        </button>
        <button
          onClick={() => { setActiveTab("upload"); !isRecording && setAudioBlob(null); }}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-sm font-semibold transition-all duration-300 ease-out ${activeTab === 'upload' ? 'bg-white text-indigo-900 shadow-[0_4px_15px_rgba(255,255,255,0.3)] scale-[1.02]' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
        >
          <Upload size={18} /> Upload
        </button>
      </div>

      <div className="min-h-[280px] flex flex-col items-center justify-center transition-all duration-500">
        {!audioBlob ? (
          activeTab === "record" ? (
            <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-300">
              {/* Waveform Visualization when recording */}
              <div className="h-28 w-full flex items-center justify-center gap-1.5 mb-8">
                {isRecording ? (
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    {[...Array(24)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 md:w-2 bg-gradient-to-t from-pink-400 via-purple-300 to-indigo-400 rounded-full animate-wave"
                        style={{
                          height: `${15 + Math.random() * 85}%`,
                          animationDelay: `${i * 0.05}s`,
                          animationDuration: `${0.4 + Math.random() * 0.4}s`
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white/50 text-sm font-medium gap-3">
                    {/* Subtle placeholder waveform for aesthetics */}
                    <div className="flex items-center gap-1.5 opacity-30 cursor-pointer" onClick={toggleRecording}>
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className="w-1.5 h-3 bg-white rounded-full" />
                      ))}
                    </div>
                    <p>Ready to start.</p>
                  </div>
                )}
              </div>

              <div className="relative">
                {/* Outer pulse ring for record button */}
                {isRecording && (
                  <div className="absolute inset-0 rounded-full bg-pink-500/40 animate-ping" style={{ animationDuration: '2s' }}></div>
                )}

                <button
                  onClick={toggleRecording}
                  className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.7)] scale-95 hover:bg-red-600' : 'bg-gradient-to-tr from-pink-500 to-purple-600 shadow-[0_15px_35px_rgba(219,39,119,0.5)] hover:scale-105 hover:shadow-[0_20px_40px_rgba(219,39,119,0.7)] hover:-translate-y-1'}`}
                >
                  {isRecording ? <Square size={36} className="text-white" fill="currentColor" /> : <Mic size={42} className="text-white" />}
                </button>
              </div>

              <div className="mt-6 text-sm font-bold tracking-wide uppercase text-white/90">
                {isRecording ? <span className="text-pink-300 animate-pulse">Recording... Tap to Stop</span> : "Tap to Record"}
              </div>
            </div>
          ) : (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-3xl transition-all duration-300 bg-white/5 backdrop-blur-sm animate-in fade-in zoom-in duration-300 ${isDragging ? 'border-cyan-400 bg-cyan-400/20 scale-[1.02] shadow-[0_0_30px_rgba(6,182,212,0.3)]' : 'border-white/30 hover:border-white/60 hover:bg-white/10'}`}
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${isDragging ? 'bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.6)] text-white' : 'bg-white/10 text-cyan-300'}`}>
                <CloudUpload size={36} className={isDragging ? "animate-bounce" : ""} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Drag & Drop</h3>
              <p className="text-sm text-white/60 mb-8 text-center font-medium">Support for MP3, WAV, WEBM, M4A audio formats</p>

              <input
                type="file"
                id="file-upload"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file-upload"
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full font-bold text-sm cursor-pointer shadow-[0_10px_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_15px_30px_rgba(6,182,212,0.6)] active:scale-95"
              >
                Browse Files
              </label>
            </div>
          )
        ) : (
          <div className="flex flex-col w-full animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.5)] border-2 border-white/20">
                <FileAudio size={28} className="text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Audio Prepared</h3>
              <p className="text-xs text-white/60 mt-1 font-medium">Ready for upload</p>
            </div>

            <audio
              ref={audioRef}
              src={audioURL!}
              className="hidden"
              onEnded={() => setIsPlaying(false)}
            />

            <div className="bg-black/30 backdrop-blur border border-white/10 p-5 rounded-2xl flex items-center gap-5 mb-8 shadow-inner">
              <button
                onClick={togglePlayback}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${isPlaying ? 'bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>

              <div className="flex-1 w-full">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full relative mb-3">
                  {isPlaying ? (
                    <div className="absolute top-0 left-0 h-full w-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)] animate-[moveRight_1.5s_infinite]" />
                  ) : (
                    <div className="w-0 h-full" />
                  )}
                  <div className={`absolute top-0 left-0 h-full w-full bg-gradient-to-r from-cyan-400 to-purple-500 ${isPlaying ? 'opacity-100' : 'opacity-40'}`} style={{ width: isPlaying ? '100%' : '100%' }} />
                </div>
                <div className="flex justify-between text-xs font-medium text-white/50 px-1">
                  <span>Audio Preview</span>
                  <span>{(audioBlob.size / 1024).toFixed(1)} KB</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearAudio}
                disabled={isUploading}
                className="flex-1 py-3.5 px-4 rounded-full font-bold text-sm bg-white/5 border border-white/20 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Trash2 size={18} /> Discard
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-[2] py-3.5 px-4 rounded-full font-bold text-sm bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:shadow-[0_10px_25px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale hover:scale-105 active:scale-95"
              >
                {isUploading ? (
                  <span className="flex items-center gap-2.5">
                    <svg className="animate-spin -ml-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading...
                  </span>
                ) : (
                  <>
                    <CloudUpload size={20} /> Upload to Server
                  </>
                )}
              </button>
            </div>

            {uploadStatus && (
              <div className={`mt-5 p-3.5 rounded-2xl text-sm font-bold text-center border animate-in fade-in slide-in-from-top-2 ${uploadStatus.includes('Success') ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}>
                {uploadStatus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
