"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function RequireAuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(192,255,0,0.15)]">
                <Lock size={28} className="text-accent" />
              </div>
              <h2 className="text-2xl font-black text-white mb-3">Create your personal HomeFit plan</h2>
              <p className="text-sm text-muted mb-8 leading-relaxed">
                Sign in or create a free account to save your preferences, track progress, and receive personalized diet and workout recommendations.
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full py-3.5 bg-accent text-black font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  Create account <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="w-full py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                >
                  Sign in
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-sm font-semibold text-muted hover:text-white transition-colors mt-2"
                >
                  Continue browsing
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RequireAuth({
  children,
  onProtectedAction,
  isGuest,
}: {
  children: React.ReactNode;
  onProtectedAction?: () => void;
  isGuest: boolean;
}) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (isGuest) {
      e.preventDefault();
      e.stopPropagation();
      setShowModal(true);
    } else if (onProtectedAction) {
      onProtectedAction();
    }
  };

  return (
    <>
      <div onClick={handleClick} className="contents">
        {children}
      </div>
      <RequireAuthModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
