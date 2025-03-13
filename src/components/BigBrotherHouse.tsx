
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useGameModel } from '@/utils/modelLoader';
import useGameStateStore from '@/stores/gameStateStore';

interface RoomData {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  name: string;
}

const BigBrotherHouse: React.FC = () => {
  const houseRef = useRef<THREE.Group>(null);
  const { currentPhase } = useGameStateStore();
  
  // Try to load the house model
  let houseModel;
  try {
    houseModel = useGameModel('house');
  } catch (e) {
    // Model not available, will use geometry instead
    houseModel = { scene: null };
  }
  
  // Define rooms if no model is available
  const rooms: RoomData[] = [
    { 
      position: [0, 2.5, -15], 
      size: [20, 5, 30], 
      color: '#888888', 
      name: 'Main House' 
    },
    { 
      position: [-8, 2.5, -15], 
      size: [4, 5, 6], 
      color: '#AB8884', 
      name: 'Bedroom A' 
    },
    { 
      position: [8, 2.5, -15], 
      size: [4, 5, 6], 
      color: '#AB8884', 
      name: 'Bedroom B' 
    },
    { 
      position: [0, 2.5, -5], 
      size: [10, 5, 6], 
      color: '#C4CACE', 
      name: 'Kitchen' 
    },
    { 
      position: [0, 2.5, -25], 
      size: [10, 5, 6], 
      color: '#9CB380', 
      name: 'Backyard' 
    },
    { 
      position: [0, 2.5, -35], 
      size: [20, 5, 10], 
      color: '#DEBA9D', 
      name: 'HoH Room',
    }
  ];

  // If we have a model, use it, otherwise build from the rooms data
  if (houseModel.scene) {
    return (
      <primitive
        object={houseModel.scene.clone()}
        ref={houseRef}
        position={[0, 0, -15]}
        scale={[0.1, 0.1, 0.1]}
      />
    );
  }

  // Get current HoH
  const { hoh } = useGameStateStore();

  // Create house from room components
  return (
    <group ref={houseRef}>
      {rooms.map((room, index) => (
        <Room key={index} {...room} />
      ))}
      
      {/* HoH Room access - only visible when HoH is determined */}
      {(currentPhase !== 'hohCompetition' && hoh) && (
        <mesh position={[0, 0, -30]} rotation={[0, 0, 0]}>
          <boxGeometry args={[3, 4, 0.2]} />
          <meshStandardMaterial color="gold" />
        </mesh>
      )}
    </group>
  );
};

// Individual room component
const Room: React.FC<RoomData> = ({ position, size, color, name }) => {
  const roomRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (roomRef.current) {
      // Add collision data
      const boundingBox = new THREE.Box3().setFromObject(roomRef.current);
      roomRef.current.userData.boundingBox = boundingBox;
      roomRef.current.userData.roomName = name;
    }
  }, [name]);

  return (
    <mesh position={position} ref={roomRef}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} transparent opacity={0.9} />
      {/* Room label */}
      <Text 
        position={[0, size[1]/2 + 0.5, 0]} 
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
      >
        {name}
      </Text>
    </mesh>
  );
};

export default BigBrotherHouse;
