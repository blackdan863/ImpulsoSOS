import React from 'react';
import { UserAssessment } from '../types';
import { getIntensityRecommendation } from '../rules';
import { 
  RotateCcw, 
  CheckCheck
} from 'lucide-react';

interface ScreenThreeProps {
  assessment: UserAssessment;
  currentIntensity: number;
  setCurrentIntensity: (val: number) => void;
  onTryAnotherPlan: () => void;
  onFinish: () => void;
  onBackToPlan: () => void;
}

export const ScreenThree: React.FC<ScreenThreeProps> = ({
  assessment,
  currentIntensity,
  setCurrentIntensity,
  onTryAnotherPlan,
  onFinish,
  onBackToPlan,
}) => {
  const initial = assessment.initialIntensity;
  const current = currentIntensity;

  const recommendation = getIntensityRecommendation(initial, current);

  const getStatusBadge = () => {
    if (recommendation.statusType === 'lower') {
      return {
        color: 'text-[#167B65] bg-[#167B65]/10 border-[#167B65]/30',
        text: recommendation.deltaText,
      };
    } else if (recommendation.statusType === 'steady') {
      return {
        color: 'text-slate-700 bg-slate-100 border-slate-300',
        text: recommendation.deltaText,
      };
    } else {
      return {
        color: 'text-slate-800 bg-amber-50 border-amber-200',
        text: recommendation.deltaText,
      };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Step Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBackToPlan}
            className="text-xs text-slate-500 hover:text-[#172C3A] font-semibold flex items-center gap-1 transition py-1"
          >
            ← Volver a las acciones
          </button>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Paso 3 de 3
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#172C3A] tracking-tight">
          Reevaluación de intensidad
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Indica el nivel de intensidad que experimentas en este momento.
        </p>
      </div>

      {/* RATING SECTION: 0 to 10 */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <label htmlFor="current-intensity-range" className="text-sm font-bold text-[#172C3A]">
            Intensidad actual (0 al 10)
          </label>
          <span className="text-lg font-extrabold text-[#167B65] w-7 text-right">
            {currentIntensity}
          </span>
        </div>

        {/* Range slider 0 to 10 */}
        <div className="pt-2 pb-1">
          <input
            id="current-intensity-range"
            type="range"
            min="0"
            max="10"
            step="1"
            value={currentIntensity}
            onChange={(e) => setCurrentIntensity(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#167B65]"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-semibold mt-2 px-1">
            <span>0 (Ninguna)</span>
            <span>5 (Media)</span>
            <span>10 (Máxima)</span>
          </div>
        </div>

        {/* Fast buttons (0 to 10) */}
        <div className="grid grid-cols-11 gap-1 mt-3">
          {Array.from({ length: 11 }, (_, i) => i).map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setCurrentIntensity(val)}
              className={`h-8 rounded-lg text-xs font-bold transition min-h-[32px] ${
                currentIntensity === val
                  ? 'bg-[#167B65] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
      </section>

      {/* COMPARISON CARD: Initial vs Current */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Comparación de intensidad
          </h2>
          <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Comparison columns */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Initial */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              Al comenzar
            </span>
            <div className="text-2xl font-black text-[#172C3A]">
              {initial}
              <span className="text-xs font-normal text-slate-400">/10</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-slate-400 h-full rounded-full"
                style={{ width: `${(initial / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Current */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              Ahora
            </span>
            <div className="text-2xl font-black text-[#167B65]">
              {current}
              <span className="text-xs font-normal text-slate-400">/10</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-[#167B65] h-full rounded-full transition-all duration-300"
                style={{ width: `${(current / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEUTRAL RECOMMENDATION CARD */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
          Orientación siguiente
        </span>
        <h2 className="text-base font-bold text-[#172C3A] mt-1">
          {recommendation.headline}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          {recommendation.body}
        </p>
      </section>

      {/* TWO BUTTONS: Probar otro plan & Finalizar */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onTryAnotherPlan}
          className="w-full py-3.5 px-5 rounded-2xl border-2 border-[#167B65] bg-white hover:bg-[#167B65]/5 active:scale-[0.99] text-[#167B65] font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition duration-150 cursor-pointer min-h-[48px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Probar otro plan</span>
        </button>

        <button
          type="button"
          onClick={onFinish}
          className="w-full py-4 px-6 rounded-2xl bg-[#172C3A] hover:bg-[#12222d] active:scale-[0.99] text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition duration-150 cursor-pointer min-h-[48px]"
        >
          <CheckCheck className="w-5 h-5 stroke-[2.5] text-[#34D399]" />
          <span>Finalizar</span>
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Al finalizar, se reiniciará el estado de esta sesión.
        </p>
      </div>
    </div>
  );
};
