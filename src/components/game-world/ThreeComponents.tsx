
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stats, PerspectiveCamera } from '@react-three/drei';
import GameScene from './GameScene';
import LoadingScreen from './LoadingScreen';
import Player from '../Player';
import SceneLights from '../SceneLights';
import NPCsContainer from '../NPCsContainer';
import Ground from './Ground';
import useGameStateStore from '@/stores/gameStateStore';
import PhaseVisualizer from '../phase-visualizations/PhaseVisualizer';
import GamePhaseElements from './GamePhaseElements';

// WebGL error handler component
const WebGLErrorHandler = () => {
  const { gl } = useThree();
  
  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.log("WebGL context lost - attempting recovery");
    };
    
    const handleContextRestored = () => {
      console.log("WebGL context restored");
    };
    
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);
  
  return null;
};

const ThreeComponents: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [debug, setDebug] = useState(false);
  const [canvasError, setCanvasError] = useState<Error | null>(null);
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const controlsRef = useRef<any>(null);
  const { currentPhase, setOverlay } = useGameStateStore();
  
  // Delayed mounting to ensure browser is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCanvasReady(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        setDebug(prev => !prev);
      }
      
      if (e.key === 'Escape') {
        setIsLocked(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLock = () => {
    setIsLocked(true);
  };

  const handleCanvasError = (error: any) => {
    console.error("Canvas render error:", error);
    setCanvasError(error);
  };

  if (canvasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg">
        <div className="bg-black bg-opacity-70 p-6 rounded-lg text-white max-w-md">
          <h3 className="text-xl mb-4">3D Rendering Error</h3>
          <p className="mb-4">
            There was an error rendering the 3D environment. 
            This could be due to WebGL issues or browser compatibility.
          </p>
          <button 
            onClick={() => setCanvasError(null)}
            className="px-4 py-2 bg-game-accent text-white rounded hover:bg-game-accent-hover"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!isCanvasReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-game-bg">
        <div className="text-white">Initializing 3D environment...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance', 
          failIfMajorPerformanceCaveat: false,
          depth: true,
          stencil: false
        }}
        dpr={window.devicePixelRatio}
        onClick={handleLock}
        frameloop="demand"
        onError={handleCanvasError}
        performance={{ min: 0.5 }}
      >
        <WebGLErrorHandler />
        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#87CEEB', 30, 100]} />
        
        <Suspense fallback={<LoadingScreen />}>
          <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
          
          <OrbitControls 
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            enableRotate={isLocked}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2}
            minDistance={2}
            maxDistance={50}
          />
          
          <SceneLights />
          
          <GameScene />
          
          <Ground size={[100, 100]} />
          
          <PhaseVisualizer />
          
          <NPCsContainer />
          
          <GamePhaseElements 
            currentPhase={currentPhase} 
            setOverlay={setOverlay} 
          />
          
          <Player controls={controlsRef} />
          
          {debug && <Stats />}
        </Suspense>
      </Canvas>
      
      <div className="absolute bottom-4 left-4 right-4 flex justify-center z-40">
        <div className="bg-black bg-opacity-70 p-2 rounded text-center transition-opacity duration-300 hover:opacity-100 opacity-70">
          <div className="text-white text-sm font-bold mb-1">Controls</div>
          <div className="flex gap-4 text-xs text-white justify-center flex-wrap">
            <div>WASD: Move</div>
            <div>SHIFT: Run</div>
            <div>SPACE: Jump</div>
            <div>E: Interact</div>
            <div>ESC: Unlock Mouse</div>
            <div>F3: Debug</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeComponents;
