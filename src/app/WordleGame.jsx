'use client'

import React, { useState, useEffect } from 'react';

// Add to your CSS (or Tailwind config)
// Include this in your layout or root component
<style jsx global>{`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap');
  
  .noise-bg {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%),
      url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    backdrop-filter: blur(4px);
  }

  @keyframes flip {
    0% { transform: rotateX(0deg); }
    50% { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }

  .flip-animation {
    animation: flip 0.6s ease-in-out;
  }
`}</style>

const Grid = ({ guesses, getCellStatus }) => {
  return (
    <div className="grid grid-rows-6 grid-cols-5 gap-2 mb-8">
      {guesses.map((row, rowIndex) =>
        row.map((letter, cellIndex) => {
          const status = getCellStatus(rowIndex, cellIndex);
          let bgColor = 'bg-white';
          if (status === 'correct') bgColor = 'bg-green-600';
          else if (status === 'present') bgColor = 'bg-yellow-500';

          return (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className={`w-16 h-16 border-2 border-slate-300 rounded-lg flex items-center justify-center text-3xl font-bold uppercase 
                ${bgColor} text-black transition-all duration-200 flip-animation`}
            >
              {letter}
            </div>
          );
        })
      )}
    </div>
  );
};

const WordleGame = () => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill().map(() => Array(5).fill('')));
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing');

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const response = await fetch('https://random-word-api.herokuapp.com/word?length=5');
        const data = await response.json();
        const word = data[0].toUpperCase();
        setTargetWord(word);
      } catch (error) {
        console.error('Error fetching word:', error);
      }
    };

    fetchWord();
  }, []); // Remove localStorage to get new word on refresh

  const getStatuses = (guess, target) => {
    const statuses = Array(5).fill('absent');
    const targetLetters = target.split('');
    const freq = targetLetters.reduce((acc, char) => {
      acc[char] = (acc[char] || 0) + 1;
      return acc;
    }, {});

    // First pass: mark correct letters
    guess.forEach((char, i) => {
      if (char === targetLetters[i]) {
        statuses[i] = 'correct';
        freq[char]--;
      }
    });

    // Second pass: mark present letters
    guess.forEach((char, i) => {
      if (statuses[i] === 'correct') return;
      if (freq[char] > 0) {
        statuses[i] = 'present';
        freq[char]--;
      }
    });

    return statuses;
  };

  const getCellStatus = (rowIndex, colIndex) => {
    if (rowIndex >= currentRow) return '';
    const guess = guesses[rowIndex].join('');
    return getStatuses(guess.split(''), targetWord)[colIndex];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') return;

      const key = e.key.toUpperCase();
      
      if (key === 'BACKSPACE') {
        if (currentCol > 0) {
          const newGuesses = [...guesses];
          newGuesses[currentRow][currentCol - 1] = '';
          setGuesses(newGuesses);
          setCurrentCol(currentCol - 1);
        }
      }
      else if (key === 'ENTER') {
        if (currentCol === 5) {
          const guess = guesses[currentRow].join('');
          if (guess === targetWord) {
            setGameStatus('won');
          } else if (currentRow === 5) {
            setGameStatus('lost');
          } else {
            setCurrentRow(r => r + 1);
            setCurrentCol(0);
          }
        }
      }
      else if (/^[A-Z]$/.test(key)) {
        if (currentCol < 5) {
          const newGuesses = [...guesses];
          newGuesses[currentRow][currentCol] = key;
          setGuesses(newGuesses);
          setCurrentCol(c => c + 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRow, currentCol, gameStatus, guesses, targetWord]);

  return (
    <div className="min-h-screen noise-bg flex items-start justify-center pt-16 font-['Inter']">
      <div className="container mx-auto p-6 max-w-lg bg-gradient-to-r from-white to-gray-200 backdrop-blur-lg rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-slate-800">WORDLE</h1>
        <Grid guesses={guesses} getCellStatus={getCellStatus} />
        
        {gameStatus === 'won' && (
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-green-600 mb-2">
              🎉 You guessed the word correctly!
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
        
        {gameStatus === 'lost' && (
          <div className="text-center py-4">
            <div className="text-2xl font-bold text-red-600 mb-2">
              Game over! The word was: {targetWord}
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-8 text-center text-slate-600">
          <p>Use keyboard to type letters</p>
          <div className="flex justify-center gap-2 mt-4">
            <kbd className="kbd">←</kbd>
            <kbd className="kbd">ENTER</kbd>
            <kbd className="kbd">⌫</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordleGame;