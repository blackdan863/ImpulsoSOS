import React, { useState } from 'react';
import { ActionPlanItem, UserAssessment } from '../types';
import { 
  Check, 
  Clock, 
  ArrowRight, 
  Wind, 
  Timer, 
  Eye
} from 'lucide-react';
import { BreathingModal } from './BreathingModal';
import { TimerModal } from './TimerModal';
import { GroundingModal } from './GroundingModal';

interface ScreenTwoProps {
  assessment: UserAssessment;
  actions: ActionPlanItem[];
  completedActionIds: string[];
  toggleAction: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const ScreenTwo: React.FC<ScreenTwoProps> = ({
  assessment,
  actions,
  completedActionIds,
  toggleAction,
  onContinue,
  onBack,
}) => {
  const [activeModal, setActiveModal] = useState<'breathing' | 'timer' | 'grounding' | null>(null);
  const [activeAction, setActiveAction] = useState<ActionPlanItem | null>(null);

  const completedCount = completedActionIds.length;
  const totalCount = actions.length; // 3
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const openToolModal = (type: 'breathing' | 'timer' | 'grounding', action: ActionPlanItem) => {
    setActiveAction(action);
    setActiveModal(type);
  };

  const closeToolModal = () => {
    setActiveModal(null);
    setActiveAction(null);
  };

  const timerMinutes = activeAction?.timerMinutes 
    ? activeAction.timerMinutes 
    : activeAction 
    ? (parseInt(activeAction.duration, 10) || 5) 
    : 5;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="text-xs text-slate-500 hover:text-[#172C3A] font-semibold flex items-center gap-1 transition py-1"
          >
            ← Modificar respuestas
          </button>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Paso 2 de 3
          </span>
        </div>

        <h1 className="text-2xl font-extrabold text-[#172C3A] tracking-tight">
          Plan de acciones sugeridas
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Tres acciones prácticas y sencillas para este momento. Puedes realizarlas a tu propio ritmo.
        </p>

        {/* Current status pill */}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs bg-slate-100/80 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-700">
          <span className="font-semibold text-[#172C3A]">{assessment.emotion}</span>
          <span className="text-slate-300">•</span>
          <span>{assessment.location}</span>
          <span className="text-slate-300">•</span>
          <span className="font-semibold text-[#167B65]">Intensidad {assessment.initialIntensity}/10</span>
        </div>
      </div>

      {/* Progress Bar */}
      <section className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-[#172C3A]">
            Acciones marcadas: {completedCount} de {totalCount}
          </span>
          <span className="font-bold text-[#167B65]">
            {progressPercent}%
          </span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
          <div
            className="bg-[#167B65] h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          {completedCount === totalCount
            ? 'Has marcado las 3 acciones sugeridas.'
            : 'Marca cada casilla conforme realices la acción, si te resulta cómodo.'}
        </p>
      </section>

      {/* Simplified Action Cards: Only number, short title, estimated duration, one instruction, checkbox */}
      <section className="space-y-3">
        {actions.map((action, idx) => {
          const isDone = completedActionIds.includes(action.id);
          return (
            <div
              key={action.id}
              className={`rounded-2xl p-4 border transition-all ${
                isDone
                  ? 'bg-[#167B65]/5 border-[#167B65]/40'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Completion Checkbox */}
                <button
                  type="button"
                  onClick={() => toggleAction(action.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all cursor-pointer min-h-[24px] min-w-[24px] ${
                    isDone
                      ? 'bg-[#167B65] border-[#167B65] text-white shadow-sm ring-2 ring-[#167B65]/20'
                      : 'bg-white border-slate-300 hover:border-[#167B65] text-transparent'
                  }`}
                  aria-label={`Marcar acción ${idx + 1}: ${action.title}`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>

                <div className="flex-1 min-w-0">
                  {/* Top line: Action number and estimated duration */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-400">
                      Acción {idx + 1}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {action.duration}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => toggleAction(action.id)}
                    className={`text-sm sm:text-base font-bold cursor-pointer transition ${
                      isDone ? 'line-through text-slate-500' : 'text-[#172C3A]'
                    }`}
                  >
                    {action.title}
                  </h3>

                  {/* One concise practical instruction */}
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {action.description}
                  </p>

                  {/* Optional Interactive Micro-Tools with dynamic duration matching the action */}
                  {action.interactiveType && (
                    <div className="mt-3">
                      {action.interactiveType === 'breathing' && (
                        <button
                          type="button"
                          onClick={() => openToolModal('breathing', action)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172C3A] text-xs font-medium transition border border-slate-200"
                        >
                          <Wind className="w-3.5 h-3.5 text-[#167B65]" />
                          <span>Abrir guía de respiración ({action.duration})</span>
                        </button>
                      )}

                      {action.interactiveType === 'timer' && (
                        <button
                          type="button"
                          onClick={() => openToolModal('timer', action)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172C3A] text-xs font-medium transition border border-slate-200"
                        >
                          <Timer className="w-3.5 h-3.5 text-[#167B65]" />
                          <span>Abrir temporizador ({action.duration})</span>
                        </button>
                      )}

                      {action.interactiveType === 'grounding' && (
                        <button
                          type="button"
                          onClick={() => openToolModal('grounding', action)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172C3A] text-xs font-medium transition border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#167B65]" />
                          <span>Abrir guía de observación ({action.duration})</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Button: Continuar */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onContinue}
          className="w-full py-4 px-6 rounded-2xl bg-[#167B65] hover:bg-[#126452] active:scale-[0.99] text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition duration-150 cursor-pointer min-h-[48px]"
        >
          <span>Continuar</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-2">
          Puedes avanzar al siguiente paso cuando lo desees.
        </p>
      </div>

      {/* Modals for optional tools with action-specific durations */}
      <BreathingModal
        isOpen={activeModal === 'breathing'}
        onClose={closeToolModal}
        onComplete={() => {
          if (activeAction && !completedActionIds.includes(activeAction.id)) {
            toggleAction(activeAction.id);
          }
        }}
      />

      <TimerModal
        isOpen={activeModal === 'timer'}
        onClose={closeToolModal}
        initialMinutes={timerMinutes}
        title={activeAction?.title || 'Pausa de tiempo'}
        onComplete={() => {
          if (activeAction && !completedActionIds.includes(activeAction.id)) {
            toggleAction(activeAction.id);
          }
        }}
      />

      <GroundingModal
        isOpen={activeModal === 'grounding'}
        onClose={closeToolModal}
        onComplete={() => {
          if (activeAction && !completedActionIds.includes(activeAction.id)) {
            toggleAction(activeAction.id);
          }
        }}
      />
    </div>
  );
};
