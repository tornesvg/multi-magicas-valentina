
import React, { useEffect, useState } from 'react';
import { getMagicExplanation } from '../services/geminiService';

interface LearningViewProps {
  table: number;
  onBack: () => void;
  onQuiz: () => void;
}

const LearningView: React.FC<LearningViewProps> = ({ table, onBack, onQuiz }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loadingExplanation, setLoadingExplanation] = useState(true);

  useEffect(() => {
    async function load() {
      const exp = await getMagicExplanation(table, 5); // Example explanation
      setExplanation(exp);
      setLoadingExplanation(false);
    }
    load();
  }, [table]);

  return (
    <div className="flex flex-col items-center gap-6 animate-fadeIn">
      <div className="w-full flex justify-between items-center">
        <button onClick={onBack} className="bg-white p-3 rounded-2xl shadow-sm text-2xl">🔙</button>
        <h2 className="text-3xl font-magic text-pink-500">Tabla del {table}</h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-white w-full rounded-3xl shadow-xl p-8 border-4 border-pink-100">
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
            <div key={num} className="flex justify-between items-center text-2xl font-bold p-2 rounded-xl hover:bg-pink-50 transition-colors">
              <span className="text-purple-400">{table} x {num}</span>
              <span className="text-gray-300">=</span>
              <span className="text-pink-500 bg-pink-50 px-4 py-1 rounded-full shadow-inner">{table * num}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-100 shadow-sm w-full italic text-blue-600 text-center">
        <div className="text-3xl mb-2">🧚‍♀️</div>
        {loadingExplanation ? (
          <p className="animate-pulse">Consultando al hada de los números...</p>
        ) : (
          <p>{explanation}</p>
        )}
      </div>

      <button 
        onClick={onQuiz}
        className="w-full py-5 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-3xl shadow-lg font-bold text-xl hover:scale-105 active:scale-95 transition-all"
      >
        ✨ ¡Lista para el Reto Mágico! ✨
      </button>
    </div>
  );
};

export default LearningView;
