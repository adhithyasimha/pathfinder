import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import StarField from '../starfield/starfield';
import Sun from '../sun/sun';
import Planet from '../planets/planets';
const SolarSystem = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        mountRef.current.appendChild(renderer.domElement);

        camera.position.set(0, 150, 300);
        const controls = new OrbitControls(camera, renderer.domElement);

        // Adding sun, glow ring, and starfield
        const sun = Sun();
        
        const starField = StarField();
        scene.add(sun, starField);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        });

        return () => mountRef.current.removeChild(renderer.domElement);
    }, []);

    return <div ref={mountRef} />;
};

export default SolarSystem;
