
import React from 'react';

export const COLORS = {
  primary: 'bg-pink-400',
  secondary: 'bg-purple-400',
  accent: 'bg-yellow-300',
  success: 'bg-green-400',
  background: 'bg-pink-50',
};

export const ACHIEVEMENTS = [
  { id: 'tabla1', title: 'Hada Valentina del 1', description: '¡Dominaste la tabla del 1!', icon: '🌸' },
  { id: 'tabla2', title: 'Valentina, Estrella del 2', description: '¡Dominaste la tabla del 2!', icon: '⭐' },
  { id: 'tabla3', title: 'Valentina, Reina del 3', description: '¡Dominaste la tabla del 3!', icon: '👑' },
  { id: 'tabla4', title: 'Maga Valentina del 4', description: '¡Dominaste la tabla del 4!', icon: '🪄' },
  { id: 'tabla5', title: 'Valentina, Princesa del 5', description: '¡Dominaste la tabla del 5!', icon: '🎀' },
];

export const TABLE_CONFIG = Array.from({ length: 10 }, (_, i) => i + 1);

export const ICONS = {
  Star: () => <span className="text-yellow-400">⭐</span>,
  Heart: () => <span className="text-red-400">❤️</span>,
  Sparkle: () => <span className="text-blue-300">✨</span>,
  Check: () => <span className="text-green-500">✅</span>,
  Wrong: () => <span className="text-red-500">❌</span>,
};
