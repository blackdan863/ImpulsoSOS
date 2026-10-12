import { ActionPlanItem, Emotion, Location } from './types';

/**
 * Deterministic local rule engine for ImpulsoSOS.
 * Generates three safe, practical, non-clinical actions
 * tailored to location, emotion, intensity, and plan variation.
 */
export function generateActionPlan(
  emotion: Emotion,
  location: Location,
  intensity: number,
  variation: number = 0
): ActionPlanItem[] {
  const isHighIntensity = intensity >= 7;

  // 1. Environmental / location action (safe, conditional, and realistic)
  let action1: ActionPlanItem;

  if (location === 'Solo en mi habitación') {
    if (variation % 2 === 0) {
      action1 = {
        id: 'env-change-space',
        title: 'Cambiar de espacio',
        description: 'Si estás en un lugar seguro y puedes hacerlo, sal de la estancia unos minutos a una zona común o abre la puerta.',
        duration: '2 min',
      };
    } else {
      action1 = {
        id: 'env-open-window',
        title: 'Ventilar o cambiar de postura',
        description: 'Si te resulta posible, abre una ventana para renovar el aire o ponte de pie para cambiar de posición corporal.',
        duration: '2 min',
      };
    }
  } else if (location === 'En otra parte de casa') {
    if (variation % 2 === 0) {
      action1 = {
        id: 'env-distance-device',
        title: 'Poner distancia con la pantalla',
        description: 'Si las circunstancias lo permiten, deja el dispositivo apoyado sobre una mesa fija y acércate a la cocina o ventana.',
        duration: '2 min',
      };
    } else {
      action1 = {
        id: 'env-manual-task',
        title: 'Actividad doméstica sencilla',
        description: 'Si te resulta práctico en este momento, realiza una tarea breve como servir un vaso de agua, ordenar una superficie o doblar ropa.',
        duration: '3 min',
      };
    }
  } else {
    // Fuera de casa: Safe and conditional, never assumes freedom to leave work or put phone away
    if (variation % 2 === 0) {
      action1 = {
        id: 'env-pause-screen-outdoors',
        title: 'Pausa visual de la pantalla',
        description: 'Si estás en un lugar seguro y puedes hacerlo, aparta la vista del dispositivo unos instantes y mantén la atención en tu entorno.',
        duration: '2 min',
      };
    } else {
      action1 = {
        id: 'env-observe-surroundings',
        title: 'Observar el entorno inmediato',
        description: 'Si la situación lo permite y resulta seguro, observa con atención tres elementos cotidianos de donde te encuentres (colores, sonidos o luz).',
        duration: '3 min',
      };
    }
  }

  // 2. Emotional response action (neutral, non-clinical)
  let action2: ActionPlanItem;

  if (emotion === 'Ansiedad') {
    if (variation % 2 === 0) {
      action2 = {
        id: 'emo-gentle-breathing',
        title: 'Respiración pausada',
        description: 'Si lo deseas, realiza varias respiraciones suaves a tu propio ritmo durante un par de minutos.',
        duration: '2 min',
        interactiveType: 'breathing',
      };
    } else {
      action2 = {
        id: 'emo-fresh-water',
        title: 'Agua fresca en rostro o manos',
        description: 'Si tienes acceso cómodo y seguro a agua, lávate las manos o el rostro con agua fresca para notar una sensación diferente.',
        duration: '2 min',
      };
    }
  } else if (emotion === 'Aburrimiento') {
    if (variation % 2 === 0) {
      action2 = {
        id: 'emo-hands-busy',
        title: 'Actividad práctica con las manos',
        description: 'Si tus ocupaciones te lo permiten, dedica unos minutos a una tarea manual concreta como escribir unas notas o estiramientos.',
        duration: '4 min',
      };
    } else {
      action2 = {
        id: 'emo-sip-water',
        title: 'Beber agua con calma',
        description: 'Si tienes bebida a mano, toma un vaso o botella de agua y bébela despacio a pequeños sorbos, pausando antes de continuar.',
        duration: '2 min',
      };
    }
  } else if (emotion === 'Estrés o frustración') {
    if (variation % 2 === 0) {
      action2 = {
        id: 'emo-gentle-stretch',
        title: 'Movimiento o estiramiento suave',
        description: 'Si estás en un lugar donde te resulte cómodo, mueve suavemente hombros y cuello o camina unos pasos para cambiar de postura.',
        duration: '3 min',
      };
    } else {
      action2 = {
        id: 'emo-calm-exhale',
        title: 'Pausa de respiración tranquila',
        description: 'Si lo deseas, toma aire con calma y exhala lentamente sin forzar durante un par de minutos.',
        duration: '2 min',
        interactiveType: 'breathing',
      };
    }
  } else {
    // Soledad
    if (variation % 2 === 0) {
      action2 = {
        id: 'emo-social-ping',
        title: 'Escribir o saludar a alguien',
        description: 'Si te resulta oportuno, envía un mensaje breve a una persona de confianza o intercambia un saludo cotidiano.',
        duration: '3 min',
      };
    } else {
      action2 = {
        id: 'emo-audio-listening',
        title: 'Escuchar un sonido o audio neutro',
        description: 'Si es viable en tu entorno, puedes escuchar música tranquila, un audio o la radio para acompañarte.',
        duration: '4 min',
      };
    }
  }

  // 3. Intensity-adapted pacing / pause action
  let action3: ActionPlanItem;

  if (isHighIntensity) {
    if (variation % 2 === 0) {
      action3 = {
        id: 'pace-timer-5min',
        title: 'Pausa de espera de 5 minutos',
        description: 'Si puedes tomarte este tiempo, espera 5 minutos antes de tomar cualquier decisión; puedes usar el temporizador si te ayuda.',
        duration: '5 min',
        timerMinutes: 5,
        interactiveType: 'timer',
      };
    } else {
      action3 = {
        id: 'pace-write-thoughts',
        title: 'Escribir brevemente en papel',
        description: 'Si tienes con qué escribir a mano, anota dos o tres pensamientos sobre este momento para tomar distancia.',
        duration: '3 min',
      };
    }
  } else {
    if (variation % 2 === 0) {
      action3 = {
        id: 'pace-grounding-observation',
        title: 'Observación consciente del entorno',
        description: 'Dirige tu atención unos instantes a tres cosas cotidianas que puedas percibir a tu alrededor.',
        duration: '3 min',
        interactiveType: 'grounding',
      };
    } else {
      action3 = {
        id: 'pace-timer-3min',
        title: 'Pausa de espera de 3 minutos',
        description: 'Si tus actividades lo permiten, tómate 3 minutos de pausa sin pantallas para considerar con tranquilidad tu siguiente paso.',
        duration: '3 min',
        timerMinutes: 3,
        interactiveType: 'timer',
      };
    }
  }

  return [action1, action2, action3];
}

/**
 * Returns neutral result messages for Screen 3 without claiming
 * that the app caused any improvement or judging success/failure.
 */
export function getIntensityRecommendation(
  initial: number,
  current: number
): {
  headline: string;
  body: string;
  statusType: 'lower' | 'steady' | 'higher';
  deltaText: string;
} {
  const diff = initial - current;

  if (diff > 0) {
    return {
      statusType: 'lower',
      deltaText: `Menor que al inicio (-${diff})`,
      headline: 'Intensidad menor',
      body: 'La intensidad que registraste ahora es menor que al comenzar. Puedes continuar con una actividad cotidiana o dar un paseo si lo consideras útil.',
    };
  } else if (diff === 0) {
    return {
      statusType: 'steady',
      deltaText: 'Mismo nivel',
      headline: 'Intensidad sin cambios',
      body: 'La intensidad que registraste se mantiene en el mismo nivel. Si lo deseas, puedes probar otra acción práctica o darte unos minutos más.',
    };
  } else {
    return {
      statusType: 'higher',
      deltaText: `Mayor que al inicio (+${Math.abs(diff)})`,
      headline: 'Intensidad mayor',
      body: 'La intensidad que registraste es mayor que al iniciar. Puede ser útil alejarte de pantallas y buscar un entorno cómodo o en compañía.',
    };
  }
}
