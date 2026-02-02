
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Question } from '../types';

interface ReviewViewProps {
  masteredTables: number[];
  onFinish: () => void;
}

const ReviewView: React.FC<ReviewViewProps> = ({ masteredTables, onFinish }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const questions = useMemo<Question[]>(() => {
    if (masteredTables.length === 0) return [];
    
    const count = 10;
    const arr = [];
    for(let i = 0; i < count; i++) {
      const table = masteredTables[Math.floor(Math.random() * masteredTables.length)];
      const factorB = Math.floor(Math.random() * 10) + 1;
      const answer = table * factorB;
      const options = new Set<number>([answer]);
      while (options.size < 4) {
        options.add(Math.max(1, answer + Math.floor(Math.random() * 10) - 5));
      }
      arr.push({
        factorA: table,
        factorB,
        answer,
        options: Array.from(options).sort(() => Math.random() - 0.5)
      });
    }
    return arr;
  }, [masteredTables]);

  const currentQuestion = questions[currentIdx];

  const handleOptionClick = useCallback((option: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    
    const correct = option === currentQuestion.answer;
    if (!correct) {
      setIsWrong(true);
      setTimeout(() => {
        setIsWrong(false);
        setSelectedOption(null);
      }, 1000);
    } else {
      setTimeout(() => {
        if (currentIdx < questions.length - 1) {
          setCurrentIdx(prev => prev + 1);
          setSelectedOption(null);
          setTranscript('');
        } else {
          onFinish();
        }
      }, 600);
    }
  }, [currentIdx, currentQuestion.answer, questions.length, onFinish, selectedOption]);

  // Speech Recognition Logic
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || questions.length === 0) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      const cleanTranscript = currentTranscript.toLowerCase().trim();
      setTranscript(cleanTranscript);

      const words = cleanTranscript.split(' ');
      words.forEach(word => {
        const num = parseInt(word, 10);
        if (!isNaN(num) && num === currentQuestion.answer) {
          handleOptionClick(num);
        }
      });
    };

    if (isListening) recognition.start();
    else recognition.stop();

    return () => recognition.stop();
  }, [isListening, currentQuestion?.answer, handleOptionClick, questions.length]);

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl shadow-lg border-2 border-pink-100">
        <p className="text-xl text-pink-500 font-bold">¡Aún no has dominado ninguna tabla, Valentina!</p>
        <button onClick={onFinish} className="mt-4 text-purple-400 font-bold underline">Volver al mapa</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 py-4 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-3xl font-magic text-purple-600">🌈 Repaso de Valentina</h2>
        <p className="text-pink-400">¡Mezclamos tus tablas mágicas!</p>
      </div>

      <div className="w-full flex justify-between items-center text-pink-500 font-bold">
        <span>Pregunta {currentIdx + 1}/10</span>
        <button onClick={onFinish} className="text-xs uppercase bg-white px-3 py-1 rounded-lg border">Salir</button>
      </div>

      <div className={`
        bg-white w-full rounded-[3rem] shadow-2xl p-10 text-center border-b-8 border-purple-100 transition-transform relative
        ${isWrong ? 'animate-shake bg-red-50' : ''}
      `}>
        {isListening && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">
            🧚‍♀️ Escuchando tu voz...
          </div>
        )}

        <div className="text-6xl font-magic font-bold mb-8 flex justify-center items-center gap-4">
          <span className="text-pink-400">{currentQuestion.factorA}</span>
          <span className="text-gray-300 text-4xl">x</span>
          <span className="text-blue-400">{currentQuestion.factorB}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              disabled={selectedOption !== null}
              onClick={() => handleOptionClick(opt)}
              className={`
                h-20 text-3xl font-bold rounded-2xl shadow-md transition-all
                ${selectedOption === opt 
                  ? (opt === currentQuestion.answer ? 'bg-green-400 text-white scale-110' : 'bg-red-400 text-white')
                  : 'bg-purple-50 text-purple-500 hover:bg-purple-100'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsListening(!isListening)}
        className={`
          flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95
          ${isListening 
            ? 'bg-purple-500 text-white animate-pulse' 
            : 'bg-white text-purple-500 border-2 border-purple-100'
          }
        `}
      >
        <span className="text-2xl">{isListening ? '🛑' : '🎤'}</span>
        {isListening ? 'Te escucho, Valentina' : 'Usar mi voz mágica'}
      </button>
    </div>
  );
};

export default ReviewView;
