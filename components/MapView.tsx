
import React from 'react';
import { Progress } from '../types';
import { TABLE_CONFIG } from '../constants';

interface MapViewProps {
  progress: Progress;
  onSelectTable: (table: number) => void;
  onStartReview: () => void;
}

const MapView: React.FC<MapViewProps> = ({ progress, onSelectTable, onStartReview }) => {
  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-magic text-purple-600">¡Hola, Valentina!</h2>
        <p className="text-pink-400 font-medium">¿Qué tabla quieres conquistar hoy?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
        {TABLE_CONFIG.map((num) => {
          const isUnlocked = progress.unlockedTables.includes(num);
          const isMastered = progress.masteredTables.includes(num);

          return (
            <button
              key={num}
              disabled={!isUnlocked}
              onClick={() => onSelectTable(num)}
              className={`
                relative h-32 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all
                ${isUnlocked 
                  ? 'bg-white shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95' 
                  : 'bg-gray-200 opacity-60 cursor-not-allowed'
                }
                border-b-8 border-r-4 ${isUnlocked ? (isMastered ? 'border-green-400' : 'border-pink-200') : 'border-gray-300'}
              `}
            >
              {isMastered && (
                <div className="absolute -top-3 -right-3 bg-yellow-400 w-10 h-10 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  ⭐
                </div>
              )}
              
              {!isUnlocked ? (
                <span className="text-4xl">🔒</span>
              ) : (
                <>
                  <span className="text-4xl font-magic font-bold text-pink-500">
                    {num}
                  </span>
                  <span className="text-xs uppercase font-bold text-pink-300">Tabla del {num}</span>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-white p-6 rounded-3xl shadow-md border-2 border-pink-100 w-full text-center">
        <h3 className="font-magic text-xl text-purple-500 mb-2">Tu progreso</h3>
        <div className="w-full bg-pink-100 h-6 rounded-full overflow-hidden border-2 border-pink-200">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-1000" 
            style={{ width: `${(progress.masteredTables.length / 10) * 100}%` }}
          />
        </div>
        <p className="text-pink-400 text-sm mt-2 font-bold">
          {progress.masteredTables.length} de 10 tablas dominadas
        </p>
      </div>
    </div>
  );
};

export default MapView;
