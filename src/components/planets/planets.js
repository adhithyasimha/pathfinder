import * as THREE from 'three';

export const createPlanet = ({ size, color, orbit, speed }) => {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planetMaterial = new THREE.MeshPhongMaterial({ 
        color,
        shininess: 30,
    });

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { size, color, orbit, speed };

    return planet;
};

export const planetsData = [
    { name: "Mercury", color: 0xC0C0C0, orbitColor: 0x808080, size: 1, orbit: 30, speed: 0.01 },
    { name: "Venus", color: 0xFFA500, orbitColor: 0xFFA500, size: 1.5, orbit: 45, speed: 0.007 },
    { name: "Earth", color: 0x0000FF, orbitColor: 0x0000FF, size: 2, orbit: 60, speed: 0.005 },
    { name: "Mars", color: 0xFF0000, orbitColor: 0xFF0000, size: 1.2, orbit: 75, speed: 0.004 },
    { name: "Jupiter", color: 0xFFA500, orbitColor: 0xFFA500, size: 4, orbit: 100, speed: 0.002 },
    { name: "Saturn", color: 0xFFD700, orbitColor: 0xFFD700, size: 3.5, orbit: 125, speed: 0.0015 },
    { name: "Uranus", color: 0x00FFFF, orbitColor: 0x00FFFF, size: 2.5, orbit: 150, speed: 0.001 },
    { name: "Neptune", color: 0x0000FF, orbitColor: 0x000080, size: 2.5, orbit: 175, speed: 0.0008 }
];