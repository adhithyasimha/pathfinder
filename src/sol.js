import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const loader = new THREE.TextureLoader();
const mercury_texture=loader.load('public/textures/mercury.jpg');
const venus_texture=loader.load('public/textures/venus.jpg');
const mars_texture=loader.load('public/textures/mars.jpg')


const planetsData = [
    { name: "Mercury", color: 0x8c8c8c,map:mercury_texture,size: 0.383, orbit: 30, speed: 0.02 },
    { name: "Venus", color: 0xe6e6e6,map:venus_texture, size: 0.949, orbit: 45, speed: 0.015 },
    { name: "Earth", color: 0x6b93d6, size: 0.999, orbit: 60, speed: 0.01 },
    { name: "Mars", color: 0xc1440e, size: 0.532, orbit: 75, speed: 0.008 },
    { name: "Jupiter", color: 0xd8ca9d, size: 1.21, orbit: 100, speed: 0.005 },
    { name: "Saturn", color: 0xead6b8, size: 1.45, orbit: 125, speed: 0.004 },
    { name: "Uranus", color: 0xd1e7e7, size: 1, orbit: 150, speed: 0.003 },
    { name: "Neptune", color: 0x5b5ddf, size: 1.88, orbit: 175, speed: 0.002 }
];




const SolarSystem = () => {
    const mountRef = useRef(null);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    let spotlight;

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // Camera position
        camera.position.set(0, 150, 300);
        camera.lookAt(0, 0, 0);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.target.set(0, 0, 0);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x333333);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xFFFFFF, 2, 300);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        // Sun
        const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.position.set(0, 0, 0);
        scene.add(sun);

        // Create planets
        const planets = planetsData.map(data => {
            const planetGeometry = new THREE.SphereGeometry(data.size, 32, 32);
            const planetMaterial = new THREE.MeshBasicMaterial({ color: data.color });
            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            planet.userData = { ...data, originalGeometry: planetGeometry };
            scene.add(planet);

            // Create orbit
            const orbitGeometry = new THREE.RingGeometry(data.orbit, data.orbit + 0.1, 128);
            const orbitMaterial = new THREE.MeshBasicMaterial({ 
                color: data.color, 
                side: THREE.DoubleSide, 
                opacity: 0.75, 
                transparent: true
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);

            return planet;
        });

        function zoomToPlanet(planetName) {
            const planet = planets.find(p => p.userData.name === planetName);
            if (planet) {
                setSelectedPlanet(planetName);
                const expandedGeometry = new THREE.SphereGeometry(planet.userData.size * 2, 64, 64);
                planet.geometry.dispose();
                planet.geometry = expandedGeometry;

                // Load and apply texture
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(`/textures/${planetName.toLowerCase()}.jpg`, (texture) => {
                    planet.material.dispose();
                    planet.material = new THREE.MeshStandardMaterial({ map: texture });
                });

                // Add spotlight
                if (spotlight) {
                    scene.remove(spotlight);
                }
                spotlight = new THREE.SpotLight(0xffffff, 2);
                spotlight.position.set(planet.position.x + 10, planet.position.y + 10, planet.position.z + 10);
                spotlight.target = planet;
                scene.add(spotlight);

                const targetPosition = planet.position.clone().add(new THREE.Vector3(0, 0, planet.userData.size * 5));
                animateCamera(targetPosition, planet.position);
            }
        }

        function resetView() {
            setSelectedPlanet(null);
            planets.forEach(planet => {
                planet.geometry.dispose();
                planet.geometry = planet.userData.originalGeometry;
                planet.material.dispose();
                planet.material = new THREE.MeshBasicMaterial({ color: planet.userData.color });
            });

            if (spotlight) {
                scene.remove(spotlight);
                spotlight = null;
            }

            animateCamera(new THREE.Vector3(0, 150, 300), new THREE.Vector3(0, 0, 0));
        }

        function animateCamera(targetPosition, lookAtPosition) {
            const start = camera.position.clone();
            const startLookAt = controls.target.clone();
            const end = targetPosition;
            const endLookAt = lookAtPosition;
            let t = 0;

            function animate() {
                t += 0.02;
                if (t > 1) t = 1;

                camera.position.lerpVectors(start, end, t);
                controls.target.lerpVectors(startLookAt, endLookAt, t);
                controls.update();

                if (t < 1) {
                    requestAnimationFrame(animate);
                }
            }

            animate();
        }

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            planets.forEach(planet => {
                const angle = Date.now() * 0.001 * planet.userData.speed;
                planet.position.x = Math.cos(angle) * planet.userData.orbit;
                planet.position.z = Math.sin(angle) * planet.userData.orbit;
            });

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Expose zoomToPlanet and resetView functions
        window.zoomToPlanet = zoomToPlanet;
        window.resetView = resetView;

        // Handle resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            planets.forEach(planet => {
                planet.geometry.dispose();
                planet.material.dispose();
            });
            if (spotlight) {
                scene.remove(spotlight);
            }
        };
    }, []);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            <div style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '10px',
                borderRadius: '5px'
            }}>
                <h2>Solar System</h2>
                {selectedPlanet ? (
                    <>
                        <h3>{selectedPlanet}</h3>
                        <button onClick={() => window.resetView()}>Return to System View</button>
                    </>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {planetsData.map(planet => (
                            <li key={planet.name} style={{ marginBottom: '5px' }}>
                                <span>{planet.name}</span>
                                <button
                                    onClick={() => window.zoomToPlanet(planet.name)}
                                    style={{
                                        marginLeft: '10px',
                                        background: 'transparent',
                                        color: 'white',
                                        border: '1px solid white',
                                        borderRadius: '5px',
                                        padding: '5px'
                                    }}
                                >
                                    Zoom
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default SolarSystem;
