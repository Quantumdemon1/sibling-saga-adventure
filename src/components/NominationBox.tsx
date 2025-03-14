
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import useGameStateStore from '@/stores/gameStateStore';
import * as THREE from 'three';

const NominationBox: React.FC = () => {
  const { currentPhase } = useGameStateStore();
  const boxRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Add more dynamic animation to the nomination box
  useFrame(({ clock }) => {
    if (boxRef.current) {
      // More interesting animation pattern
      const time = clock.getElapsedTime();
      boxRef.current.position.y = 1 + Math.sin(time) * 0.2;
      boxRef.current.rotation.y += 0.005;
      
      // Subtle rotation on other axes for more visual interest
      boxRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      boxRef.current.rotation.z = Math.cos(time * 0.7) * 0.05;
      
      // Update glow effect if active
      if (glowRef.current && currentPhase === 'nominationCeremony') {
        glowRef.current.scale.set(
          1.2 + Math.sin(time * 2) * 0.1,
          1.2 + Math.sin(time * 2) * 0.1,
          1.2 + Math.sin(time * 2) * 0.1
        );
        
        // Pulse opacity for glow effect
        const material = glowRef.current.material as THREE.MeshBasicMaterial;
        if (material) {
          material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
        }
      }
    }
  });
  
  // Box glows or changes color based on game phase
  const isActive = currentPhase === 'nominationCeremony';
  
  return (
    <group position={[4, 1, -8]}>
      <mesh 
        ref={boxRef}
        castShadow 
        receiveShadow
      >
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        {isActive ? (
          <meshStandardMaterial 
            color="#ffcc00"
            emissive="#ff6600"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.2}
          />
        ) : (
          <meshStandardMaterial
            color="#3366cc"
            metalness={0.3}
            roughness={0.7}
          />
        )}
      </mesh>
      
      {/* Glow effect for active state */}
      {isActive && (
        <mesh
          ref={glowRef}
          scale={[1.2, 1.2, 1.2]}
        >
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial
            color="#ffaa00"
            transparent
            opacity={0.6}
            side={THREE.BackSide}
          />
        </mesh>
      )}
      
      {/* Particle effect for active state */}
      {isActive && <NominationParticles />}
    </group>
  );
};

// Simple particle effect component
const NominationParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 50;
  
  // Create particles
  const particlePositions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * 3 + 1;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
    }
    return positions;
  }, []);
  
  // Animate particles
  useFrame(({ clock }) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      const time = clock.getElapsedTime();
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] = Math.sin(time + i) * 0.5 + 1; // Y position
        
        // Circular motion in X-Z plane
        positions[i3] = Math.sin(time * 0.5 + i) * 1.5; // X position
        positions[i3 + 2] = Math.cos(time * 0.5 + i) * 1.5; // Z position
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particlePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffcc00"
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default NominationBox;
