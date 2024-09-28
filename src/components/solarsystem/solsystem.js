import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createPlanet, planetsData } from '../planets/planets';
import StarField from '../starfield/starfield';
import Sun from '../sun/sun';

const SolarSystem = () => {
    const mountRef = useRef(null);
    const [selectedPlanet, setSelectedPlanet] = useState(null);
    let controls = null;
    let camera = null;
    let animationFrameId = null;

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Scene, camera, and renderer setup
        const scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // CSS2D Renderer for labels
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(width, height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        mountRef.current.appendChild(labelRenderer.domElement);

        // Camera and controls setup
        camera.position.set(0, 200, 400);
        controls = new OrbitControls(camera, labelRenderer.domElement);
        
        // Lights setup
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        scene.add(ambientLight);

        const sunLight = new THREE.PointLight(0xffffff, 1.5, 1000);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        // Add Sun and its glow effect
        const sun = Sun();
        scene.add(sun);

        // Adding starfield
        scene.add(StarField());

        // Function to get random position on orbit
        const getRandomPositionOnOrbit = (orbitRadius) => {
            const angle = Math.random() * Math.PI * 2;
            const x = Math.cos(angle) * orbitRadius;
            const z = Math.sin(angle) * orbitRadius;
            return new THREE.Vector3(x, 0, z);
        };

        // Create planets and orbits
        const orbits = [];
        const planets = planetsData.map((data, index) => {
            const spacing = 20; // Spacing between orbits
            const orbitRadius = data.orbit + index * spacing;
            const planet = createPlanet(data);
            const position = getRandomPositionOnOrbit(orbitRadius);
            planet.position.copy(position);
            planet.userData = { ...data, orbitRadius, originalGeometry: planet.geometry.clone() };
            scene.add(planet);

            // Create orbit
            const orbit = new THREE.Mesh(
                new THREE.TorusGeometry(orbitRadius, 0.09, 16, 100),
                new THREE.MeshBasicMaterial({
                    color: data.orbitColor || 0xffffff,
                    side: THREE.DoubleSide,
                    opacity: 0.9,
                    transparent: true
                })
            );
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);
            orbits.push(orbit);

            // Planet label
            const planetDiv = document.createElement('div');
            planetDiv.className = 'label planet-label';
            planetDiv.textContent = data.name.toUpperCase();
            planetDiv.style.color = 'white';
            planetDiv.style.fontWeight = 'bold';
            const planetLabel = new CSS2DObject(planetDiv);
            planetLabel.position.set(0, data.size + 1, 0);
            planet.add(planetLabel);

            return planet;
        });

        // Function to zoom in and focus on a planet with animation
        function zoomToPlanet(planetName) {
            const planet = planets.find(p => p.userData.name === planetName);
            if (planet) {
                setSelectedPlanet(planetName);
                
                // Load and apply texture
                const textureLoader = new THREE.TextureLoader();
                textureLoader.load(`/textures/${planetName.toLowerCase()}.jpg`, (texture) => {
                    planet.material.dispose();
                    planet.material = new THREE.MeshStandardMaterial({ 
                        map: texture,
                        metalness: 0.2,
                        roughness: 0.8
                    });
                });

                // Animate camera movement
                const startPosition = camera.position.clone();
                const endPosition = planet.position.clone().add(new THREE.Vector3(planet.userData.size * 5, planet.userData.size * 2, planet.userData.size * 5));
                const startTarget = controls.target.clone();
                const endTarget = planet.position.clone();
                let t = 0;
                const animate = () => {
                    t += 0.02;
                    if (t > 1) t = 1;

                    camera.position.lerpVectors(startPosition, endPosition, t);
                    controls.target.lerpVectors(startTarget, endTarget, t);
                    controls.update();

                    if (t < 1) {
                        animationFrameId = requestAnimationFrame(animate);
                    }
                };
                animate();
            }
        }

        // Function to reset the view to the default solar system view
        function resetView() {
            setSelectedPlanet(null);
            planets.forEach((planet) => {
                planet.material.dispose();
                planet.material = new THREE.MeshStandardMaterial({ 
                    color: planet.userData.color,
                    metalness: 0.2,
                    roughness: 0.8
                });
            });

            // Animate camera movement back to original position
            const startPosition = camera.position.clone();
            const endPosition = new THREE.Vector3(0, 200, 400);
            const startTarget = controls.target.clone();
            const endTarget = new THREE.Vector3(0, 0, 0);
            let t = 0;
            const animate = () => {
                t += 0.02;
                if (t > 1) t = 1;

                camera.position.lerpVectors(startPosition, endPosition, t);
                controls.target.lerpVectors(startTarget, endTarget, t);
                controls.update();

                if (t < 1) {
                    animationFrameId = requestAnimationFrame(animate);
                }
            };
            animate();
        }

        // Function to update planet positions when orbit changes
        function updatePlanetPositions() {
            planets.forEach((planet, index) => {
                const newPosition = getRandomPositionOnOrbit(planet.userData.orbitRadius);
                planet.position.copy(newPosition);

                // Update orbit
                orbits[index].geometry.dispose();
                orbits[index].geometry = new THREE.TorusGeometry(planet.userData.orbitRadius, 0.1, 16, 100);
            });
        }

        // Animation loop
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
        };
        animate();

        // Handle window resizing
        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            labelRenderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // Add raycaster for mouse interactions
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets);

            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                zoomToPlanet(clickedPlanet.userData.name);
            } else if (selectedPlanet) {
                resetView();
            }
        }

        window.addEventListener('click', onClick);

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('click', onClick);
            mountRef.current.removeChild(renderer.domElement);
            mountRef.current.removeChild(labelRenderer.domElement);
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            renderer.dispose();
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default SolarSystem;