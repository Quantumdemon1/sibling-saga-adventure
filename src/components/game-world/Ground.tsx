
import React from 'react';

interface GroundProps {
  size: [number, number];
}

const Ground: React.FC<GroundProps> = ({ size }) => {
  return (
    <mesh 
      position={[0, -0.1, 0]} 
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshStandardMaterial color="#8FB275" />
    </mesh>
  );
};

export default Ground;
