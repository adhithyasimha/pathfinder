import * as THREE from 'three';

const Sun = () => {
    // Sun geometry and material (basic sun)
    const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00, // Sun color (yellow)
        emissive: 0xffff00, // Sun emissive color
        emissiveIntensity: 1, // Strength of emissive light
        map: new THREE.TextureLoader().load('/textures/sun.jpg') // Sun texture
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);

    // Glow effect for the sun (larger sphere for soft blur)
    const glowGeometry = new THREE.SphereGeometry(13, 32, 32); // Larger for smooth glow
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { value: 0.2 }, // Lower constant for smooth intensity falloff
            p: { value: 2.0 }, // Exponent to control the glow spread
            glowColor: { value: new THREE.Color(0xffff00) }, // Match the sun's yellow glow
            viewVector: { value: new THREE.Vector3() }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 actual_normal = normalize(normalMatrix * normal); // Calculate normals
                intensity = pow(c - dot(viewVector, actual_normal), p); // Glow intensity based on view
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity; // Apply the calculated glow
                gl_FragColor = vec4(glow, 0.8); // Soft transparency for blending and blurring
            }
        `,
        side: THREE.BackSide, // Render only the outer halo
        blending: THREE.AdditiveBlending, // Additive blending for the glow
        transparent: true // Allow glow transparency
    });

    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(sunGlow); // Add the glow to the sun mesh

    return sun;
};

export default Sun;
