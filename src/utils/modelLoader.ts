
import * as THREE from 'three';

// Define model keys
export type ModelKey = 'house' | 'nominationBox' | 'npc' | 'hohChair' | 'vetoNecklace';

// Function to preload models - returns true immediately to avoid blocking
export const usePreloadModels = () => {
  // In a real implementation, this would load models asynchronously
  return true;
};

// Create reliable simple 3D models - returns a structure compatible with useGLTF
export const useGameModel = (modelKey: ModelKey) => {
  // Create a simple group to return
  const group = new THREE.Group();
  
  // Set up the model based on type
  switch(modelKey) {
    case 'house':
      const houseMesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 1.5, 2),
        new THREE.MeshStandardMaterial({ color: 0x8888FF })
      );
      houseMesh.castShadow = true;
      houseMesh.receiveShadow = true;
      group.add(houseMesh);
      break;
      
    case 'nominationBox':
      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.MeshStandardMaterial({ color: 0xFF8888 })
      );
      boxMesh.castShadow = true;
      boxMesh.receiveShadow = true;
      group.add(boxMesh);
      break;
      
    case 'npc':
      const npcMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 1.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x88FF88 })
      );
      npcMesh.castShadow = true;
      npcMesh.receiveShadow = true;
      group.add(npcMesh);
      break;
      
    case 'hohChair':
      const chairMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 1, 16),
        new THREE.MeshStandardMaterial({ color: 0xFFFF88 })
      );
      // Add emission
      chairMesh.material.emissive = new THREE.Color(0xFFFF00);
      chairMesh.material.emissiveIntensity = 0.2;
      chairMesh.castShadow = true;
      chairMesh.receiveShadow = true;
      group.add(chairMesh);
      break;
      
    case 'vetoNecklace':
      const vetoMesh = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.1, 8, 16),
        new THREE.MeshStandardMaterial({ color: 0xFF88FF })
      );
      // Add metallic properties
      vetoMesh.material.metalness = 0.8;
      vetoMesh.material.roughness = 0.2;
      vetoMesh.castShadow = true;
      vetoMesh.receiveShadow = true;
      group.add(vetoMesh);
      break;
      
    default:
      // Fallback cube
      const fallbackMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshStandardMaterial({ color: 0x888888 })
      );
      fallbackMesh.castShadow = true;
      fallbackMesh.receiveShadow = true;
      group.add(fallbackMesh);
  }
  
  return {
    scene: group,
    animations: [],
    modelKey
  };
};
