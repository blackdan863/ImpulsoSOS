import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, Timer as TimerIcon } from 'lucide-react';

interface TimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMinutes?: number;
  title?: string;
  onComplete?: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  isOpen,
  onClose,
  initialMinutes = 5,
  title = 'Pausa de tiempo',
  onComplete,
}) => {
  const totalSeconds = Math.max(1, initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  const completedCallbackFiredRef = useRef(false);

  // Reset timer whenever it is opened or when the initialMinutes prop changes
  useEffect(() => {
    if (isOpen) {
      const seconds = Math.max(1, initialMinutes * 60);
      setTimeLeft(seconds);
      setIsRunning(true);
      setIsFinished(false);
      completedCallbackFiredRef.current = false;
    } else {
      setIsRunning(false);
      setIsFinished(false);
    }
  }, [isOpen, initialMinutes]);

  useEffect(() => {
    if (!isOpen || !isRunning || isFinished) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsFinished(true);
          setIsRunning(false);

          if (!completedCallbackFiredRef.current && onComplete) {
            completedCallbackFiredRef.current = true;
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, isFinished, onComplete]);

  if (!isOpen) return null;

  const handleRestart = () => {
    const seconds = Math.max(1, initialMinutes * 60);
    setTimeLeft(seconds);
    setIsRunning(true);
    setIsFinished(false);
    completedCallbackFiredRef.current = false;
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#172C3A] text-white rounded-2xl p-6 shadow-2xl border border-white/10 flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition"
          aria-label="Cerrar temporizador"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#167B65] bg-[#167B65]/20 px-3 py-1 rounded-full mb-3">
          <TimerIcon className="w-3.5 h-3.5" />
          <span>Herramienta opcional</span>
        </div>

        <h3 className="text-xl font-bold text-center text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-300 text-center mb-5 px-2">
          Un espacio de espera si deseas pausar {initialMinutes} minutos antes de tomar una decisión.
        </p>

        {/* Circular display */}
        <div className="relative w-40 h-40 flex items-center justify-center my-2">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#2A4356"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              stroke="#167B65"
              strokeWidth="6"
              strokeDasharray={276.4}
              strokeDashoffset={276.4 - (276.4 * progressPercent) / 100}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tight text-white font-mono">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {isFinished ? 'Tiempo cumplido' : 'minutos restantes'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full mt-4">
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
              <span>Finalizar pausa</span>
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Reiniciar temporizador"
            aria-label="Reiniciar temporizador"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {isFinished && (
          <div className="mt-4 flex items-center gap-2 text-xs text-[#34D399] bg-[#167B65]/20 px-3 py-2 rounded-lg border border-[#167B65]/40 w-full">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Tiempo completado. Puedes continuar cuando lo desees.</span>
          </div>
        )}
      </div>
    </div>
  );
};
