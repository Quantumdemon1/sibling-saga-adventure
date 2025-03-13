
import React from 'react';
import { useThree } from '@react-three/fiber';

const SceneLights: React.FC = () => {
  const { scene } = useThree();
  
  // Enable shadows in the scene
  useThree(({ gl }) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = 4; // PCFSoftShadowMap
  });

  return (
    <>
      {/* Ambient light provides overall illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light with shadows */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Fill light from the opposite side */}
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />
    </>
  );
};

export default SceneLights;
