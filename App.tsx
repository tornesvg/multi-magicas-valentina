
import React, { useState, useEffect } from 'react';
import { AppState, Progress } from './types';
import MapView from './components/MapView';
import LearningView from './components/LearningView';
import QuizView from './components/QuizView';
import RewardScreen from './components/RewardScreen';
import ReviewView from './components/ReviewView';

const App: React.FC = () => {
  // Load saved progress
  const [progress, setProgress] = useState<Progress>(() => {
    const saved = localStorage.getItem('math_magic_progress_valentina');
    return saved ? JSON.parse(saved) : {
      unlockedTables: [1],
      masteredTables: [],
      stars: 0,
    };
  });

  // Load last session state (where Valentina was)
  const [view, setView] = useState<AppState>(() => {
    const lastView = localStorage.getItem('math_magic_last_view');
    // We only restore 'map' or 'learn' to avoid getting stuck in a quiz/reward flow unexpectedly
    return (lastView === 'learn' || lastView === 'map' || lastView === 'review') ? (lastView as AppState) : 'map';
  });

  const [selectedTable, setSelectedTable] = useState<number>(() => {
    const lastTable = localStorage.getItem('math_magic_last_table');
    return lastTable ? parseInt(lastTable, 10) : 1;
  });

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('math_magic_progress_valentina', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('math_magic_last_view', view);
    localStorage.setItem('math_magic_last_table', selectedTable.toString());
  }, [view, selectedTable]);

  // Inject animations to head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } }
      .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      .animate-shake { animation: shake 0.2s ease-in-out 3; }
    `;
    document.head.appendChild(style);
  }, []);

  const handleSelectTable = (table: number) => {
    setSelectedTable(table);
    setView('learn');
  };

  const handleFinishQuiz = (success: boolean) => {
    if (success) {
      setProgress(prev => {
        const isAlreadyMastered = prev.masteredTables.includes(selectedTable);
        const newMastered = isAlreadyMastered ? prev.masteredTables : [...prev.masteredTables, selectedTable];
        const nextTable = selectedTable + 1;
        const newUnlocked = (nextTable <= 10 && !prev.unlockedTables.includes(nextTable)) 
          ? [...prev.unlockedTables, nextTable] 
          : prev.unlockedTables;
        
        return {
          ...prev,
          masteredTables: newMastered,
          unlockedTables: newUnlocked,
          stars: prev.stars + (isAlreadyMastered ? 5 : 20),
        };
      });
      setView('reward');
    } else {
      setView('map');
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800">
      <header className="p-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 rounded-b-3xl">
        <h1 className="text-2xl font-magic font-bold text-pink-500 flex items-center gap-2">
          🌸 MultiMágicas de Valentina
        </h1>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-1 rounded-full border-2 border-yellow-300">
          <span className="text-xl">⭐</span>
          <span className="font-bold text-yellow-700">{progress.stars}</span>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 pb-24">
        {view === 'map' && (
          <MapView 
            progress={progress} 
            onSelectTable={handleSelectTable} 
            onStartReview={() => setView('review')}
          />
        )}
        {view === 'learn' && (
          <LearningView 
            table={selectedTable} 
            onBack={() => setView('map')} 
            onQuiz={() => setView('quiz')} 
          />
        )}
        {view === 'quiz' && (
          <QuizView 
            table={selectedTable} 
            onFinish={handleFinishQuiz} 
            onCancel={() => setView('map')}
          />
        )}
        {view === 'reward' && (
          <RewardScreen 
            table={selectedTable} 
            onContinue={() => setView('map')} 
          />
        )}
        {view === 'review' && (
          <ReviewView 
            masteredTables={progress.masteredTables}
            onFinish={() => setView('map')}
          />
        )}
      </main>

      {view === 'map' && progress.masteredTables.length > 0 && (
         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
            <button 
              onClick={() => setView('review')}
              className="w-full py-4 rounded-3xl shadow-xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-400 to-pink-400 text-white border-b-4 border-purple-600"
            >
              🦄 Repaso de Mis Logros
            </button>
         </div>
      )}
    </div>
  );
};

export default App;
