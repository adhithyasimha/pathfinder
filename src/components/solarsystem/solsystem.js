import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import { createPlanet, planetsData } from '../planets/planets';
import StarField from '../starfield/starfield';

const SolarSystem = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        // CSS2D Renderer for labels
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(width, height);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0px';
        mountRef.current.appendChild(labelRenderer.domElement);

        camera.position.set(0, 200, 400);
        const controls = new OrbitControls(camera, labelRenderer.domElement);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        // Directional light (sun)
        const sunLight = new THREE.PointLight(0xffffff, 1, 1000);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        // Create Sun
        const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Sun glow
        const sunGlowGeometry = new THREE.SphereGeometry(10.5, 32, 32);
        const sunGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { type: "f", value: 0.5 },
                p: { type: "f", value: 1.4 },
                glowColor: { type: "c", value: new THREE.Color(0xffff00) },
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
                    intensity = pow( dot(normalize(viewVector), actual_normal), 6.0 );
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4( glow, 1.0 );
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        scene.add(sunGlow);

        // Sun label
        const sunDiv = document.createElement('div');
        sunDiv.className = 'label';
        sunDiv.textContent = 'SUN';
        sunDiv.style.marginTop = '-1em';
        sunDiv.style.color = 'yellow';
        sunDiv.style.fontWeight = 'bold';
        const sunLabel = new CSS2DObject(sunDiv);
        sunLabel.position.set(0, 12, 0);
        sun.add(sunLabel);

        // Adding starfield
        const starField = StarField();
        scene.add(starField);

        // Create planets and orbits
        const planets = planetsData.map(data => {
            const planet = createPlanet(data);
            planet.position.x = data.orbit;
            scene.add(planet);

            // Create orbit
            const orbitGeometry = new THREE.TorusGeometry(data.orbit, 0.2, 16, 100);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: data.orbitColor,
                side: THREE.DoubleSide,
                opacity: 0.9,
                transparent: true
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2;
            scene.add(orbit);

            // Planet label
            const planetDiv = document.createElement('div');
            planetDiv.className = 'label planet-label';
            planetDiv.textContent = data.name.toUpperCase();
            planetDiv.style.marginTop = '-1em';
            planetDiv.style.color = 'white';
            planetDiv.style.fontWeight = 'bold';
            const planetLabel = new CSS2DObject(planetDiv);
            planetLabel.position.set(0, data.size + 1, 0);
            planet.add(planetLabel);

            return planet;
        });

        const animate = () => {
            requestAnimationFrame(animate);

            const time = Date.now() * 0.001;
            planets.forEach((planet, index) => {
                const data = planetsData[index];
                const angle = time * data.speed;
                planet.position.x = Math.cos(angle) * data.orbit;
                planet.position.z = Math.sin(angle) * data.orbit;

                // Add rotation
                planet.rotation.y += 0.01 * data.speed;
            });

            sunGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, sunGlow.position);

            // Update label visibility based on camera distance
            const distance = camera.position.length();
            const planetLabels = document.querySelectorAll('.planet-label');
            planetLabels.forEach(label => {
                label.style.opacity = distance > 600 ? '0' : '1';
            });

            // Ensure Sun label is always visible
            sunDiv.style.opacity = '1';

            controls.update();
            renderer.render(scene, camera);
            labelRenderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            const newWidth = window.innerWidth;
            const newHeight = window.innerHeight;
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(newWidth, newHeight);
            labelRenderer.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current.removeChild(renderer.domElement);
            mountRef.current.removeChild(labelRenderer.domElement);
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default SolarSystem;
