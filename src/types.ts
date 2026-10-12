export type Emotion = 
  | 'Ansiedad' 
  | 'Aburrimiento' 
  | 'Estrés o frustración' 
  | 'Soledad';

export type Location = 
  | 'Solo en mi habitación' 
  | 'En otra parte de casa' 
  | 'Fuera de casa';

export interface ActionPlanItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  interactiveType?: 'breathing' | 'timer' | 'grounding';
  timerMinutes?: number;
}

export interface UserAssessment {
  emotion: Emotion;
  location: Location;
  initialIntensity: number; // 1 to 10
}

export interface SessionData {
  assessment: UserAssessment;
  completedActions: string[];
  currentIntensity: number; // 0 to 10
  variationIndex: number;
}
