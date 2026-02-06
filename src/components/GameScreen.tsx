import { useState, useEffect, useCallback } from 'react';

type GamePhase = 'ready' | 'power' | 'direction' | 'shooting' | 'result';
type KickResult = 'goal' | 'saved' | 'missed' | null;

interface GameScreenProps {
  onGameEnd: (score: number) => void;
}

export default function GameScreen({ onGameEnd }: GameScreenProps) {
  const [phase, setPhase] = useState<GamePhase>('ready');
  const [power, setPower] = useState(0);
  const [direction, setDirection] = useState(50); // 0-100, 50 is center
  const [powerDirection, setPowerDirection] = useState(1);
  const [directionMovement, setDirectionMovement] = useState(1);
  const [shotsLeft, setShotsLeft] = useState(5);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<KickResult>(null);
  const [goalkeeperPosition, setGoalkeeperPosition] = useState(50);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 85 });
  const [showBallAnimation, setShowBallAnimation] = useState(false);

  // Power bar oscillation
  useEffect(() => {
    if (phase !== 'power') return;
    
    const interval = setInterval(() => {
      setPower(prev => {
        const newVal = prev + powerDirection * 2;
        if (newVal >= 100) {
          setPowerDirection(-1);
          return 100;
        }
        if (newVal <= 0) {
          setPowerDirection(1);
          return 0;
        }
        return newVal;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [phase, powerDirection]);

  // Direction arrow oscillation
  useEffect(() => {
    if (phase !== 'direction') return;
    
    const interval = setInterval(() => {
      setDirection(prev => {
        const newVal = prev + directionMovement * 3;
        if (newVal >= 100) {
          setDirectionMovement(-1);
          return 100;
        }
        if (newVal <= 0) {
          setDirectionMovement(1);
          return 0;
        }
        return newVal;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [phase, directionMovement]);

  const startKick = () => {
    setPhase('power');
    setPower(0);
    setPowerDirection(1);
  };

  const stopPower = useCallback(() => {
    if (phase === 'power') {
      setPhase('direction');
      setDirection(50);
      setDirectionMovement(1);
    }
  }, [phase]);

  const stopDirection = useCallback(() => {
    if (phase === 'direction') {
      setPhase('shooting');
      executeShot();
    }
  }, [phase, power, direction]);

  const executeShot = () => {
    // Randomize goalkeeper position (weighted towards center)
    const gkPos = Math.random() * 100;
    setGoalkeeperPosition(gkPos);

    // Animate ball
    setShowBallAnimation(true);
    
    // Calculate target position based on direction
    const targetX = direction;
    const targetY = 25; // Near the goal

    // Animate ball movement
    setTimeout(() => {
      setBallPosition({ x: targetX, y: targetY });
    }, 100);

    // Determine result after animation
    setTimeout(() => {
      determineResult(gkPos);
    }, 1000);
  };

  const determineResult = (gkPos: number) => {
    // Calculate if goalkeeper saves
    const gkReach = 25; // Goalkeeper can reach 25% on each side of their position
    const shotDirection = direction;
    
    // Check if shot is on target (not too high/wide based on power)
    const accuracy = power > 90 ? 0.6 : power > 70 ? 0.85 : 0.95;
    const isOnTarget = Math.random() < accuracy;
    
    if (!isOnTarget) {
      // Missed the goal
      setResult('missed');
    } else {
      // Check if goalkeeper saves
      const gkLeft = gkPos - gkReach;
      const gkRight = gkPos + gkReach;
      
      // Corners are harder to save
      const cornerBonus = shotDirection < 20 || shotDirection > 80 ? 15 : 0;
      const powerBonus = power > 70 ? 10 : 0;
      
      const adjustedGkLeft = gkLeft - cornerBonus - powerBonus;
      const adjustedGkRight = gkRight + cornerBonus + powerBonus;
      
      if (shotDirection > adjustedGkLeft && shotDirection < adjustedGkRight) {
        setResult('saved');
      } else {
        setResult('goal');
        setScore(prev => prev + 1);
      }
    }
    
    setPhase('result');
  };

  const nextShot = () => {
    const newShotsLeft = shotsLeft - 1;
    setShotsLeft(newShotsLeft);
    
    if (newShotsLeft <= 0) {
      // Game over
      setTimeout(() => {
        onGameEnd(result === 'goal' ? score : score);
      }, 500);
      return;
    }
    
    // Reset for next shot
    setResult(null);
    setBallPosition({ x: 50, y: 85 });
    setShowBallAnimation(false);
    setPhase('ready');
  };

  // Handle click/tap
  const handleClick = () => {
    switch (phase) {
      case 'ready':
        startKick();
        break;
      case 'power':
        stopPower();
        break;
      case 'direction':
        stopDirection();
        break;
      case 'result':
        nextShot();
        break;
    }
  };

  // Get goalkeeper animation position
  const getGoalkeeperStyle = () => {
    if (phase === 'shooting' || phase === 'result') {
      // Goalkeeper dives
      const diveDirection = goalkeeperPosition < 50 ? 'left' : 'right';
      
      return {
        transform: `translateX(${(goalkeeperPosition - 50) * 1.5}px) ${diveDirection === 'left' ? 'rotate(-30deg)' : 'rotate(30deg)'}`,
        transition: 'transform 0.3s ease-out'
      };
    }
    return {};
  };

  return (
    <div 
      className="w-full h-full flex flex-col relative overflow-hidden cursor-pointer select-none"
      onClick={handleClick}
    >
      {/* Stadium background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900/50 to-transparent h-1/3"></div>
      
      {/* Score display */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-20">
        <div className="bg-black/50 rounded-full px-4 py-2 flex items-center gap-2">
          <span className="text-white text-xl">⚽</span>
          <span className="text-white text-xl font-bold">{shotsLeft}</span>
        </div>
        <div className="bg-black/50 rounded-xl px-6 py-2">
          <span className="text-yellow-400 text-2xl font-bold">{score}</span>
          <span className="text-white text-lg"> / 5</span>
        </div>
      </div>

      {/* Field */}
      <div className="flex-1 relative grass-pattern">
        {/* Field lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Penalty area */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[70%] h-[35%] border-2 border-white/50"></div>
          {/* Goal area */}
          <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[35%] h-[15%] border-2 border-white/50"></div>
          {/* Penalty spot */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full"></div>
        </div>

        {/* Goal */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[40%] h-[20%]">
          {/* Goal posts */}
          <div className="absolute inset-0 border-4 border-white rounded-t-lg">
            {/* Net */}
            <div className="absolute inset-1 goal-net bg-gray-800/30"></div>
          </div>
          
          {/* Goalkeeper */}
          <div 
            className="absolute bottom-0 left-1/2 -translate-x-1/2 transition-transform duration-300"
            style={getGoalkeeperStyle()}
          >
            <div className="w-12 h-20 relative">
              {/* Goalkeeper body */}
              <div className="absolute bottom-0 w-full">
                {/* Head */}
                <div className="w-8 h-8 bg-amber-200 rounded-full mx-auto mb-1"></div>
                {/* Body */}
                <div className="w-10 h-10 bg-cyan-500 rounded-t-lg mx-auto"></div>
                {/* Arms */}
                <div className="absolute top-8 -left-2 w-4 h-8 bg-cyan-500 rounded-lg -rotate-12"></div>
                <div className="absolute top-8 -right-2 w-4 h-8 bg-cyan-500 rounded-lg rotate-12"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ball */}
        <div 
          className={`absolute w-8 h-8 transition-all duration-700 ${showBallAnimation ? 'ease-out' : ''}`}
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="w-full h-full rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="3"/>
              <polygon points="50,20 58,35 50,42 42,35" fill="#333"/>
              <polygon points="70,45 78,55 70,65 60,60 60,50" fill="#333"/>
              <polygon points="30,45 22,55 30,65 40,60 40,50" fill="#333"/>
            </svg>
          </div>
        </div>

        {/* Player */}
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
          <div className="w-16 h-24 relative">
            {/* Head */}
            <div className="w-10 h-10 bg-amber-300 rounded-full mx-auto"></div>
            {/* Hair */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-5 bg-yellow-600 rounded-t-full"></div>
            {/* Body */}
            <div className="w-12 h-8 bg-red-500 rounded-lg mx-auto mt-1"></div>
            {/* Shorts */}
            <div className="w-10 h-4 bg-blue-600 mx-auto"></div>
            {/* Legs */}
            <div className="flex justify-center gap-2">
              <div className="w-3 h-8 bg-amber-200 rounded-b-lg"></div>
              <div className="w-3 h-8 bg-amber-200 rounded-b-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls area */}
      <div className="h-32 bg-gradient-to-t from-black to-transparent p-4">
        {/* Power bar */}
        {(phase === 'power' || phase === 'direction' || phase === 'shooting') && (
          <div className="mb-4">
            <div className="text-white text-sm mb-1 text-center">
              {phase === 'power' ? 'POWER - Tap to stop!' : `Power: ${power}%`}
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden relative">
              <div 
                className="h-full power-bar transition-all duration-75"
                style={{ width: `${power}%` }}
              ></div>
              {phase === 'power' && (
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
                  style={{ left: `${power}%` }}
                ></div>
              )}
            </div>
          </div>
        )}

        {/* Direction indicator */}
        {(phase === 'direction' || phase === 'shooting') && (
          <div>
            <div className="text-white text-sm mb-1 text-center">
              {phase === 'direction' ? 'AIM - Tap to shoot!' : `Direction: ${direction < 40 ? 'Left' : direction > 60 ? 'Right' : 'Center'}`}
            </div>
            <div className="h-6 bg-gray-800 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-between px-2 text-xs text-gray-500">
                <span>←</span>
                <span>|</span>
                <span>→</span>
              </div>
              <div 
                className="absolute top-1 bottom-1 w-4 h-4 bg-yellow-400 rounded-full shadow-lg transition-all duration-75"
                style={{ left: `calc(${direction}% - 8px)` }}
              ></div>
            </div>
          </div>
        )}

        {/* Ready state */}
        {phase === 'ready' && (
          <div className="text-center">
            <p className="text-yellow-400 text-2xl font-bold animate-pulse">
              Tap to kick!
            </p>
          </div>
        )}

        {/* Result */}
        {phase === 'result' && (
          <div className="text-center">
            <p className={`text-4xl font-bold ${
              result === 'goal' ? 'text-green-400' : 
              result === 'saved' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {result === 'goal' ? '⚽ GOAL!' : 
               result === 'saved' ? '🧤 SAVED!' : '❌ MISSED!'}
            </p>
            <p className="text-white mt-2">Tap to continue</p>
          </div>
        )}
      </div>
    </div>
  );
}
