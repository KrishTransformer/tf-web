import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';



// Global Variables
let scene, camera, model, controls;
let isOrthographic = true;

export function init(modelPath, sceneWidth, sceneHeight, aspectRatio, mountRef, renderer) {
    setupScene();
    setupRenderer(sceneWidth, sceneHeight, mountRef, renderer);
    setupLighting();
    setupCamera(aspectRatio);
    setupControls(renderer);
    // setupEventListeners();
    loadModel(modelPath, sceneWidth, sceneHeight);
    animate(renderer);
}


// Scene Setup
function setupScene() {
    scene = new THREE.Scene();
}

// Renderer Setup
function setupRenderer(sceneWidth, sceneHeight, mountRef, renderer) {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(sceneWidth, sceneHeight);
    renderer.setClearColor(new THREE.Color(0x3A3A3A)); // Background Color
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    mountRef.current.appendChild(renderer?.domElement);
}

// Lighting Setup
function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight1.position.set(5, 10, 7.5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(-5, -10, -7.5);
    directionalLight2.castShadow = true;
    scene.add(directionalLight2);
}

// Camera Setup (Default: Perspective)
function setupCamera(aspectRatio) {
    setPerspectiveCamera(aspectRatio);
}

// OrbitControls Setup
function setupControls(renderer) {
    controls = new OrbitControls(camera, renderer?.domElement);
    controls.rotateSpeed = 2.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI;
    controls.update();
}



function loadModel(modelFilePath,sceneWidth, sceneHeight) {
    if (!modelFilePath) {
        console.error('No model file specified in the query string.');
        return;
    }

    fetch(modelFilePath)
        .then(response => {
            if (!response.ok) throw new Error('Model file not found');
            return response.blob();
        })
        .then(blob => {
		document.getElementById("loadingOverlay").style.display = "flex";
            const url = URL.createObjectURL(blob);
            const loader = new GLTFLoader();

            loader.load(url, (gltf) => {
                model = gltf.scene;  
                processModel(model);
                scene.add(model);
                setOrthographicCamera(model,sceneWidth, sceneHeight);
                controls.object = camera;
                controls.update();
				document.getElementById("loadingOverlay").style.display = "none";
				document.getElementById("homeButton")?.click();
            }, undefined, (error) => {
                console.error('Error loading model:', error);
            });
        })
        .catch(error => console.error('Error fetching model:', error));
}


// Process Model
function processModel(model) {
    model.traverse((node) => {
        if (node.isMesh) {
            node.castShadow = false;
            node.receiveShadow = false;

            const edges = new THREE.EdgesGeometry(node.geometry, 50);
            const edgeLines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.7
            }));

            node.material.flatShading = false;
            node.material.needsUpdate = false;
            node.add(edgeLines);
        }
    });
}

// Animate Scene
function animate(renderer) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// Camera Modes
function toggleCameraMode(mode) {
    if (mode === 'perspective') {
        setPerspectiveCamera();
    } else {
        setOrthographicCamera(model);
    }
    controls.dispose();
    setupControls();
}

// Perspective Camera
function setPerspectiveCamera(aspectRatio) {
    camera = new THREE.PerspectiveCamera(25, aspectRatio, 0.001, 1000);
    camera.position.z = 1000;
}

// Orthographic Camera
function setOrthographicCamera(model,sceneWidth, sceneHeight) {
    if (!model) return;

    const width = sceneWidth;
    const height = sceneHeight;
    const aspect = width / height;

    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);

    if (box.isEmpty()) {
        console.error("Bounding box is empty! Model might not be loaded.");
        return;
    }

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const frustumSize = maxDim * 1.5;

    camera = new THREE.OrthographicCamera(
        (-frustumSize * aspect) / 2, (frustumSize * aspect) / 2,
        frustumSize / 2, -frustumSize / 2, 0.1, 1000
    );

    camera.position.set(center.x, center.y, maxDim * 2);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
}


// Camera View Positions
function setView(view) {
    const positions = {
        front: [0, 0, 1],
        back: [0, 0, -1],
        top: [0, 1, 0],
        bottom: [0, -1, 0],
        right: [1, 0, 0],
        left: [-1, 0, 0],
        isometric: [1, 1, 1]
    };

    const position = positions[view] || positions['isometric'];
    setCameraPositionAndZoom(position);
    controls.target.set(0, 0, 0);
    controls.update();
}

// Adjust Camera Position & Zoom
function setCameraPositionAndZoom(position, zoomFactor = 0.875) {
    camera.position.set(...position);
    if (camera.isOrthographicCamera) {
        camera.zoom = zoomFactor;
    } else {
        camera.position.multiplyScalar(1.25);
    }
    camera.updateProjectionMatrix();
}


// Window Resize Handler
function onWindowResize(aspectRatio, sceneWidth, sceneHeight, renderer) {
    // aspectRatio = window.innerWidth / window.innerHeight;
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();
    renderer.setSize(sceneWidth, sceneHeight);
}


function zoomIn() {
    if (isOrthographic) {
      camera.zoom = Math.min(camera.zoom + 0.1, 5);
      camera.updateProjectionMatrix();
    } else {
      camera.fov = Math.max(camera.fov - 5, 10);
      camera.updateProjectionMatrix();
    }
    controls.update();
  }
  
  function zoomOut() {
    if (isOrthographic) {
      camera.zoom = Math.max(camera.zoom - 0.1, 0.1);
      camera.updateProjectionMatrix();
    } else {
      camera.fov = Math.min(camera.fov + 5, 150);
      camera.updateProjectionMatrix();
    }
    controls.update();
  }
  

  function switchCameraMode(sceneWidth, sceneHeight) {
    if (isOrthographic) {
        camera = new THREE.PerspectiveCamera(75, sceneWidth / sceneHeight, 0.1, 1000);
        isOrthographic = false;
    } else {
        const aspect = sceneWidth / sceneHeight;
        camera = new THREE.OrthographicCamera(-aspect * 5, aspect * 5, 5, -5, 0.1, 1000);
        isOrthographic = true;
    }

    camera.position.set(0, 2, 5);
    controls.object = camera;
    camera.updateProjectionMatrix();
}


