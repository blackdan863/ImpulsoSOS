import React, { useState } from 'react';
import { X, Check, Eye, Hand, Volume2, Sparkles, Heart } from 'lucide-react';

interface GroundingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

const steps = [
  { count: 5, label: 'Cosas que puedes ver en este momento', icon: Eye },
  { count: 4, label: 'Cosas que puedes tocar físicamente', icon: Hand },
  { count: 3, label: 'Sonidos distintos que puedes percibir', icon: Volume2 },
  { count: 2, label: 'Sensaciones físicas o temperatura en tu piel', icon: Sparkles },
  { count: 1, label: 'Un detalle cotidiano que aprecies hoy', icon: Heart },
];

export const GroundingModal: React.FC<GroundingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isOpen) return null;

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => {
      const next = prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index];
      if (next.length === steps.length && onComplete) {
        onComplete();
      }
      return next;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#172C3A] text-white rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Cerrar ejercicio"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold tracking-wider uppercase text-[#167B65] bg-[#167B65]/20 px-3 py-1 rounded-full w-fit mb-3">
          Guía opcional
        </span>

        <h3 className="text-xl font-bold text-white mb-1">
          Observación del entorno
        </h3>
        <p className="text-xs text-slate-300 mb-4">
          Una práctica sencilla para llevar tu atención hacia los elementos cotidianos que te rodean:
        </p>

        <div className="space-y-2.5 my-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = completedSteps.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition min-h-[44px] ${
                  isDone
                    ? 'bg-[#167B65]/20 border-[#167B65] text-white'
                    : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isDone ? 'bg-[#167B65] text-white' : 'bg-white/10 text-slate-200'
                    }`}
                  >
                    {step.count}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Icon className="w-3.5 h-3.5 text-slate-300" />
                    <span>{step.label}</span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                    isDone
                      ? 'bg-[#167B65] border-[#167B65] text-white'
                      : 'border-white/30 text-transparent'
                  }`}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full py-3 rounded-xl bg-[#167B65] hover:bg-[#126452] text-white font-semibold transition text-sm min-h-[44px]"
        >
          {completedSteps.length === steps.length ? 'Listo, volver al plan' : 'Cerrar'}
        </button>
      </div>
    </div>
  );
};
