/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Emotion, Location, ActionPlanItem } from './types';
import { generateActionPlan } from './rules';
import { ScreenOne } from './components/ScreenOne';
import { ScreenTwo } from './components/ScreenTwo';
import { ScreenThree } from './components/ScreenThree';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { Shield, CheckCircle } from 'lucide-react';

export default function App() {
  // Navigation: Exactly three primary screens (1, 2, 3)
  const [screen, setScreen] = useState<1 | 2 | 3>(1);

  // Screen 1 temporary session state
  const [emotion, setEmotion] = useState<Emotion>('Ansiedad');
  const [location, setLocation] = useState<Location>('Solo en mi habitación');
  const [initialIntensity, setInitialIntensity] = useState<number>(7);

  // Screen 2 state
  const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);
  const [planVariation, setPlanVariation] = useState<number>(0);

  // Screen 3 state
  const [currentIntensity, setCurrentIntensity] = useState<number>(4);

  // Minimal summary retained exclusively for the completion modal
  const [isFinishedSession, setIsFinishedSession] = useState<boolean>(false);
  const [lastSessionSummary, setLastSessionSummary] = useState<{
    initial: number;
    final: number;
    completed: number;
  } | null>(null);

  // Deterministically computed 3 actions for Screen 2
  const actions: ActionPlanItem[] = generateActionPlan(
    emotion,
    location,
    initialIntensity,
    planVariation
  );

  // Handler: Screen 1 -> Screen 2 (Ver mi plan)
  const handleViewPlan = () => {
    setCurrentIntensity(initialIntensity);
    setCompletedActionIds([]);
    setPlanVariation(0);
    setScreen(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Screen 2 checkbox toggle
  const toggleAction = (id: string) => {
    setCompletedActionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handler: Screen 2 -> Screen 3 (Continuar)
  const handleContinueToScreenThree = () => {
    setScreen(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Screen 3 -> Probar otro plan (keeps assessment answers, resets actions, increments variation)
  const handleTryAnotherPlan = () => {
    setPlanVariation((prev) => prev + 1);
    setCompletedActionIds([]);
    setScreen(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Screen 3 -> Finalizar
  // Immediately resets previous assessment answers and session state in React memory
  // Retains only the minimal summary for the completion modal display
  const handleFinish = () => {
    setLastSessionSummary({
      initial: initialIntensity,
      final: currentIntensity,
      completed: completedActionIds.length,
    });

    // Reset session state immediately
    setEmotion('Ansiedad');
    setLocation('Solo en mi habitación');
    setInitialIntensity(7);
    setCurrentIntensity(4);
    setCompletedActionIds([]);
    setPlanVariation(0);

    // Open completion modal
    setIsFinishedSession(true);
  };

  // Handler: Start fresh session from clean state
  const handleResetSession = () => {
    setLastSessionSummary(null);
    setIsFinishedSession(false);
    setScreen(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#172C3A] flex flex-col font-sans selection:bg-[#167B65]/20 selection:text-[#172C3A] overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#172C3A] flex items-center justify-center text-white shadow-sm">
              <Shield className="w-4 h-4 text-[#34D399]" />
            </div>
            <div>
              <span className="font-extrabold text-[#172C3A] text-base tracking-tight leading-none">
                Impulso<span className="text-[#167B65]">SOS</span>
              </span>
              <span className="block text-[10px] text-slate-500 font-medium">
                Pausa & Autocontrol
              </span>
            </div>
          </div>

          {/* Stepper Indicator for the 3 Screens */}
          <div className="flex items-center gap-1.5" aria-label="Indicador de pantalla">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center justify-center text-[11px] font-bold rounded-lg transition-all ${
                  screen === stepNum
                    ? 'w-6 h-6 bg-[#167B65] text-white shadow-sm'
                    : screen > stepNum
                    ? 'w-6 h-6 bg-[#167B65]/20 text-[#167B65]'
                    : 'w-6 h-6 bg-slate-100 text-slate-400'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area (Mobile-first container with verified responsiveness) */}
      <main className="flex-1 max-w-md mx-auto w-full px-3.5 sm:px-4 pt-4 sm:pt-5 pb-8 flex flex-col justify-between">
        <div className="w-full">
          {screen === 1 && (
            <ScreenOne
              emotion={emotion}
              setEmotion={setEmotion}
              location={location}
              setLocation={setLocation}
              intensity={initialIntensity}
              setIntensity={setInitialIntensity}
              onSubmit={handleViewPlan}
            />
          )}

          {screen === 2 && (
            <ScreenTwo
              assessment={{
                emotion,
                location,
                initialIntensity,
              }}
              actions={actions}
              completedActionIds={completedActionIds}
              toggleAction={toggleAction}
              onContinue={handleContinueToScreenThree}
              onBack={() => setScreen(1)}
            />
          )}

          {screen === 3 && (
            <ScreenThree
              assessment={{
                emotion,
                location,
                initialIntensity,
              }}
              currentIntensity={currentIntensity}
              setCurrentIntensity={setCurrentIntensity}
              onTryAnotherPlan={handleTryAnotherPlan}
              onFinish={handleFinish}
              onBackToPlan={() => setScreen(2)}
            />
          )}
        </div>

        {/* Clinical Disclaimer Banner */}
        <DisclaimerBanner />
      </main>

      {/* Completion Modal when user clicks 'Finalizar' */}
      {isFinishedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-[#167B65]/10 text-[#167B65] flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-[#172C3A] mb-1">
              Sesión concluida
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Has completado el recorrido de esta sesión práctica.
            </p>

            {lastSessionSummary && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-5 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Intensidad inicial:</span>
                  <span className="font-bold text-[#172C3A]">{lastSessionSummary.initial}/10</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Intensidad final registrada:</span>
                  <span className="font-bold text-[#167B65]">{lastSessionSummary.final}/10</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Acciones marcadas:</span>
                  <span className="font-bold text-[#172C3A]">{lastSessionSummary.completed} de 3</span>
                </div>
                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                  Al finalizar, tus respuestas y acciones previas se restablecieron de inmediato. Solo se muestra este resumen temporal en pantalla mientras decides iniciar una nueva sesión. Esta aplicación no almacena datos en almacenamiento local, cookies ni servidores.
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleResetSession}
              className="w-full py-3.5 px-4 rounded-xl bg-[#167B65] hover:bg-[#126452] text-white font-bold text-sm shadow-md transition min-h-[44px]"
            >
              Comenzar nueva sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
