
export type AppState = 'map' | 'learn' | 'quiz' | 'reward' | 'review';

export interface Progress {
  unlockedTables: number[];
  masteredTables: number[];
  stars: number;
}

export interface Question {
  factorA: number;
  factorB: number;
  answer: number;
  options: number[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}
