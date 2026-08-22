"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Play, Pause, Loader2, Volume2, VolumeX, Activity, AlertTriangle, FileText, CheckCircle2, Info
} from "lucide-react";
import type { Exercise } from "./ExerciseCard";

interface ExerciseModalProps {
  ex: Exercise | null;
  onClose: () => void;
  videoState: 'loading' | 'ready' | 'error';
  isPlayingAudio: boolean;
  setIsPlayingAudio: (val: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (val: boolean) => void;
  showTranscript: boolean;
  setShowTranscript: (val: boolean) => void;
  audioProgress: number;
  setAudioProgress: (val: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  markCompleted?: () => void;
  isCompleted?: boolean;
}

export function ExerciseModal({
  ex, onClose, videoState, isPlayingAudio, setIsPlayingAudio,
  isVideoMuted, setIsVideoMuted, showTranscript, setShowTranscript,
  audioProgress, setAudioProgress, audioRef, videoRef, markCompleted, isCompleted
}: ExerciseModalProps) {
  
  if (!ex) return null;
  const hasValidVideo = ex.videoUrl && ex.videoUrl.trim() !== "";

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-5xl max-h-[92vh] md:max-h-[88vh] bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Compact Sticky Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-20">
            <div>
              <h2 className="text-xl font-extrabold text-white">{ex.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">{ex.category}</span>
                <span className="text-xs text-muted font-medium">{ex.targetMuscles?.join(", ") || "Various muscles"}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            
            {/* Video Area */}
            <div className="w-full bg-black relative flex items-center justify-center overflow-hidden aspect-video max-h-[230px] md:max-h-[320px] border-b border-white/5">
              {videoState === 'loading' && (
                <div className="flex flex-col items-center justify-center absolute inset-0 bg-black/80 z-10">
                  <Loader2 className="animate-spin text-accent mb-2" size={24} />
                  <span className="text-xs font-medium text-muted uppercase tracking-widest">Preparing demonstration...</span>
                </div>
              )}
              {videoState === 'error' && (
                <div className="flex flex-col items-center justify-center absolute inset-0 bg-black/80 z-10 px-4 text-center">
                  <AlertTriangle className="text-red-400 mb-2" size={32} />
                  <span className="text-sm font-medium text-white mb-1">Demonstration unavailable</span>
                  <span className="text-xs text-muted max-w-sm">Written guidance is still available below.</span>
                </div>
              )}
              {hasValidVideo && (
                <>
                  <video 
                    ref={videoRef}
                    src={ex.videoUrl!}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    playsInline
                    muted={isVideoMuted}
                  />
                  <div className="absolute bottom-4 right-4 z-10">
                    <button 
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center border border-white/10 hover:bg-black/80 transition-colors"
                    >
                      {isVideoMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                  </div>
                </>
              )}
              {!hasValidVideo && videoState === 'ready' && (
                <div className="flex flex-col items-center justify-center absolute inset-0 bg-black/80 z-10">
                  <Activity className="text-muted/30 mb-2" size={48} />
                  <span className="text-sm font-medium text-muted uppercase tracking-widest">Demonstration unavailable</span>
                </div>
              )}
            </div>

            {/* Content Below Video */}
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
              
              {/* Left Column: Instructions */}
              <div className="md:col-span-2 space-y-8">
                
                {/* Audio Coaching Card */}
                {ex.voiceoverUrl && ex.status !== "unavailable" && (
                  <div className="glass-card p-5 border-accent/20 bg-accent/5 rounded-xl">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => {
                            if (audioRef.current) {
                              if (isPlayingAudio) audioRef.current.pause();
                              else audioRef.current.play();
                              setIsPlayingAudio(!isPlayingAudio);
                            }
                          }}
                          className="w-12 h-12 rounded-full accent-gradient flex items-center justify-center text-black shadow-lg shadow-accent/20 hover:brightness-110 transition-all shrink-0"
                        >
                          {isPlayingAudio ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                        </button>
                        <div>
                          <h3 className="font-bold text-white text-sm">Listen to form guidance</h3>
                          <p className="text-xs text-muted">AI-generated coaching cues</p>
                        </div>
                      </div>
                      
                      {ex.transcript && (
                        <button 
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-accent hover:text-white transition-colors"
                        >
                          <FileText size={14} /> 
                          {showTranscript ? "Hide Transcript" : "Read Transcript"}
                        </button>
                      )}
                    </div>

                    <div className="mt-4 h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${audioProgress}%` }} />
                    </div>

                    <AnimatePresence>
                      {showTranscript && ex.transcript && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-black/40 rounded-lg text-sm text-white/80 leading-relaxed border border-white/5">
                            {ex.transcript}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <audio 
                      ref={audioRef}
                      src={ex.voiceoverUrl}
                      onEnded={() => {
                        setIsPlayingAudio(false);
                        setAudioProgress(0);
                      }}
                      onTimeUpdate={(e) => {
                        const target = e.target as HTMLAudioElement;
                        setAudioProgress((target.currentTime / target.duration) * 100);
                      }}
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-white mb-4">How to perform it</h3>
                  <div className="space-y-3">
                    {ex.instructions?.length > 0 ? ex.instructions.map((step, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-muted shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">{step}</p>
                      </div>
                    )) : (
                      <p className="text-sm text-muted">Instructions coming soon.</p>
                    )}
                  </div>
                </div>

                {ex.formCues?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Form cues</h3>
                    <ul className="space-y-2">
                      {ex.formCues.map((cue, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-emerald-400/90 bg-emerald-400/5 p-3 rounded-lg border border-emerald-400/10">
                          <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ex.commonMistakes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4">Common mistakes to avoid</h3>
                    <ul className="space-y-2">
                      {ex.commonMistakes.map((mistake, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-red-400/90 bg-red-400/5 p-3 rounded-lg border border-red-400/10">
                          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ex.safetyTips?.length > 0 && (
                  <div className="bg-yellow-400/5 border border-yellow-400/20 p-4 rounded-xl flex gap-3 items-start">
                    <Info className="text-yellow-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-yellow-400 text-sm mb-1">Safety Note</h4>
                      <p className="text-sm text-yellow-400/80">{ex.safetyTips[0]}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Column: Metadata */}
              <div className="space-y-6">
                
                {markCompleted && (
                  <button 
                    onClick={markCompleted}
                    className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isCompleted 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'bg-accent text-black hover:brightness-110'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : <div className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin hidden" />}
                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                  </button>
                )}

                <div className="glass-card p-5 border-white/5 rounded-xl space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Target Muscles</span>
                    <div className="flex flex-wrap gap-2">
                      {ex.targetMuscles?.map((m, i) => (
                        <span key={i} className="text-xs font-medium bg-white/5 text-white px-2.5 py-1 rounded-md border border-white/10">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Equipment Needed</span>
                    <span className="text-sm font-medium text-white">{ex.equipment}</span>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Standard Prescription</span>
                    <span className="text-sm font-medium text-white">{ex.defaultSets || 3} sets of {ex.defaultReps || "10-12 reps"}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
