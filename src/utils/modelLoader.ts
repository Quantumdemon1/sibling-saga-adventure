
import * as THREE from 'three';

// Define model keys
export type ModelKey = 'house' | 'nominationBox' | 'npc' | 'hohChair' | 'vetoNecklace';

// Simple hook to simulate model loading
export const usePreloadModels = () => {
  // Always return true - this removes any asynchronous operations that might cause issues
  return true;
};

// Simplified model creation function with minimal properties
export const useGameModel = (modelKey: ModelKey) => {
  const geometry = getGeometryForModelType(modelKey);
  const color = getColorForModelType(modelKey);
  
  // Create a simple mesh
  const mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshStandardMaterial({ color })
  );
  
  // Return a simple group with just the mesh
  const group = new THREE.Group();
  group.add(mesh);
  
  return {
    scene: group,
    animations: [],
    modelKey
  };
};

// Helper functions for geometry and color
function getGeometryForModelType(modelKey: ModelKey): THREE.BufferGeometry {
  switch(modelKey) {
    case 'house':
      return new THREE.BoxGeometry(2, 1.5, 2);
    case 'nominationBox':
      return new THREE.BoxGeometry(0.8, 0.8, 0.8);
    case 'npc':
      return new THREE.BoxGeometry(0.5, 1, 0.5);
    case 'hohChair':
      return new THREE.CylinderGeometry(0.6, 0.6, 1, 16);
    case 'vetoNecklace':
      return new THREE.TorusGeometry(0.5, 0.1, 8, 16);
  }
}

function getColorForModelType(modelKey: ModelKey): number {
  switch(modelKey) {
    case 'house':
      return 0x8888FF;
    case 'nominationBox':
      return 0xFF8888;
    case 'npc':
      return 0x88FF88;
    case 'hohChair':
      return 0xFFFF88;
    case 'vetoNecklace':
      return 0xFF88FF;
    default:
      return 0x888888;
  }
}
