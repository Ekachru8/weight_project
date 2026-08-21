import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

export interface FitnessReadiness {
  fitnessLevel: string;
  mobilityLevel: string;
  difficultMovements: string[];
  healthNotes: string;
  intensityPreference: string;
  equipment: string[];
  focus: string;
}

interface FitnessAssistantProps {
  onComplete: (profile: FitnessReadiness) => void;
}

export function FitnessAssistant({ onComplete }: FitnessAssistantProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<FitnessReadiness>>({
    difficultMovements: [],
    equipment: [],
  });
  
  const [textInput, setTextInput] = useState("");

  const steps = [
    {
      id: "intro",
      message: "Before we plan today's workout, I'd like to understand how your body feels and what level of movement feels comfortable for you.",
      type: "info"
    },
    {
      id: "fitnessLevel",
      message: "How would you describe your current fitness level?",
      options: ["New to exercise", "Beginner", "Comfortable with regular exercise", "Advanced", "I'm not sure"],
      type: "single"
    },
    {
      id: "mobilityLevel",
      message: "How does your body feel during everyday movement?",
      options: ["I move comfortably", "I feel slightly stiff", "My range of motion is limited", "Some movements feel difficult", "I'm not sure"],
      type: "single"
    },
    {
      id: "difficultMovements",
      message: "Are there any movements you cannot perform comfortably?",
      options: ["Squatting", "Lunging", "Bending forward", "Reaching overhead", "Getting down to the floor", "None of these", "I'm not sure"],
      type: "multi"
    },
    {
      id: "healthNotes",
      message: "Do you currently have pain, a recent injury, a medical condition, or any movement restriction that could affect exercise?",
      subMessage: "Please share only what you are comfortable sharing. This helps us avoid unsuitable movements; it does not replace professional medical advice.",
      type: "text"
    },
    {
      id: "intensityPreference",
      message: "How intense would you like today's workout to feel?",
      options: ["Gentle and low impact", "Light but active", "Moderate", "Challenging", "I'm not sure"],
      type: "single"
    },
    {
      id: "equipment",
      message: "What equipment do you have available?",
      options: ["No equipment", "Mat", "Chair", "Resistance band", "Dumbbells", "Pull-up bar", "More than one option"],
      type: "multi"
    },
    {
      id: "focus",
      message: "What would you like to focus on?",
      options: ["Full-body fitness", "Strength", "Mobility", "Balance", "Cardio", "Core", "General movement"],
      type: "single"
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile as FitnessReadiness);
    }
  };

  const handleSingleSelect = (val: string) => {
    setProfile(prev => ({ ...prev, [currentStep.id]: val }));
    handleNext();
  };

  const toggleMultiSelect = (val: string) => {
    const list = profile[currentStep.id as keyof typeof profile] as string[];
    if (list.includes(val)) {
      setProfile(prev => ({ ...prev, [currentStep.id]: list.filter(item => item !== val) }));
    } else {
      setProfile(prev => ({ ...prev, [currentStep.id]: [...list, val] }));
    }
  };

  const handleTextSubmit = () => {
    setProfile(prev => ({ ...prev, [currentStep.id]: textInput }));
    handleNext();
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border border-accent/30 shadow-[0_0_15px_rgba(192,255,0,0.2)]">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="font-black text-white text-lg">Fitness Assistant</h3>
          <p className="text-xs text-accent tracking-widest uppercase font-bold">Readiness Check</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/5 rounded-2xl p-6 border border-white/10"
        >
          <p className="text-lg text-white font-medium mb-1">{currentStep.message}</p>
          {currentStep.subMessage && (
            <p className="text-sm text-muted mt-2 mb-4 italic">{currentStep.subMessage}</p>
          )}

          <div className="mt-6 flex flex-col gap-3">
            {currentStep.type === "info" && (
              <button 
                onClick={handleNext}
                className="mt-2 bg-accent text-black font-black py-3 px-6 rounded-xl self-start hover:scale-105 transition-transform"
              >
                Let&apos;s begin
              </button>
            )}

            {currentStep.type === "single" && currentStep.options?.map(opt => (
              <button
                key={opt}
                onClick={() => handleSingleSelect(opt)}
                className="text-left px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all font-medium text-white/90"
              >
                {opt}
              </button>
            ))}

            {currentStep.type === "multi" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {currentStep.options?.map(opt => {
                    const isSelected = (profile[currentStep.id as keyof typeof profile] as string[])?.includes(opt);
                    return (
                      <button
                        key={opt}
                        onClick={() => toggleMultiSelect(opt)}
                        className={`text-left px-4 py-3 rounded-xl border transition-all font-medium flex items-center justify-between ${
                          isSelected 
                            ? "bg-accent/10 border-accent/50 text-white" 
                            : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                        }`}
                      >
                        {opt}
                        {isSelected && <CheckCircle2 size={18} className="text-accent" />}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={handleNext}
                  className="bg-accent text-black font-black py-3 px-6 rounded-xl self-start hover:scale-105 transition-transform mt-2"
                >
                  Continue
                </button>
              </>
            )}

            {currentStep.type === "text" && (
              <div className="flex flex-col gap-4">
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="E.g., I have a sore lower back..."
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-accent/50 min-h-[100px]"
                />
                <button 
                  onClick={handleTextSubmit}
                  className="bg-accent text-black font-black py-3 px-6 rounded-xl flex items-center gap-2 self-start hover:scale-105 transition-transform"
                >
                  Continue <Send size={16} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
