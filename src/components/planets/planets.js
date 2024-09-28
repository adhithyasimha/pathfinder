import * as THREE from 'three';

export const createPlanet = ({ size, color, orbit, speed }) => {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({
        color,
        shininess: 100,
        emissive: new THREE.Color(color).multiplyScalar(0.1), // Add a slight glow
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { size, color, orbit, speed };
    
    return planet;
};

export const createLighting = () => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000); // Bright white light
    pointLight.position.set(0, 0, 0); // Position at the center (sun)
    
    return { ambientLight, pointLight };
};

export const planetsData = [
    { name: "Mercury", color: 0xb7bac5, orbitColor: 0x8B8B8B, size: 1, orbit: 30, speed: 0.01 },
    { name: "Venus", color: 0xFFA500, orbitColor: 0xFFB6C1, size: 1.5, orbit: 45, speed: 0.007 },
    { name: "Earth", color: 0x0000FF, orbitColor: 0x4169E1, size: 2, orbit: 60, speed: 0.005 },
    { name: "Mars", color: 0xFF0000, orbitColor: 0xFF4500, size: 1.2, orbit: 75, speed: 0.004 },
    { name: "Jupiter", color: 0xFFA500, orbitColor: 0xFFA07A, size: 4, orbit: 100, speed: 0.002 },
    { name: "Saturn", color: 0xFFD700, orbitColor: 0xDAA520, size: 3.5, orbit: 125, speed: 0.0015 },
    { name: "Uranus", color: 0x00FFFF, orbitColor: 0x40E0D0, size: 2.5, orbit: 150, speed: 0.001 },
    { name: "Neptune", color: 0x0000FF, orbitColor: 0x1E90FF, size: 2.5, orbit: 175, speed: 0.0008 }
];

export const createOrbit = (radius, color) => {
    const orbitGeometry = new THREE.RingGeometry(radius, radius + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    });
    return new THREE.Mesh(orbitGeometry, orbitMaterial);
};