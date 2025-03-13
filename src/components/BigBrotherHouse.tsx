
import React, { useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

// Improved house component with better Three.js practices
const BigBrotherHouse: React.FC = () => {  
  // Use React's useMemo to create geometries and materials only once
  const [
    foundationGeometry, 
    foundationMaterial,
    mainGeometry,
    mainMaterial,
    roofGeometry,
    roofMaterial,
    doorGeometry,
    doorMaterial,
    windowGeometry,
    windowMaterial
  ] = useMemo(() => [
    new THREE.BoxGeometry(22, 0.2, 32),
    new THREE.MeshStandardMaterial({ color: "#7B7B7B" }),
    new THREE.BoxGeometry(20, 5, 30),
    new THREE.MeshStandardMaterial({ color: "#A0A0A0" }),
    new THREE.BoxGeometry(21, 1, 31),
    new THREE.MeshStandardMaterial({ color: "#5D4037" }),
    new THREE.BoxGeometry(2, 3, 0.1),
    new THREE.MeshStandardMaterial({ color: "#8B4513" }),
    new THREE.BoxGeometry(1.5, 1.5, 0.1),
    new THREE.MeshStandardMaterial({ 
      color: "#B5D3E7", 
      transparent: true, 
      opacity: 0.7 
    })
  ], []);

  // Create window positions
  const windowPositions = useMemo(() => {
    return [-7, -3.5, 0, 3.5, 7].map(x => new THREE.Vector3(x, 3, 15.01));
  }, []);

  return (
    <group position={[0, 0, -15]}>
      {/* Foundation */}
      <mesh position={[0, -0.1, 0]} receiveShadow geometry={foundationGeometry} material={foundationMaterial} />
      
      {/* Main structure */}
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow geometry={mainGeometry} material={mainMaterial} />
      
      {/* Roof */}
      <mesh position={[0, 5.5, 0]} castShadow geometry={roofGeometry} material={roofMaterial} />
      
      {/* Front door */}
      <mesh position={[0, 1.5, 15.01]} castShadow geometry={doorGeometry} material={doorMaterial} />
      
      {/* Windows */}
      {windowPositions.map((position, i) => (
        <mesh key={i} position={position} castShadow geometry={windowGeometry} material={windowMaterial} />
      ))}
      
      {/* House label - rendered as a sprite for better performance */}
      <Text 
        position={[0, 6.5, 0]} 
        fontSize={1.2}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        Big Brother House
      </Text>
    </group>
  );
};

export default BigBrotherHouse;
