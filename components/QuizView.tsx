
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Question } from '../types';

interface QuizViewProps {
  table: number;
  onFinish: (success: boolean) => void;
  onCancel: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ table, onFinish, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const questions = useMemo<Question[]>(() => {
    return Array.from({ length: 10 }, (_, i) => i + 1)
      .sort(() => Math.random() - 0.5)
      .map(num => {
        const answer = table * num;
        const options = new Set<number>([answer]);
        while (options.size < 4) {
          const fake = Math.max(1, answer + Math.floor(Math.random() * 10) - 5);
          if (fake > 0) options.add(fake);
        }
        return {
          factorA: table,
          factorB: num,
          answer,
          options: Array.from(options).sort(() => Math.random() - 0.5)
        };
      });
  }, [table]);

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
          onFinish(true);
        }
      }, 600);
    }
  }, [currentIdx, currentQuestion.answer, questions.length, onFinish, selectedOption]);

  // Speech Recognition Logic
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

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

      // Try to find a number in the transcript
      const words = cleanTranscript.split(' ');
      const numberMap: { [key: string]: number } = {
        'cero': 0, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 
        'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
        'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15,
        'veinte': 20, 'treinta': 30, 'cuarenta': 40, 'cincuenta': 50,
        'sesenta': 60, 'setenta': 70, 'ochenta': 80, 'noventa': 90, 'cien': 100
      };

      // Check for direct digit match or word match
      words.forEach(word => {
        const num = parseInt(word, 10);
        if (!isNaN(num) && num === currentQuestion.answer) {
          handleOptionClick(num);
        } else if (numberMap[word] === currentQuestion.answer) {
          handleOptionClick(numberMap[word]);
        }
      });
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => recognition.stop();
  }, [isListening, currentQuestion.answer, handleOptionClick]);

  const progressPercent = (currentIdx / questions.length) * 100;

  return (
    <div className="flex flex-col items-center gap-8 py-4 animate-fadeIn">
      <div className="w-full flex justify-between items-center">
        <button onClick={onCancel} className="bg-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm">Rendirse</button>
        <div className="flex-1 mx-8 h-3 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-400 transition-all duration-500" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="font-bold text-pink-500">{currentIdx + 1}/{questions.length}</span>
      </div>

      <div className={`
        bg-white w-full rounded-[3rem] shadow-2xl p-10 text-center border-b-8 border-pink-100 transition-transform relative
        ${isWrong ? 'animate-shake bg-red-50' : ''}
      `}>
        {isListening && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">
            🧚‍♀️ Valentina, te escucho...
          </div>
        )}

        <div className="text-6xl font-magic font-bold mb-8 flex justify-center items-center gap-4">
          <span className="text-purple-400">{currentQuestion.factorA}</span>
          <span className="text-gray-300 text-4xl">x</span>
          <span className="text-blue-400">{currentQuestion.factorB}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              disabled={selectedOption !== null}
              onClick={() => handleOptionClick(opt)}
              className={`
                h-20 text-3xl font-bold rounded-2xl shadow-md transition-all
                ${selectedOption === opt 
                  ? (opt === currentQuestion.answer ? 'bg-green-400 text-white scale-110' : 'bg-red-400 text-white')
                  : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>

        {transcript && (
          <div className="text-pink-300 text-sm font-medium italic mt-2">
            Dijiste: "{transcript}"
          </div>
        )}
      </div>

      <button
        onClick={() => setIsListening(!isListening)}
        className={`
          flex items-center gap-3 px-8 py-4 rounded-full font-bold shadow-lg transition-all active:scale-95
          ${isListening 
            ? 'bg-blue-500 text-white animate-pulse' 
            : 'bg-white text-blue-500 border-2 border-blue-100'
          }
        `}
      >
        <span className="text-2xl">{isListening ? '🛑' : '🎤'}</span>
        {isListening ? '¡Te estoy escuchando!' : '¡Dime la respuesta!'}
      </button>

      <div className="text-gray-400 font-medium">
        ¡Valentina, tú puedes con todo! 🌈
      </div>
    </div>
  );
};

export default QuizView;
