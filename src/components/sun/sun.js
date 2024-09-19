import * as THREE from 'three';

const Sun = () => {
    const loader = new THREE.TextureLoader();
    
    // Main sun sphere
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Glow atmosphere (blurred ring)
    const atmosphereTexture = loader.load('/textures/atmosphere.png');
    const atmosphereMaterial = new THREE.SpriteMaterial({ map: atmosphereTexture, transparent: true, opacity: 0.5 });
    const atmosphere = new THREE.Sprite(atmosphereMaterial);
    atmosphere.scale.set(15, 15, 1);
    sun.add(atmosphere);

    // Sun sprite (visible when zoomed out)
    const spriteMaterial = new THREE.SpriteMaterial({ map: loader.load('/textures/sun.png'), color: 0xffff00 });
    const sunSprite = new THREE.Sprite(spriteMaterial);
    sunSprite.scale.set(10, 10, 1);
    sun.add(sunSprite);

    return sun;
};

export default Sun;
