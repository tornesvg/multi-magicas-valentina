
import React, { useEffect, useState } from 'react';
import { getMotivationalMessage } from '../services/geminiService';

interface RewardScreenProps {
  table: number;
  onContinue: () => void;
}

const RewardScreen: React.FC<RewardScreenProps> = ({ table, onContinue }) => {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    async function load() {
      const text = await getMotivationalMessage("Valentina", "Excelente dominando la tabla del " + table);
      setMsg(text);
    }
    load();
  }, [table]);

  return (
    <div className="fixed inset-0 z-[100] bg-pink-400 flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
      <div className="text-9xl mb-8 animate-bounce">🏆</div>
      <h2 className="text-4xl font-magic font-bold text-white mb-4">
        ¡TABLA DEL {table} DOMINADA!
      </h2>
      
      <div className="bg-white/20 backdrop-blur-md p-6 rounded-3xl border-2 border-white/30 text-white text-xl italic mb-12">
        "{msg}"
      </div>

      <div className="flex gap-4 mb-8">
        <div className="text-4xl animate-pulse">⭐</div>
        <div className="text-4xl animate-pulse delay-75">⭐</div>
        <div className="text-4xl animate-pulse delay-150">⭐</div>
        <div className="text-4xl animate-pulse delay-200">⭐</div>
        <div className="text-4xl animate-pulse delay-300">⭐</div>
      </div>

      <button
        onClick={onContinue}
        className="w-full max-w-sm py-5 bg-white text-pink-500 rounded-3xl shadow-xl font-bold text-2xl hover:scale-105 active:scale-95 transition-all"
      >
        ¡Siguiente Aventura, Valentina! 🚀
      </button>
    </div>
  );
};

export default RewardScreen;
