import * as THREE from 'three';

const VerticalRing = () => {
    // Reduce the radius of the torus
    const ringGeometry = new THREE.TorusGeometry(5, 0.5, 16, 100); // Reduced radius from 10 to 5
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);

    // Rotate the ring vertically
    ring.rotation.x = Math.PI / 2;

    return ring;
};

export default VerticalRing;