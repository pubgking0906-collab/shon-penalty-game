import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';

export type GameState = 'home' | 'playing' | 'gameOver';

function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [finalScore, setFinalScore] = useState(0);

  const startGame = () => {
    setGameState('playing');
    setFinalScore(0);
  };

  const endGame = (score: number) => {
    setFinalScore(score);
    setGameState('gameOver');
  };

  const goHome = () => {
    setGameState('home');
  };

  return (
    <div className="w-full h-full">
      {gameState === 'home' && (
        <HomeScreen onStart={startGame} />
      )}
      {gameState === 'playing' && (
        <GameScreen onGameEnd={endGame} />
      )}
      {gameState === 'gameOver' && (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-green-800 to-green-950">
          <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Game Over!
          </h1>
          <p className="text-4xl text-yellow-400 mb-8">
            Score: {finalScore} / 5
          </p>
          <div className="flex gap-4">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Play Again
            </button>
            <button
              onClick={goHome}
              className="px-8 py-4 bg-gray-600 hover:bg-gray-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all"
            >
              Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
