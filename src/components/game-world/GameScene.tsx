
import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import House from '../House';
import BigBrotherHouse from '../BigBrotherHouse';
import useGameStateStore from '@/stores/gameStateStore';

const GameScene: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  const [dayNightCycle, setDayNightCycle] = useState(0.5); // 0 = night, 1 = day
  
  // Use dayNightCycle based on game phase
  useEffect(() => {
    if (currentPhase === 'hohCompetition') {
      setDayNightCycle(0.8); // bright day for competitions
    } else if (currentPhase === 'nominationCeremony') {
      setDayNightCycle(0.6); // evening for nominations
    } else if (currentPhase === 'evictionVoting') {
      setDayNightCycle(0.3); // night for evictions
    } else {
      setDayNightCycle(0.7); // default day
    }
  }, [currentPhase]);
  
  // Create tree positions and geometries using useMemo to prevent recreating on each render
  const treeData = useMemo(() => {
    return [[-10, -10], [10, -10], [-15, 15], [15, 15], [-20, 0], [20, 0]];
  }, []);

  // Create clouds
  const cloudData = useMemo(() => {
    return Array(8).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 60,
        10 + Math.random() * 5,
        (Math.random() - 0.5) * 60
      ],
      rotation: Math.random() * Math.PI,
      scale: 1 + Math.random() * 2,
      speed: 0.01 + Math.random() * 0.02
    }));
  }, []);
  
  // Animate clouds
  useFrame(({ clock }) => {
    const cloudsGroup = document.getElementById('clouds-group');
    if (cloudsGroup) {
      const clouds = cloudsGroup.children;
      for (let i = 0; i < clouds.length; i++) {
        const cloud = clouds[i] as unknown as THREE.Mesh;
        cloud.position.x += cloudData[i].speed;
        if (cloud.position.x > 40) cloud.position.x = -40;
      }
    }
  });

  // Render trees with safer implementation
  const renderTrees = () => {
    return treeData.map((pos, i) => (
      <group key={i} position={[pos[0], 0, pos[1]]}>
        {/* Tree trunk */}
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 3, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
        {/* Tree top */}
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[2, 4, 8]} />
          <meshStandardMaterial color="#2E7D32" />
        </mesh>
      </group>
    ));
  };

  // Calculate sky color based on day/night cycle
  const skyColor = useMemo(() => {
    // Interpolate between night blue and day blue
    const r = 0.1 + dayNightCycle * 0.5;
    const g = 0.1 + dayNightCycle * 0.65;
    const b = 0.3 + dayNightCycle * 0.55;
    return new THREE.Color(r, g, b);
  }, [dayNightCycle]);

  return (
    <>
      {/* Dynamic sky dome */}
      <mesh>
        <sphereGeometry args={[450, 32, 16]} />
        <meshBasicMaterial color={skyColor} side={THREE.BackSide} />
      </mesh>
      
      {/* Clouds */}
      <group id="clouds-group">
        {cloudData.map((cloud, i) => (
          <mesh 
            key={i} 
            position={cloud.position as [number, number, number]} 
            rotation={[0, cloud.rotation, 0]} 
            scale={[cloud.scale, cloud.scale * 0.6, cloud.scale]}
          >
            <sphereGeometry args={[2, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
          </mesh>
        ))}
      </group>
      
      {/* Main house */}
      <group position={[0, 0, 0]}>
        <BigBrotherHouse />
      </group>
      
      {/* Additional structures */}
      <group position={[15, 0, -15]}>
        <House />
      </group>
      
      {/* Ground decorations */}
      <group position={[0, 0, 5]}>
        {renderTrees()}
      </group>
      
      {/* Add some decorative garden elements */}
      <group position={[-5, 0, 5]}>
        <mesh position={[0, 0.1, 0]} receiveShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color="#8D6E63" />
        </mesh>
        
        {/* Garden benches */}
        <mesh position={[0, 0.4, 2]} receiveShadow castShadow>
          <boxGeometry args={[3, 0.1, 0.6]} />
          <meshStandardMaterial color="#A1887F" />
        </mesh>
        <mesh position={[0, 0.7, 2.3]} receiveShadow castShadow>
          <boxGeometry args={[3, 0.6, 0.1]} />
          <meshStandardMaterial color="#A1887F" />
        </mesh>
      </group>
    </>
  );
};

export default GameScene;
