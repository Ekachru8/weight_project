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
  const hasPlayableVideo = ex.videoStatus === "ready" && Boolean(ex.videoUrl) && ex.videoUrl!.trim() !== "";
  const hasMatchingAudio = ex.audioStatus === "ready" && Boolean(ex.audioUrl) && ex.audioUrl!.trim() !== "";

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
          className="w-full max-w-[860px] max-h-[92vh] md:max-h-[84vh] bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl relative"
        >
          {/* Compact Sticky Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-20">
            <div>
              <h2 className="text-xl font-extrabold text-white">{ex.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded">{ex.category}</span>
                {ex.difficulty && <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/10 px-2 py-0.5 rounded">{ex.difficulty}</span>}
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
            
            {/* Exercise Photo */}
            <div className="w-full h-[240px] md:h-[320px] bg-[#050505] relative border-b border-white/5 flex items-center justify-center overflow-hidden">
              {ex.photoUrl ? (
                <img 
                  src={ex.photoUrl} 
                  alt={ex.photoAlt || ex.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    e.currentTarget.parentElement?.querySelector('span')?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-sm font-bold text-muted uppercase tracking-widest ${ex.photoUrl ? 'hidden' : ''}`}>Exercise image coming soon</span>
            </div>

            <div className="p-6 md:p-8 space-y-8">
            
            {/* Audio Form-Guidance Panel */}
            {hasMatchingAudio ? (
              <div className="glass-card p-6 border-accent/20 bg-accent/5 rounded-xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        if (audioRef.current) {
                          if (isPlayingAudio) audioRef.current.pause();
                          else audioRef.current.play();
                          setIsPlayingAudio(!isPlayingAudio);
                        }
                      }}
                      className="w-14 h-14 rounded-full accent-gradient flex items-center justify-center text-black shadow-lg shadow-accent/20 hover:brightness-110 transition-all shrink-0"
                      aria-label={isPlayingAudio ? "Pause guidance" : "Listen to guidance"}
                    >
                      {isPlayingAudio ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    <div>
                      <h3 className="font-black text-white text-lg">Form Guidance</h3>
                      <p className="text-xs text-muted">AI Voice Coach</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = 0;
                          audioRef.current.play();
                          setIsPlayingAudio(true);
                        }
                      }}
                      className="text-xs font-bold bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-white/80"
                    >
                      Replay
                    </button>
                    <button 
                      onClick={() => setIsVideoMuted(!isVideoMuted)}
                      className="text-xs font-bold bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-colors text-white/80"
                      aria-label="Mute"
                    >
                      {isVideoMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                    <select 
                      onChange={(e) => {
                        if (audioRef.current) audioRef.current.playbackRate = parseFloat(e.target.value);
                      }}
                      className="bg-black/50 text-xs font-bold text-white/80 border border-white/10 rounded-lg px-2 py-1.5"
                    >
                      <option value="0.75">0.75x</option>
                      <option value="1" selected>1x</option>
                      <option value="1.25">1.25x</option>
                    </select>
                  </div>
                </div>

                <div 
                  className="mt-2 h-2 bg-black/40 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    if (audioRef.current) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentage = x / rect.width;
                      audioRef.current.currentTime = percentage * audioRef.current.duration;
                      setAudioProgress(percentage * 100);
                    }
                  }}
                >
                  <div className="h-full bg-accent rounded-full transition-all duration-100 ease-linear" style={{ width: `${audioProgress}%` }} />
                </div>
                
                <audio 
                  ref={audioRef}
                  src={ex.audioUrl || undefined}
                  preload="metadata"
                  muted={isVideoMuted}
                  onError={(e) => {
                    console.error("Exercise audio playback failed", { exerciseSlug: ex.slug, error: e });
                    // Inform the user or fallback. (We could set a local error state).
                  }}
                  onEnded={() => {
                    setIsPlayingAudio(false);
                    setAudioProgress(0);
                  }}
                  onTimeUpdate={(e) => {
                    const target = e.target as HTMLAudioElement;
                    if (target.duration) {
                      setAudioProgress((target.currentTime / target.duration) * 100);
                    }
                  }}
                />
              </div>
            ) : ex.audioStatus === "generating" || ex.audioStatus === "queued" ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-accent" size={24} />
                <span className="text-sm font-bold text-muted">Preparing form guidance...</span>
              </div>
            ) : (
              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-6 flex items-center gap-3">
                <AlertTriangle className="text-red-400/50" size={24} />
                <span className="text-sm font-bold text-muted">Audio guidance unavailable</span>
              </div>
            )}

            {/* How to perform it */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4">How to perform it</h3>
              <div className="space-y-4">
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

            <div className="grid md:grid-cols-2 gap-8">
              {/* Form cues & Mistakes */}
              <div className="space-y-8">
                {ex.formCues?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3">Form cues</h3>
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
                    <h3 className="text-lg font-bold text-white mb-3">Common mistakes</h3>
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
              </div>
              
              {/* Metadata & Progress */}
              <div className="space-y-6">
                <div className="glass-card p-5 border-white/5 rounded-xl space-y-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Muscles Worked</span>
                    <div className="flex flex-wrap gap-2">
                      {ex.targetMuscles?.map((m, i) => (
                        <span key={i} className="text-xs font-medium bg-white/5 text-white px-2.5 py-1 rounded-md border border-white/10">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-muted mb-1">Sets, Reps, and Rest</span>
                    <span className="text-sm font-medium text-white">{ex.defaultSets || 3} sets of {ex.defaultReps || "10-12 reps"}. Rest 60s.</span>
                  </div>
                </div>

                {ex.safetyTips?.length > 0 && (
                  <div className="bg-yellow-400/5 border border-yellow-400/20 p-4 rounded-xl flex gap-3 items-start">
                    <Info className="text-yellow-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-bold text-yellow-400 text-sm mb-1">Safety Note</h4>
                      <p className="text-sm text-yellow-400/80">{ex.safetyTips[0]}</p>
                    </div>
                  </div>
                )}

                {markCompleted && (
                  <button 
                    onClick={markCompleted}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                      isCompleted 
                        ? 'bg-white/10 text-white border border-white/20' 
                        : 'bg-accent text-black hover:brightness-110'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 size={18} /> : null}
                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                  </button>
                )}
              </div>
            </div>

            {/* Expandable Transcript */}
            {ex.transcript && (
              <div className="pt-6 border-t border-white/5">
                <button 
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-2 text-sm font-bold text-accent hover:text-white transition-colors uppercase tracking-widest"
                >
                  <FileText size={16} />
                  {showTranscript ? "Hide Transcript" : "Show Transcript"}
                </button>
                <AnimatePresence>
                  {showTranscript && (
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
              </div>
            )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
