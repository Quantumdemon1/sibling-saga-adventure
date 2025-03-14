
import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const SceneLights: React.FC = () => {
  const { scene } = useThree();
  
  // Configure shadow maps with better performance settings
  useThree(({ gl }) => {
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFShadowMap; // Less expensive than PCFSoftShadowMap
    gl.outputEncoding = THREE.sRGBEncoding;
  });

  return (
    <>
      {/* Ambient light provides overall illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light with shadows - reduced shadow map size */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
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
