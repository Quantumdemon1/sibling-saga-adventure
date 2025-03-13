
import * as THREE from 'three';

// Define model keys
export type ModelKey = 'house' | 'nominationBox' | 'npc' | 'hohChair' | 'vetoNecklace';

// Function to preload models - returns true immediately to avoid blocking
export const usePreloadModels = () => {
  // In a real implementation, this would load models asynchronously
  return true;
};

// Create reliable simple 3D models
export const useGameModel = (modelKey: ModelKey) => {
  // Create reusable geometries and materials to prevent memory leaks
  const geometry = getGeometryForModelType(modelKey);
  const material = getMaterialForModelType(modelKey);
  
  // Ensure we have valid geometry and material
  if (!geometry || !material) {
    console.error(`Failed to create model for ${modelKey}`);
    // Provide fallback simple cube
    const fallbackGeometry = new THREE.BoxGeometry(1, 1, 1);
    const fallbackMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const fallbackMesh = new THREE.Mesh(fallbackGeometry, fallbackMaterial);
    const group = new THREE.Group();
    group.add(fallbackMesh);
    return { scene: group, animations: [], modelKey };
  }
  
  // Create a simple mesh properly
  const mesh = new THREE.Mesh(geometry, material);
  
  // Add shadow capabilities
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Return a simple group with just the mesh
  const group = new THREE.Group();
  group.add(mesh);
  
  return {
    scene: group,
    animations: [],
    modelKey
  };
};

// Helper functions for geometry with error handling
function getGeometryForModelType(modelKey: ModelKey): THREE.BufferGeometry {
  try {
    switch(modelKey) {
      case 'house':
        return new THREE.BoxGeometry(2, 1.5, 2);
      case 'nominationBox':
        return new THREE.BoxGeometry(0.8, 0.8, 0.8);
      case 'npc':
        return new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8);
      case 'hohChair':
        return new THREE.CylinderGeometry(0.6, 0.6, 1, 16);
      case 'vetoNecklace':
        return new THREE.TorusGeometry(0.5, 0.1, 8, 16);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  } catch (error) {
    console.error(`Error creating geometry for ${modelKey}:`, error);
    return new THREE.BoxGeometry(1, 1, 1);
  }
}

// Helper function for materials with error handling
function getMaterialForModelType(modelKey: ModelKey): THREE.Material {
  try {
    switch(modelKey) {
      case 'house':
        return new THREE.MeshStandardMaterial({ color: 0x8888FF });
      case 'nominationBox':
        return new THREE.MeshStandardMaterial({ color: 0xFF8888 });
      case 'npc':
        return new THREE.MeshStandardMaterial({ color: 0x88FF88 });
      case 'hohChair':
        return new THREE.MeshStandardMaterial({ 
          color: 0xFFFF88,
          emissive: 0xFFFF00,
          emissiveIntensity: 0.2
        });
      case 'vetoNecklace':
        return new THREE.MeshStandardMaterial({ 
          color: 0xFF88FF,
          metalness: 0.8,
          roughness: 0.2
        });
      default:
        return new THREE.MeshStandardMaterial({ color: 0x888888 });
    }
  } catch (error) {
    console.error(`Error creating material for ${modelKey}:`, error);
    return new THREE.MeshStandardMaterial({ color: 0x888888 });
  }
}
