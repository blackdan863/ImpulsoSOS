import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <footer className="mt-8 pt-4 pb-6 border-t border-slate-200/80 text-center">
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-1">
        <ShieldAlert className="w-3.5 h-3.5 text-[#167B65] shrink-0" />
        <span className="font-medium text-slate-600">Herramienta de autoayuda no clínica</span>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500 max-w-sm mx-auto px-4">
        ImpulsoSOS es un recurso de apoyo práctico e inmediato. No constituye diagnóstico, terapia ni sustituye la atención médica o psicológica profesional.
      </p>
      <button
        onClick={() => setShowDetails(true)}
        className="mt-2 text-[11px] text-[#167B65] hover:text-[#126452] underline font-medium inline-flex items-center gap-1 transition"
      >
        <Info className="w-3 h-3" />
        Saber más sobre el propósito de la app
      </button>

      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 text-left relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition"
              aria-label="Cerrar información"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-[#167B65]/10 text-[#167B65] flex items-center justify-center mb-3">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-[#172C3A] mb-2">
              Aviso y Enfoque de ImpulsoSOS
            </h4>
            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Propósito:</strong> Ofrecer una pausa consciente y acciones estructuradas de respuesta inmediata ante momentos de urgencia o impulsos hacia el consumo de pornografía.
              </p>
              <p>
                <strong>Privacidad total:</strong> Esta aplicación funciona 100% de manera local en tu navegador. No requiere inicio de sesión, no recopila datos personales, no utiliza cookies de rastreo y no almacena tus respuestas en servidores.
              </p>
              <p>
                <strong>Límites:</strong> No reemplaza la intervención de profesionales de salud mental o sexología clínica. Si experimentas malestar persistente o dificultades recurrentes, te alentamos a consultar con un especialista cualificado.
              </p>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-[#172C3A] hover:bg-[#12222d] text-white font-medium text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
