import React from 'react';
import { Emotion, Location } from '../types';
import { 
  Zap, 
  Clock, 
  Home, 
  Bed, 
  Footprints, 
  ShieldCheck, 
  ChevronRight,
  Activity,
  UserX
} from 'lucide-react';

interface ScreenOneProps {
  emotion: Emotion;
  setEmotion: (emotion: Emotion) => void;
  location: Location;
  setLocation: (location: Location) => void;
  intensity: number;
  setIntensity: (intensity: number) => void;
  onSubmit: () => void;
}

const EMOTIONS: { value: Emotion; label: string; icon: React.ElementType; hint: string }[] = [
  { value: 'Ansiedad', label: 'Ansiedad', icon: Activity, hint: 'Inquietud o agitación' },
  { value: 'Aburrimiento', label: 'Aburrimiento', icon: Clock, hint: 'Falta de estímulo o actividad' },
  { value: 'Estrés o frustración', label: 'Estrés o frustración', icon: Zap, hint: 'Tensión o sobrecarga' },
  { value: 'Soledad', label: 'Soledad', icon: UserX, hint: 'Sensación de aislamiento' },
];

const LOCATIONS: { value: Location; label: string; icon: React.ElementType; hint: string }[] = [
  { value: 'Solo en mi habitación', label: 'Solo en mi habitación', icon: Bed, hint: 'Espacio cerrado y privado' },
  { value: 'En otra parte de casa', label: 'En otra parte de casa', icon: Home, hint: 'Salón, cocina o baño' },
  { value: 'Fuera de casa', label: 'Fuera de casa', icon: Footprints, hint: 'Espacio público, calle o transporte' },
];

export const ScreenOne: React.FC<ScreenOneProps> = ({
  emotion,
  setEmotion,
  location,
  setLocation,
  intensity,
  setIntensity,
  onSubmit,
}) => {
  const getIntensityLabel = (val: number) => {
    if (val <= 3) return { text: 'Leve', color: 'text-slate-700 bg-slate-100 border-slate-200' };
    if (val <= 6) return { text: 'Moderada', color: 'text-slate-700 bg-slate-100 border-slate-200' };
    if (val <= 8) return { text: 'Notable', color: 'text-slate-800 bg-slate-100 border-slate-200' };
    return { text: 'Alta', color: 'text-slate-800 bg-slate-100 border-slate-200' };
  };

  const intensityTag = getIntensityLabel(intensity);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="text-center pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#167B65]/10 text-[#167B65] text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Apoyo Práctico Inmediato</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172C3A] tracking-tight">
          ¿Qué sientes en este momento?
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto">
          Selecciona las opciones que describan tu situación para organizar un plan práctico.
        </p>
      </div>

      {/* QUESTION 1: What do you feel? */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <label className="text-sm font-bold text-[#172C3A] flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#172C3A] text-white flex items-center justify-center text-xs font-bold">1</span>
          ¿Qué sientes principalmente?
        </label>

        <div className="grid grid-cols-2 gap-2.5">
          {EMOTIONS.map((item) => {
            const Icon = item.icon;
            const isSelected = emotion === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setEmotion(item.value)}
                className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between min-h-[76px] cursor-pointer ${
                  isSelected
                    ? 'border-[#167B65] bg-[#167B65]/10 shadow-sm ring-1 ring-[#167B65]'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-[#167B65] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#167B65]" />
                  )}
                </div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? 'text-[#172C3A]' : 'text-slate-800'}`}>
                    {item.label}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {item.hint}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUESTION 2: Where are you? */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <label className="text-sm font-bold text-[#172C3A] flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-full bg-[#172C3A] text-white flex items-center justify-center text-xs font-bold">2</span>
          ¿Dónde te encuentras?
        </label>

        <div className="space-y-2">
          {LOCATIONS.map((loc) => {
            const Icon = loc.icon;
            const isSelected = location === loc.value;
            return (
              <button
                key={loc.value}
                type="button"
                onClick={() => setLocation(loc.value)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between min-h-[52px] cursor-pointer ${
                  isSelected
                    ? 'border-[#167B65] bg-[#167B65]/10 shadow-sm ring-1 ring-[#167B65]'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#167B65] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className={`text-xs font-bold ${isSelected ? 'text-[#172C3A]' : 'text-slate-800'}`}>
                      {loc.label}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500">
                      {loc.hint}
                    </div>
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#167B65] bg-[#167B65]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* QUESTION 3: Urge Intensity Slider 1 to 10 */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="intensity-range" className="text-sm font-bold text-[#172C3A] flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-[#172C3A] text-white flex items-center justify-center text-xs font-bold">3</span>
            Intensidad del impulso (1 al 10)
          </label>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${intensityTag.color}`}>
              {intensityTag.text}
            </span>
            <span className="text-base font-extrabold text-[#172C3A] w-6 text-right">
              {intensity}
            </span>
          </div>
        </div>

        {/* Range slider */}
        <div className="pt-2 pb-1">
          <input
            id="intensity-range"
            type="range"
            min="1"
            max="10"
            step="1"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#167B65]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2 px-1">
            <span>1 (Baja)</span>
            <span>5 (Media)</span>
            <span>10 (Alta)</span>
          </div>
        </div>

        {/* Quick select buttons */}
        <div className="grid grid-cols-10 gap-1 mt-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setIntensity(val)}
              className={`h-8 rounded-lg text-xs font-bold transition min-h-[32px] ${
                intensity === val
                  ? 'bg-[#167B65] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </section>

      {/* Action Button: Ver mi plan */}
      <div className="pt-1">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full py-4 px-6 rounded-2xl bg-[#167B65] hover:bg-[#126452] active:scale-[0.99] text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition duration-150 cursor-pointer min-h-[48px]"
        >
          <span>Ver mi plan</span>
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-2">
          Plan de 3 acciones adaptado a tus respuestas.
        </p>
      </div>
    </div>
  );
};
