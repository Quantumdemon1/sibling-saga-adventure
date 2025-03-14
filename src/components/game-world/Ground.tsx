
import React from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';

interface GroundProps {
  size: [number, number];
}

const Ground: React.FC<GroundProps> = ({ size }) => {
  // Define a simple repeating grid texture for better performance
  const gridTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.fillStyle = '#4CAF50';
      context.fillRect(0, 0, 512, 512);
      
      // Add grid lines
      context.strokeStyle = '#388E3C';
      context.lineWidth = 4;
      
      // Draw grid
      for (let i = 0; i < 8; i++) {
        // Horizontal lines
        context.beginPath();
        context.moveTo(0, i * 64);
        context.lineTo(512, i * 64);
        context.stroke();
        
        // Vertical lines
        context.beginPath();
        context.moveTo(i * 64, 0);
        context.lineTo(i * 64, 512);
        context.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(size[0] / 10, size[1] / 10);
    
    return texture;
  }, [size]);
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.01, 0]}
      receiveShadow
    >
      <planeGeometry args={size} />
      <meshLambertMaterial map={gridTexture} />
    </mesh>
  );
};

export default Ground;
