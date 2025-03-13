
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { startGame } = useGameContext();
  const [isHovering, setIsHovering] = useState(false);

  const handleStartGame = () => {
    startGame();
    navigate('/game');
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black text-white">
      {/* Background animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-game-bg via-black to-gray-900 opacity-80" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0yNS45IDI1LjlDMjUuOSAyNC4zIDI0LjMgMjUuOSAyNS45IDI1LjkiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-10" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
        {/* Game title with animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="game-chip bg-game-accent mb-3">Welcome to</div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-2">
            Big Brother RPG
          </h1>
          <p className="text-xl text-game-secondary max-w-lg mx-auto">
            Strategy. Alliances. Betrayal. Only one houseguest will emerge victorious.
          </p>
        </motion.div>
        
        {/* Game features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 w-full max-w-4xl"
        >
          {[
            {
              title: "Compete",
              description: "Win competitions to secure power and control nominations."
            },
            {
              title: "Strategize",
              description: "Form alliances, manipulate votes, and outsmart your opponents."
            },
            {
              title: "Survive",
              description: "Navigate weekly evictions and be the last houseguest standing."
            }
          ].map((feature, i) => (
            <div key={i} className="glass-panel p-6">
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-game-secondary">{feature.description}</p>
            </div>
          ))}
        </motion.div>
        
        {/* Start game button with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center"
        >
          <motion.button
            className="game-button text-lg px-8 py-4"
            onClick={handleStartGame}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter the House
          </motion.button>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 10 }}
            transition={{ duration: 0.3 }}
            className="mt-4 text-game-secondary text-sm"
          >
            Are you ready for the ultimate social strategy game?
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
