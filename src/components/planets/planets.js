import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();

export const createPlanet = ({ size, color, textureUrl, orbit, speed }) => {
    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const texture = textureLoader.load(textureUrl);
    
    const planetMaterial = new THREE.MeshPhongMaterial({
        color: color,
        map: texture,
        shininess: 100,
        emissive: new THREE.Color(color).multiplyScalar(0.1),
    });
    
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.userData = { size, color, textureUrl, orbit, speed };
    
    return planet;
};

export const createLighting = () => {
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
    pointLight.position.set(0, 0, 0);
    
    return { ambientLight, pointLight };
};

export const planetsData = [
    { name: "Mercury", color: 0xb7bac5, textureUrl: "public/textures/mercury.jpg", orbitColor: 0x8B8B8B, size: 1, orbit: 30, speed: 0.001 },
    { name: "Venus", color: 0xFFA500, textureUrl: "/textures/venus.jpg", orbitColor: 0xFFB6C1, size: 1.5, orbit: 45, speed: 0.107 },
    { name: "Earth", color: 0x0000FF, textureUrl: "/textures/earth.jpg", orbitColor: 0x4169E1, size: 2, orbit: 60, speed: 0.025 },
    { name: "Mars", color: 0xFF0000, textureUrl: "/textures/mars.jpg", orbitColor: 0xFF4500, size: 1.2, orbit: 75, speed: 0.004 },
    { name: "Jupiter", color: 0xFFA500, textureUrl: "/textures/jupiter.jpg", orbitColor: 0xFFA07A, size: 4, orbit: 100, speed: 0.102 },
    { name: "Saturn", color: 0xFFD700, textureUrl: "/textures/saturn.jpg", orbitColor: 0xDAA520, size: 3.5, orbit: 125, speed: 0.0015 },
    { name: "Uranus", color: 0x00FFFF, textureUrl: "/textures/uranus.jpg", orbitColor: 0x40E0D0, size: 2.5, orbit: 150, speed: 0.011 },
    { name: "Neptune", color: 0x0000FF, textureUrl: "/textures/neptune.jpg", orbitColor: 0x1E90FF, size: 2.5, orbit: 175, speed: 0.0108 }
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