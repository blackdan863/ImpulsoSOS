import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

type Phase = 'Inhala' | 'Exhala';

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [isRunning, setIsRunning] = useState(true);
  const [phase, setPhase] = useState<Phase>('Inhala');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const targetCycles = 4;
  const completedCallbackFiredRef = useRef(false);

  // Fresh reset whenever modal is closed or reopened
  useEffect(() => {
    if (isOpen) {
      setIsRunning(true);
      setPhase('Inhala');
      setSecondsLeft(4);
      setCyclesCompleted(0);
      setIsFinished(false);
      completedCallbackFiredRef.current = false;
    } else {
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [isOpen]);

  // Interval timer for breathing cycles
  useEffect(() => {
    if (!isOpen || !isRunning || isFinished) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Current second reached 1, transition phase
        if (phase === 'Inhala') {
          setPhase('Exhala');
          return 4;
        } else {
          // Finished 'Exhala', one full cycle ends
          const nextCycle = cyclesCompleted + 1;
          if (nextCycle >= targetCycles) {
            setCyclesCompleted(targetCycles);
            setIsFinished(true);
            setIsRunning(false);

            if (!completedCallbackFiredRef.current && onComplete) {
              completedCallbackFiredRef.current = true;
              onComplete();
            }
            return 0;
          } else {
            setCyclesCompleted(nextCycle);
            setPhase('Inhala');
            return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, isFinished, phase, cyclesCompleted, onComplete]);

  if (!isOpen) return null;

  const handleRestart = () => {
    setPhase('Inhala');
    setSecondsLeft(4);
    setCyclesCompleted(0);
    setIsFinished(false);
    setIsRunning(true);
    completedCallbackFiredRef.current = false;
  };

  const phaseInstruction = isFinished
    ? 'Has completado los 4 ciclos sugeridos.'
    : phase === 'Inhala'
    ? 'Inhala con suavidad a tu propio ritmo'
    : 'Exhala despacio y sin forzar';

  const circleScale = isFinished
    ? 'scale-100'
    : phase === 'Inhala'
    ? 'scale-105'
    : 'scale-95';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#172C3A] text-white rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Cerrar respiración"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold tracking-wider uppercase text-[#167B65] bg-[#167B65]/20 px-3 py-1 rounded-full mb-3">
          Guía opcional
        </span>

        <h3 className="text-xl font-bold text-center text-white mb-1">
          Respiración pausada
        </h3>
        <p className="text-xs text-slate-300 text-center mb-6 px-2">
          Un ritmo suave y cómodo si deseas tomarte unos instantes de pausa.
        </p>

        {/* Animated breathing circle */}
        <div className="relative w-40 h-40 flex items-center justify-center my-3">
          <div
            className={`absolute inset-0 rounded-full bg-[#167B65]/20 transition-transform duration-1000 ease-in-out ${circleScale}`}
          />
          <div
            className={`w-32 h-32 rounded-full border-4 border-[#167B65] flex flex-col items-center justify-center bg-[#172C3A] shadow-inner transition-transform duration-1000 ease-in-out ${circleScale}`}
          >
            {isFinished ? (
              <CheckCircle2 className="w-12 h-12 text-[#34D399]" />
            ) : (
              <>
                <span className="text-2xl font-black text-white">{secondsLeft}s</span>
                <span className="text-xs font-semibold text-[#34D399] tracking-wide mt-1 uppercase">
                  {phase}
                </span>
              </>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-200 font-medium text-center min-h-[2rem] flex items-center justify-center px-2">
          {phaseInstruction}
        </p>

        {/* Cycles indicator */}
        <div className="flex items-center gap-2 mt-3 mb-5">
          <span className="text-xs text-slate-400">Ciclos:</span>
          {Array.from({ length: targetCycles }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i < cyclesCompleted
                  ? 'bg-[#167B65]'
                  : i === cyclesCompleted && !isFinished
                  ? 'bg-white/40 ring-1 ring-[#167B65]'
                  : 'bg-white/10'
              }`}
            />
          ))}
          <span className="text-xs text-slate-400 ml-1 font-mono">
            {cyclesCompleted}/{targetCycles}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full">
          {!isFinished ? (
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#167B65] hover:bg-[#126452] text-white font-semibold text-sm transition min-h-[44px]"
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Reanudar
                </>
              )}
            </button>
          ) : (
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#167B65] hover:bg-[#126452] text-white font-semibold text-sm transition min-h-[44px]"
            >
              <span>Finalizar ejercicio</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Reiniciar ejercicio"
            aria-label="Reiniciar ejercicio de respiración"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {isFinished && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[#34D399] bg-[#167B65]/20 px-3 py-2 rounded-lg border border-[#167B65]/40 w-full">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Has completado los 4 ciclos sugeridos. Puedes continuar.</span>
          </div>
        )}
      </div>
    </div>
  );
};
