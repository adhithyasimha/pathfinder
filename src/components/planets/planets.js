import * as THREE from 'three';

const Planet = ({ radius, distance, textureUrl, speed }) => {
    const loader = new THREE.TextureLoader();
    
    // Create the planet mesh
    const planetGeometry = new THREE.SphereGeometry(radius, 32, 32);
    const planetMaterial = new THREE.MeshStandardMaterial({
        map: loader.load(textureUrl)
    });
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Set the initial position
    planet.position.x = distance;

    // Rotate and move the planet around the sun
    planet.updateOrbit = (time) => {
        const angle = time * speed;
        planet.position.x = distance * Math.cos(angle);
        planet.position.z = distance * Math.sin(angle);
    };

    return planet;
};

export default Planet;
