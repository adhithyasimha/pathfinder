import * as THREE from 'three';

const StarField = () => {
    const starCount = 10000;
    const starGeometry = new THREE.BufferGeometry();

    // Generate star positions in a spherical distribution
    const starVertices = [];
    const minRadius = 500; // Minimum radius to avoid stars in the inner side
    const maxRadius = 1000; // Maximum radius for outer stars

    for (let i = 0; i < starCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = minRadius + Math.random() * (maxRadius - minRadius); // Adjust the radius for more outer stars
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    // Shader material to make stars round using GLSL
    const starMaterial = new THREE.ShaderMaterial({
        uniforms: {
            pointSize: { value: 3.0 }, // Adjust this to make stars smaller
            starColor: { value: new THREE.Color(0xFFFFFF) }
        },
        vertexShader: `
            varying float vAlpha;
            uniform float pointSize;
            void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = pointSize * (300.0 / -mvPosition.z); // Size attenuation
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform vec3 starColor;
            void main() {
                vec2 coord = gl_PointCoord - vec2(0.5);
                if (length(coord) > 0.5) {
                    discard; // Discard pixels outside the circle
                }
                gl_FragColor = vec4(starColor, 0.7); // Reduced opacity
            }
        `,
        transparent: true
    });

    return new THREE.Points(starGeometry, starMaterial);
};

export default StarField;