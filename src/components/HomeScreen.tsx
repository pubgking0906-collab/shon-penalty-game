interface HomeScreenProps {
  onStart: () => void;
}

export default function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 via-green-800 to-green-950 relative overflow-hidden">
      {/* Stadium lights effect */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl"></div>
      
      {/* Crowd silhouette */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-900/50 to-transparent"></div>
      
      {/* Soccer ball icon */}
      <div className="mb-8 animate-bounce-slow">
        <div className="w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center relative">
          {/* Soccer ball pattern */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="white" stroke="#333" strokeWidth="2"/>
            <polygon points="50,15 62,35 50,45 38,35" fill="#333"/>
            <polygon points="75,40 85,55 75,70 60,65 60,45" fill="#333"/>
            <polygon points="25,40 15,55 25,70 40,65 40,45" fill="#333"/>
            <polygon points="35,75 50,85 65,75 60,60 40,60" fill="#333"/>
          </svg>
        </div>
      </div>
      
      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 text-center drop-shadow-lg">
        PENALTY
      </h1>
      <h2 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-8 text-center drop-shadow-lg">
        KICK MASTER
      </h2>
      
      {/* Subtitle */}
      <p className="text-xl text-gray-300 mb-12 text-center px-4">
        5 shots. Beat the goalkeeper. Become a legend!
      </p>
      
      {/* Start button */}
      <button
        onClick={onStart}
        className="px-12 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-3xl font-bold rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
      >
        ⚽ START GAME
      </button>
      
      {/* Instructions */}
      <div className="absolute bottom-8 text-gray-400 text-center px-4">
        <p>Click or tap to stop the power bar and aim arrow</p>
      </div>
    </div>
  );
}
