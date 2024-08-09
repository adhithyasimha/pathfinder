import { useEffect, useRef } from 'react';
import * as BABYLON from 'babylonjs';

const BabylonScene = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const engine = new BABYLON.Engine(canvas, true);

        const createScene = () => {
            const scene = new BABYLON.Scene(engine);
            scene.clearColor = new BABYLON.Color3(0, 0, 0);

            const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, BABYLON.Vector3.Zero(), scene);
            camera.setPosition(new BABYLON.Vector3(0, 50, -100));
            camera.attachControl(canvas, true);

            const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

            const sun = BABYLON.MeshBuilder.CreateSphere("sun", { diameter: 10 }, scene);
            const sunMaterial = new BABYLON.StandardMaterial("sunMaterial", scene);
            sunMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0);
            sun.material = sunMaterial;
            const mercuryTexture = new BABYLON.Texture("/textures/mercury.jpg", scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE, null, (message) => {
                console.error("Error loading Mercury texture:", message);
            });
            const marsTexture = new BABYLON.Texture("/textures/mars.jpg", scene);
            const earthTexture = new BABYLON.Texture("/textures/earth.jpg", scene);
            

            const planetsData = [
                {
                    name: "Mercury",
                    diameter: 2.383,
                    orbit: 15,
                    texture:mercuryTexture,
                    color: new BABYLON.Color3(0.5, 0.5, 0.5),
                    speed: 0.02
                },
                {
                    name: "Venus",
                    diameter: 3.949,
                    orbit: 20,
                    color: new BABYLON.Color3(0.9, 0.7, 0.4),
                    speed: 0.015
                },
                {
                    name: "Earth",
                    diameter: 6,
                    orbit: 30,
                    texture: earthTexture,
                    color: new BABYLON.Color3(0.2, 0.4, 0.9),
                    speed: 0.01
                },
                {
                    name: "Mars",
                    diameter: 4.532,
                    orbit: 40,
                    texture: marsTexture, 
                    speed: 0.008
                },
            ];

            const planets = planetsData.map(data => {
                const planet = BABYLON.MeshBuilder.CreateSphere(data.name, { diameter: data.diameter }, scene);
                const material = new BABYLON.StandardMaterial(data.name + "Material", scene);
                if (data.texture) {
                    material.diffuseTexture = data.texture;
                } else {
                    material.diffuseColor = data.color;
                }
                planet.material = material;
                planet.orbit = data.orbit;
                planet.position.x = data.orbit;
                planet.speed = data.speed;

                const orbitLine = BABYLON.MeshBuilder.CreateTube(data.name + "Orbit", {
                    path: (() => {
                        const points = [];
                        for (let i = 0; i < 360; i++) {
                            const angle = i * (Math.PI / 180);
                            points.push(new BABYLON.Vector3(Math.cos(angle) * data.orbit, 0, Math.sin(angle) * data.orbit));
                        }
                        return points;
                    })(),
                    radius: 0.02,
                    sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                    updatable: false
                }, scene);

                const orbitMaterial = new BABYLON.StandardMaterial(data.name + "OrbitMaterial", scene);
                orbitMaterial.emissiveColor = new BABYLON.Color3(0.5, 0.5, 0.5);
                orbitLine.material = orbitMaterial;

                planet.actionManager = new BABYLON.ActionManager(scene);
                planet.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function() {
                    zoomToPlanet(planet);
                }));

                return planet;
            });

            scene.registerBeforeRender(function() {
                planets.forEach(function(planet) {
                    planet.rotation.y += 0.005;
                    const angle = performance.now() * 0.001 * planet.speed;
                    planet.position.x = Math.cos(angle) * planet.orbit;
                    planet.position.z = Math.sin(angle) * planet.orbit;
                });
            });

            function zoomToPlanet(planet) {
                const animationDuration = 1000;
                const frameRate = 60;
                const cameraAnimation = new BABYLON.Animation("cameraAnimation", "position", frameRate, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
                const targetPosition = planet.position.clone();
                targetPosition.y += 5;
                const keys = [{
                    frame: 0,
                    value: camera.position.clone()
                }, {
                    frame: frameRate,
                    value: targetPosition
                }];
                cameraAnimation.setKeys(keys);
                camera.animations = [];
                camera.animations.push(cameraAnimation);
                scene.beginAnimation(camera, 0, frameRate, false, 1, () => {
                    camera.setTarget(planet.position);
                });
            }

            return scene;
        };

        const scene = createScene();
        engine.runRenderLoop(function() {
            scene.render();
        });

        window.addEventListener("resize", function() {
            engine.resize();
        });

        return () => {
            engine.dispose();
        };
    }, []);

    return (
        <canvas ref={canvasRef} id="renderCanvas" style={{ width: '100%', height: '100%' }}></canvas>
    );
};

export default BabylonScene;
