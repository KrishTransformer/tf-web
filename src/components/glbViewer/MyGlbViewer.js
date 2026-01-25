import React, { useEffect, useRef, useState } from "react";
import "./MyGlbViewer.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { useSelector } from "react-redux";
import { selectGenerate3D } from "../../selectors/CalcSelector";
import homeicon from "../../assets/myGlbViewer/home.png"
import fronticon from "../../assets/myGlbViewer/iso_front.png"
import backicon from "../../assets/myGlbViewer/iso_back.png"
import topicon from "../../assets/myGlbViewer/iso_top.png"
import bottomicon from "../../assets/myGlbViewer/iso_bottom.png"
import righticon from "../../assets/myGlbViewer/iso_right.png"
import lefticon from "../../assets/myGlbViewer/iso_left.png"
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { LuAxis3D } from "react-icons/lu";
import { FaCrosshairs } from "react-icons/fa";
import { FaHandPaper } from "react-icons/fa";


const MyGlbViewer = ({ canvasHeight, canvasWidth, open, isMaximized }) => {

  const { generate3d } = useSelector(selectGenerate3D);
  const mountRef = useRef(null);
  const [isViewerReady, setViewerReady] = useState(false);
  const [currentView, setCurrentView] = useState('default');
  // const canvasHeight = isMaximized ? canvasHeight1 + 400 : canvasHeight1;
  // const canvasWidth = isMaximized ? canvasWidth1 + 150 : canvasWidth1;

  // New state for part separation functionality
  const [parts, setParts] = useState([]);
  const [visibleParts, setVisibleParts] = useState(new Set());
  const [originalPositions, setOriginalPositions] = useState(new Map());
  const [showPartsPanel, setShowPartsPanel] = useState(false);
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, meshId: null });
  const [showDimensions, setShowDimensions] = useState(false);
  const [modelDimensions, setModelDimensions] = useState({ length: 0, width: 0, height: 0 });
  const [overlayTick, setOverlayTick] = useState(0);
  const [zoomToAreaMode, setZoomToAreaMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [defaultZoom, setDefaultZoom] = useState(1);
  const [panMode, setPanMode] = useState(false);

  // refs
  const sceneRef = useRef();
  const cameraRef = useRef();
  const modelRef = useRef();
  const controlsRef = useRef();
  const rendererRef = useRef();
  const prevZoomToAreaModeRef = useRef(false);

  // listener storage for cleanup
  const listenersRef = useRef({
    domElement: null,
    onContextMenu: null,
    onMouseDown: null,
  });

  // keep a ref copy of zoomToAreaMode so DOM handlers always read current value
  const zoomToAreaModeRef = useRef(zoomToAreaMode);
  useEffect(() => { zoomToAreaModeRef.current = zoomToAreaMode; }, [zoomToAreaMode]);

  // Reset view to default every time modal is opened
  useEffect(() => {
    if (open) {
      setTimeout(() => setView('default'), 0);
    }
  }, [open]);

  useEffect(() => {
    let sceneWidth = window.innerWidth;
    let sceneHeight = window.innerHeight;
    if (generate3d?.data?.blob) {
      init(
        generate3d?.data?.blob,
        sceneWidth,
        sceneHeight,
        mountRef,
        canvasWidth,
        canvasHeight
      );
    }

    return () => {
      try {
        const dom = listenersRef.current.domElement;
        if (dom) {
          if (listenersRef.current.onContextMenu) {
            dom.removeEventListener('contextmenu', listenersRef.current.onContextMenu, false);
          }
          if (listenersRef.current.onClick) {
            dom.removeEventListener('click', listenersRef.current.onClick, false);
          }
          if (listenersRef.current.onMouseMove) {
            dom.removeEventListener('mousemove', listenersRef.current.onMouseMove, false);
          }
        }
      } catch (err) {
        // ignore
      }

      if (rendererRef.current) {
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode === mountRef.current) {
          mountRef.current.removeChild(canvas);
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
    };
  }, [generate3d?.data?.blob]);

  function init(blob, sceneWidth, sceneHeight, mountRef, canvasWidth, canvasHeight) {
    setupScene();
    setupRenderer(mountRef, canvasWidth, canvasHeight);
    setupLighting();
    setPerspectiveCamera(sceneWidth / sceneHeight); // Temporary perspective camera
    setupControls();
    loadModel(blob, sceneWidth, sceneHeight);
  }

  function setupScene() {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
  }

  function setupRenderer(mountRef, canvasWidth, canvasHeight) {
    if (rendererRef.current) {
      const oldRenderer = rendererRef.current;
      if (oldRenderer.domElement && oldRenderer.domElement.parentNode === mountRef.current) {
        mountRef.current.removeChild(oldRenderer.domElement);
      }
      oldRenderer.dispose();
      rendererRef.current = null;
    }
    

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setClearColor(new THREE.Color(0x3a3a3a));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }
    rendererRef.current = renderer;

    // Attach DOM listeners right after renderer is created (so they always get attached)
    attachDomListeners(renderer.domElement);
  }

  const attachDomListeners = (domElement) => {
    // Clean up existing listeners
    try {
      if (listenersRef.current.domElement) {
        listenersRef.current.domElement.removeEventListener('contextmenu', listenersRef.current.onContextMenu, false);
        listenersRef.current.domElement.removeEventListener('mousedown', listenersRef.current.onMouseDown, true);
        listenersRef.current.domElement.removeEventListener('mousemove', listenersRef.current.onMouseMove, false);
      }
    } catch (err) { /* ignore */ }

    // Context menu (right-click)
    const onContextMenu = (event) => {
      event.preventDefault();

      // Only handle if in zoom mode
      if (zoomToAreaModeRef.current) {
        handleZoomToAreaClick(event);
        return;
      }

      // Otherwise, process context menu selection
      if (!modelRef.current || !cameraRef.current) {
        return;
      }

      const rect = domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const visibleMeshes = getAllVisibleMeshes(modelRef.current);
      const intersects = raycaster.intersectObjects(visibleMeshes, true);

      if (intersects.length > 0) {
        let mesh = intersects[0].object;
        let foundPartId = null;
        while (mesh) {
          if (mesh.userData && mesh.userData.partId) {
            foundPartId = mesh.userData.partId;
            break;
          }
          mesh = mesh.parent;
        }
        if (foundPartId) {
          setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            meshId: foundPartId
          });
          //console.log("foundpartID", foundPartId);
          highlightPart(foundPartId); // Highlight the selected mesh
        } else {
          setContextMenu({ visible: false, x: 0, y: 0, meshId: null });
          highlightPart(null);
        }
      } else {
        setContextMenu({ visible: false, x: 0, y: 0, meshId: null });
        highlightPart(null);
      }
    };

    // Unified click handler (both buttons) - ONLY for zoom mode
    const onClick = (event) => {
      if (zoomToAreaModeRef.current) {
        event.preventDefault();
        handleZoomToAreaClick(event);
      }
    };

    // Mouse move handler for cursor position
    const onMouseMove = (event) => {
      const rect = domElement.getBoundingClientRect();
      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      });
    };

    // Store for cleanup
    listenersRef.current = {
      domElement,
      onContextMenu,
      onClick,
      onMouseMove
    };

    // Attach new listeners
    domElement.addEventListener('contextmenu', onContextMenu, false);
    domElement.addEventListener('click', onClick, false);
    domElement.addEventListener('mousemove', onMouseMove, false);
  };

  function setupLighting() {
    const scene = sceneRef.current;
    if (!scene) return;

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

  function setPerspectiveCamera(aspectRatio = window.innerWidth / window.innerHeight) {
    const camera = new THREE.PerspectiveCamera(25, aspectRatio, 0.001, 1000);
    camera.position.z = 1000;
    cameraRef.current = camera;
  }

  function setupControls() {
    if (!cameraRef.current || !rendererRef.current) return;
    const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
    controls.rotateSpeed = 2.5;
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = true;
    controls.maxPolarAngle = Math.PI;
    controls.update();
    controlsRef.current = controls;
  }

  function loadModel(blob, sceneWidth, sceneHeight) {
    const url = blob;
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const scene = sceneRef.current;
        modelRef.current = gltf.scene;
        processModel(modelRef.current);
        scene.add(modelRef.current);

        // Extract parts and store original positions
        extractParts(modelRef.current);

        // Set orthographic camera based on loaded model bounds
        setOrthographicCamera(modelRef.current, sceneWidth, sceneHeight);

        // Dispose and recreate controls with the new camera
        if (controlsRef.current) controlsRef.current.dispose();

        if (cameraRef.current && rendererRef.current) {
          const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
          controls.rotateSpeed = 2.5;
          controls.enableDamping = true;
          controls.dampingFactor = 0.25;
          controls.screenSpacePanning = true;
          controls.maxPolarAngle = Math.PI;
          controls.update();
          controlsRef.current = controls;

          // Store default zoom level
          if (cameraRef.current.isOrthographicCamera) {
            setDefaultZoom(cameraRef.current.zoom);
          }

          setViewerReady(true); // Now viewer is fully ready
          setView("default");
          animate();
        } else {
          console.error("Camera or Renderer not initialized");
        }
      },
      undefined,
      (error) => {
        console.error("Error loading model:", error);
      }
    );
  }

  function extractParts(model) {
    const partsList = [];
    const positions = new Map();

    model.traverse((node) => {
      if (node.isMesh) {
        const partName = node.name || `Part_${partsList.length + 1}`;
        const partId = `part_${partsList.length}`;

        // Store original position
        positions.set(partId, {
          position: node.position.clone(),
          rotation: node.rotation.clone(),
          scale: node.scale.clone()
        });

        // Add part to list
        partsList.push({
          id: partId,
          name: partName,
          mesh: node,
          visible: true
        });

        // Add user data for identification
        node.userData.partId = partId;
        node.userData.partName = partName;
      }
    });

    setParts(partsList);
    setOriginalPositions(positions);
    setVisibleParts(new Set(partsList.map(part => part.id)));

    // Calculate model dimensions
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    setModelDimensions({
      length: size.x,
      width: size.y,
      height: size.z
    });
  }

  function togglePartVisibility(partId) {
    //console.log("partId:", partId);
    const newVisibleParts = new Set(visibleParts);
    if (newVisibleParts.has(partId)) {
      newVisibleParts.delete(partId);
    } else {
      newVisibleParts.add(partId);
    }
    setVisibleParts(newVisibleParts);

    // Update mesh visibility
    parts.forEach(part => {
      if (part.mesh) {
        part.mesh.visible = newVisibleParts.has(part.id);
      }
    });
  }

  // Replace the entire highlightPart function with this:
  function highlightPart(partId) {
    setHighlightedPart(partId);

    // Reset all materials to original
    modelRef.current.traverse(node => {
      if (node.isMesh && node.userData.originalMaterial) {
        node.material = node.userData.originalMaterial;
      }
    });

    // Highlight the selected part
    if (partId) {
      modelRef.current.traverse(node => {
        if (node.isMesh && node.userData.partId === partId) {
          // Store original material if not already stored
          if (!node.userData.originalMaterial) {
            node.userData.originalMaterial = node.material.clone();
          }

          // Create highlighted material
          const highlightedMaterial = node.material.clone();
          highlightedMaterial.emissive = new THREE.Color(0x444444);
          node.material = highlightedMaterial;
        }
      });
    }
  }

  function processModel(model) {
    model.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = false;
        node.receiveShadow = false;
        const edges = new THREE.EdgesGeometry(node.geometry, 50);
        const edgeLines = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({
            color: 0x444444,
            transparent: true,
            opacity: 0.7,
          })
        );
        edgeLines.raycast = () => { }; // Ignore edge lines in raycasting
        node.material.flatShading = false;
        node.material.needsUpdate = false;
        node.add(edgeLines);
      }
    });
  }

  function animate() {
    requestAnimationFrame(animate);
    if (controlsRef.current) controlsRef.current.update();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }

  function setOrthographicCamera(model, sceneWidth = window.innerWidth, sceneHeight = window.innerHeight) {
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
    modelRef.current.userData.center = center;
    const maxDim = Math.max(size.x, size.y, size.z);
    const frustumSize = maxDim * 1.5;

    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2,
      (frustumSize * aspect) / 2,
      frustumSize / 2,
      -frustumSize / 2,
      0.1,
      1000
    );

    camera.position.set(center.x, center.y, maxDim * 2);
    camera.lookAt(center);
    camera.updateProjectionMatrix();

    cameraRef.current = camera;
  }

  function setView(view) {
    if (!cameraRef.current || !controlsRef.current) return;

    // Fixed positions with consistent distances
    const positions = {
      front: [0, 0, 1],
      back: [0, 0, -1],
      top: [0, 1, 0],
      bottom: [0, -1, 0],
      right: [1, 0, 0],
      left: [-1, 0, 0],
      isometric: [1, 1, 1],
      default: [1, 1, 1],
    };

    const needsWaypoint = (currentView === 'top' && view === 'bottom') ||
      (currentView === 'bottom' && view === 'top');

    const isDefault = view === 'default';
    const zoom = isDefault ? 1.1 : undefined;

    if (needsWaypoint) {
      setCameraPositionAndZoom([1, 1, 1], zoom, 350);
      setTimeout(() => {
        const position = positions[view] || positions["isometric"];
        setCameraPositionAndZoom(position, zoom, 350);
        setCurrentView(view);
      }, 350);
    } else {
      const position = positions[view] || positions["isometric"];
      setCameraPositionAndZoom(position, zoom);
      setCurrentView(view);
    }

    if (modelRef.current && modelRef.current.userData.center) {
      controlsRef.current.target.copy(modelRef.current.userData.center);
    } else {
      controlsRef.current.target.set(0, 0, 0);
    }
    controlsRef.current.update();
  }

  function animateCameraToSpherical(targetPos, targetLookAt, duration = 1000) {
    if (!cameraRef.current || !controlsRef.current) return;

    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const endPos = targetPos.clone();
    const endTarget = targetLookAt.clone();

    const startRelative = startPos.clone().sub(startTarget);
    const endRelative = endPos.clone().sub(endTarget);

    const startSpherical = new THREE.Spherical().setFromVector3(startRelative);
    const endSpherical = new THREE.Spherical().setFromVector3(endRelative);

    if (Math.abs(endSpherical.theta - startSpherical.theta) > Math.PI) {
      if (endSpherical.theta > startSpherical.theta) {
        startSpherical.theta += 2 * Math.PI;
      } else {
        endSpherical.theta += 2 * Math.PI;
      }
    }

    const startTime = performance.now();

    function animateFn() {
      const now = performance.now();
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - t, 3);

      const currentSpherical = new THREE.Spherical(
        THREE.MathUtils.lerp(startSpherical.radius, endSpherical.radius, eased),
        THREE.MathUtils.lerp(startSpherical.phi, endSpherical.phi, eased),
        THREE.MathUtils.lerp(startSpherical.theta, endSpherical.theta, eased)
      );

      const currentRelative = new THREE.Vector3().setFromSpherical(currentSpherical);
      const currentTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, eased);
      camera.position.copy(currentRelative.add(currentTarget));
      controls.target.copy(currentTarget);

      camera.updateProjectionMatrix();
      controls.update();

      if (showDimensions) {
        setOverlayTick((t) => t + 1);
      }

      if (t < 1) {
        requestAnimationFrame(animateFn);
      }
    }
    animateFn();
  }

  function setCameraPositionAndZoom(direction, zoomFactor, duration = 1000) {
    if (!cameraRef.current || !modelRef.current) return;

    const center = modelRef.current.userData.center || new THREE.Vector3(0, 0, 0);
    const dir = new THREE.Vector3(...direction).normalize();
    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.5;
    const cameraPos = dir.multiplyScalar(distance).add(center);

    animateCameraToSpherical(cameraPos, center, duration);

    if (cameraRef.current.isOrthographicCamera && zoomFactor !== undefined) {
      cameraRef.current.zoom = zoomFactor;
      cameraRef.current.updateProjectionMatrix();
    }
  }

  function getAllVisibleMeshes(object) {
    const meshes = [];
    object.traverse(child => {
      if (child.isMesh && child.visible) {
        meshes.push(child);
      }
    });
    return meshes;
  }

  const handleZoomToAreaClick = (event) => {
    // prevent default browser behavior
    try { event.preventDefault(); } catch (e) { }
    if (!zoomToAreaModeRef.current || !rendererRef.current || !modelRef.current) return;

    const domElement = rendererRef.current.domElement;
    const rect = domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    // Raycast
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const visibleMeshes = getAllVisibleMeshes(modelRef.current);
    const intersects = raycaster.intersectObjects(visibleMeshes, true);

    if (intersects.length > 0) {
      const point = intersects[0].point;

      // Move camera target to the hit point
      controlsRef.current.target.copy(point);

      // Zoom in by increasing zoom factor (works for orthographic cameras)
      if (cameraRef.current.isOrthographicCamera) {
        const currentZoom = cameraRef.current.zoom || 1;
        cameraRef.current.zoom = currentZoom * 1.5; // Zoom in by 50%
        cameraRef.current.updateProjectionMatrix();
      } else {
        // For perspective, move camera closer along view direction
        const dir = new THREE.Vector3().subVectors(cameraRef.current.position, controlsRef.current.target).normalize();
        const moveAmount = 0.5 * new THREE.Box3().setFromObject(modelRef.current).getSize(new THREE.Vector3()).length();
        cameraRef.current.position.addScaledVector(dir, -moveAmount * 0.25); // small step
      }

      // Update controls
      controlsRef.current.update();
    }
  };

  // Update cursor when in zoom to area mode and reset zoom when turning off
  useEffect(() => {
    if (!rendererRef.current || !controlsRef.current) return;
    const domElement = rendererRef.current.domElement;

    if (zoomToAreaMode) {
      domElement.style.cursor = 'none'; // Hide default cursor
      controlsRef.current.enabled = false;
      //controlsRef.current.zoom = true;
    } else {
      domElement.style.cursor = 'auto';
      controlsRef.current.enabled = true;

      // Reset zoom to default when turning off zoom-to-area mode
      // if (prevZoomToAreaModeRef.current && cameraRef.current && cameraRef.current.isOrthographicCamera) {
      //   cameraRef.current.zoom = defaultZoom;
      //   cameraRef.current.updateProjectionMatrix();
      //   controlsRef.current.update();
      // }
    }

    prevZoomToAreaModeRef.current = zoomToAreaMode;
  }, [zoomToAreaMode, defaultZoom]);

  // ---- rest of your UI & other effects unchanged ----

  // Hide context menu on click elsewhere
  useEffect(() => {
    if (!contextMenu.visible) return;
    const handleClick = () => {
      setContextMenu({ visible: false, x: 0, y: 0, meshId: null });
      highlightPart(null); // Remove highlight when menu closes
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [contextMenu.visible]);

  const handleHideMesh = () => {
    if (!contextMenu.meshId) return;
    togglePartVisibility(contextMenu.meshId);
    setContextMenu({ visible: false, x: 0, y: 0, meshId: null });
  };
  const handleIsolateMesh = () => {
    if (!contextMenu.meshId) return;
    setVisibleParts(new Set([contextMenu.meshId]));
    parts.forEach(part => {
      if (part.mesh) part.mesh.visible = (part.id === contextMenu.meshId);
    });

    setContextMenu({ visible: false, x: 0, y: 0, meshId: null });
    highlightPart(null);
  };

  function fitMeshToWindow(mesh) {
    if (!mesh || !cameraRef.current || !controlsRef.current) return;
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fitDist = maxDim * 2;
    const dir = cameraRef.current.position.clone().sub(center).normalize();
    cameraRef.current.position.copy(center.clone().add(dir.multiplyScalar(fitDist)));
    controlsRef.current.target.copy(center);
    cameraRef.current.updateProjectionMatrix();
    controlsRef.current.update();
  }

function formatDimension(value) {
  console.log("formatDimension called with value (m):", value);

  // convert to mm
  const mmValue = value * 1000;

  // If < 10mm, show 1 decimal
  if (Math.abs(mmValue) < 10) {
    return `${mmValue.toFixed(1)} mm`;
  }

  // If not integer, show 2 decimals
  if (!Number.isInteger(mmValue)) {
    return `${mmValue.toFixed(2)} mm`;
  }

  // Otherwise integer
  return `${mmValue} mm`;
}


  const [dimensionLines, setDimensionLines] = useState([]);
  const [dimensionLabels, setDimensionLabels] = useState([]);

  useEffect(() => {
    if (!showDimensions || !modelRef.current || !rendererRef.current || !cameraRef.current) {
      dimensionLines.forEach(line => {
        if (sceneRef.current && line) sceneRef.current.remove(line);
      });
      setDimensionLines([]);
      setDimensionLabels([]);
      return;
    }

    dimensionLines.forEach(line => {
      if (sceneRef.current && line) sceneRef.current.remove(line);
    });

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const min = box.min;
    const max = box.max;

    const xStart = new THREE.Vector3(min.x, min.y, min.z);
    const xEnd = new THREE.Vector3(max.x, min.y, min.z);
    const yStart = new THREE.Vector3(min.x, min.y, min.z);
    const yEnd = new THREE.Vector3(min.x, max.y, min.z);
    const zStart = new THREE.Vector3(min.x, min.y, min.z);
    const zEnd = new THREE.Vector3(min.x, min.y, max.z);

    const material = new THREE.LineBasicMaterial({ color: 0x33b9ff, linewidth: 2 });
    function makeLine(start, end) {
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      return new THREE.Line(geometry, material);
    }
    const xLine = makeLine(xStart, xEnd);
    const yLine = makeLine(yStart, yEnd);
    const zLine = makeLine(zStart, zEnd);

    if (sceneRef.current) {
      sceneRef.current.add(xLine);
      sceneRef.current.add(yLine);
      sceneRef.current.add(zLine);
    }
    setDimensionLines([xLine, yLine, zLine]);

    function midpoint(a, b) {
      return new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
    }
    setDimensionLabels([
      { pos: midpoint(xStart, xEnd), text: `X: ${formatDimension(max.x - min.x)}` },
      { pos: midpoint(yStart, yEnd), text: `Y: ${formatDimension(max.y - min.y)}` },
      { pos: midpoint(zStart, zEnd), text: `Z: ${formatDimension(max.z - min.z)}` },
    ]);

    return () => {
      [xLine, yLine, zLine].forEach(line => {
        if (sceneRef.current && line) sceneRef.current.remove(line);
      });
    };
  }, [showDimensions, modelRef.current, rendererRef.current, cameraRef.current]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const onChange = () => {
      if (showDimensions) setOverlayTick((t) => t + 1);
    };
    controls.addEventListener('change', onChange);
    const onResize = () => {
      if (showDimensions) setOverlayTick((t) => t + 1);
    };
    window.addEventListener('resize', onResize);
    return () => {
      controls.removeEventListener('change', onChange);
      window.removeEventListener('resize', onResize);
    };
  }, [controlsRef.current, showDimensions]);

  function toScreenPosition(objPos) {
    if (!rendererRef.current || !cameraRef.current) return { left: 0, top: 0 };
    const width = rendererRef.current.domElement.width;
    const height = rendererRef.current.domElement.height;
    const vector = objPos.clone().project(cameraRef.current);
    return {
      left: ((vector.x + 1) / 2) * width,
      top: (-(vector.y - 1) / 2) * height
    };
  }

  useEffect(() => {
    if (!controlsRef.current) return;

    if (panMode) {
      // Configure controls for pan-only mode
      controlsRef.current.enableRotate = false;
      //controlsRef.current.enableZoom = false;
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    } else {
      // Restore default controls
      controlsRef.current.enableRotate = true;
      controlsRef.current.enableZoom = true;
      controlsRef.current.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      };
    }
  }, [panMode]);

  useEffect(() => {
    if (rendererRef.current) {
      // Just update renderer size - don't recreate scene
      rendererRef.current.setSize(canvasWidth, canvasHeight);
      
      // Update camera aspect ratio
      if (cameraRef.current) {
        if (cameraRef.current.isOrthographicCamera) {
          const aspect = canvasWidth / canvasHeight;
          const frustumSize = cameraRef.current.top * 2;
          cameraRef.current.left = -frustumSize * aspect / 2;
          cameraRef.current.right = frustumSize * aspect / 2;
        } else {
          cameraRef.current.aspect = canvasWidth / canvasHeight;
        }
        cameraRef.current.updateProjectionMatrix();
      }
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  }, [canvasWidth, canvasHeight]);
  return (
    <div className="glbviewer" >
      <div className="glbviewer-canvas-area" ref={mountRef}>

        {/* <div ref={mountRef} style={{ width: '100%', height: '100%' }} /> */}

        {/* Custom crosshair and selection box */}
        {zoomToAreaMode && (
          <>
            <div style={{
              position: 'absolute',
              left: cursorPosition.x - 50,
              top: cursorPosition.y - 50,
              width: 100,
              height: 100,
              border: '2px dashed #33b9ff',
              pointerEvents: 'none',
              zIndex: 20
            }} />
            <div style={{
              position: 'absolute',
              left: cursorPosition.x - 15,
              top: cursorPosition.y - 15,
              width: 30,
              height: 30,
              pointerEvents: 'none',
              zIndex: 21
            }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Horizontal line */}
                <line x1="0" y1="15" x2="30" y2="15" stroke="#33b9ff" strokeWidth="2" />
                {/* Vertical line */}
                <line x1="15" y1="0" x2="15" y2="30" stroke="#33b9ff" strokeWidth="2" />
                {/* Outer circle */}
                <circle cx="15" cy="15" r="12" stroke="#33b9ff" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </>
        )}

        {/* Parts Panel */}
        {generate3d?.data?.blob && open && (
          <div className="parts-panel" style={{
            position: 'absolute',
            top: 70,
            left: 25,
            zIndex: 10,
            display: showPartsPanel ? 'flex' : 'none',
            flexDirection: 'column',
            gap: 8,
            pointerEvents: 'auto',
            border: '2px solid #111',
            borderRadius: 15,
            background: '#fff',
            padding: 15,
            maxHeight: '385px',
            overflowY: 'auto',
            minWidth: '200px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Parts ({parts.length})</h4>
              <button
                onClick={() => setShowPartsPanel(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              <button
                onClick={() => {
                  const allParts = new Set(parts.map(part => part.id));
                  setVisibleParts(allParts);
                  parts.forEach(part => {
                    if (part.mesh) part.mesh.visible = true;
                  });
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Show All
              </button>
              <button
                onClick={() => {
                  setVisibleParts(new Set());
                  parts.forEach(part => {
                    if (part.mesh) part.mesh.visible = false;
                  });
                }}
                style={{
                  flex: 1,
                  padding: '6px 8px',
                  background: '#ffffff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                Hide All
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {parts.map((part) => (
                <div
                  key={part.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    background: highlightedPart === part.id ? '#f0f8ff' : 'transparent',
                    border: highlightedPart === part.id ? '1px solid #33b9ff' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={() => highlightPart(part.id)}
                  onMouseLeave={() => highlightPart(null)}
                >
                  <span onClick={e => { e.stopPropagation(); togglePartVisibility(part.id); }} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    {visibleParts.has(part.id) ? (
                      <VisibilityOutlinedIcon style={{ color: '#000000' }} />
                    ) : (
                      <VisibilityOffOutlinedIcon style={{ color: '#bbb' }} />
                    )}
                  </span>
                  <span style={{
                    fontSize: '13px',
                    color: visibleParts.has(part.id) ? '#333' : '#999',
                    textDecoration: visibleParts.has(part.id) ? 'none' : 'line-through'
                  }}>
                    {part.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parts Panel Toggle Button */}
        {generate3d?.data?.blob && open && (
          <button
            className="parts-toggle-btn"
            onClick={() => setShowPartsPanel(!showPartsPanel)}
            style={{
              position: 'absolute',
              top: 70,
              left: 25,
              zIndex: 10,
              display: showPartsPanel ? 'none' : 'block',
              padding: '8px 12px',
              background: '#ffffff',
              border: '2px solid #111',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Parts ({parts.length})
          </button>
        )}

        {generate3d?.data?.blob && open && (
          <>
            <div className="views-overlay" style={{ position: 'absolute', top: 70, right: 25, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto', border: '2px solid #111', borderRadius: 15, background: '#fff', padding: 5 }}>
              <button className="button" onClick={() => setView("front")} disabled={!isViewerReady}>
                <img src={fronticon} alt="Front" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Front</span>
              </button>
              <button className="button" onClick={() => setView("back")} disabled={!isViewerReady}>
                <img src={backicon} alt="Back" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Back</span>
              </button>
              <button className="button" onClick={() => setView("top")} disabled={!isViewerReady}>
                <img src={topicon} alt="Top" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Top</span>
              </button>
              <button className="button" onClick={() => setView("bottom")} disabled={!isViewerReady}>
                <img src={bottomicon} alt="Bottom" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Bottom</span>
              </button>
              <button className="button" onClick={() => setView("right")} disabled={!isViewerReady}>
                <img src={righticon} alt="Right" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Right</span>
              </button>
              <button className="button" onClick={() => setView("left")} disabled={!isViewerReady}>
                <img src={lefticon} alt="Left" style={{ width: 32, height: 32 }} />
                <span className="custom-tooltip">Left</span>
              </button>
              <button className="button" onClick={() => setView("default")} disabled={!isViewerReady}>
                <span className="custom-tooltip" >Default</span>
                <img src={homeicon} alt="Default" style={{ width: 32, height: 32 }} />
              </button>

              {/* <button
              className="button"
              onClick={() => setShowDimensions(!showDimensions)}
              disabled={!isViewerReady}
              style={{
                background: showDimensions ? '#33b9ff' : 'transparent',
                borderRadius: '8px',
                padding: '4px',
                border: showDimensions ? '2px solid #33b9ff' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LuAxis3D size={28} color={showDimensions ? '#fff' : '#333'} />
              <span className="custom-tooltip">Bounding Box Dimensions</span>
            </button>

            <button
              className="button"
              onClick={() => setZoomToAreaMode(!zoomToAreaMode)}
              disabled={!isViewerReady}
              style={{
                background: zoomToAreaMode ? '#33b9ff' : 'transparent',
                borderRadius: '8px',
                padding: '4px',
                border: zoomToAreaMode ? '2px solid #33b9ff' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaCrosshairs size={28} color={zoomToAreaMode ? '#fff' : '#333'} />
              <span className="custom-tooltip">Zoom to Area</span>
            </button>

            <button
              className="button"
              onClick={() => {
                setPanMode(!panMode);
                setZoomToAreaMode(false); // Disable zoom mode if active
              }}
              disabled={!isViewerReady}
              style={{
                background: panMode ? '#33b9ff' : 'transparent',
                borderRadius: '8px',
                padding: '4px',
                border: panMode ? '2px solid #33b9ff' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaHandPaper size={28} color={panMode ? '#fff' : '#333'} />
              <span className="custom-tooltip">Pan Mode</span>
            </button> */}

            </div>

            <div className="views-overlay" style={{ position: 'absolute', top: 415, right: 25, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'auto', border: '2px solid #111', borderRadius: 15, background: '#fff', padding: 5 }}>
              <button
                className="button"
                onClick={() => setShowDimensions(!showDimensions)}
                disabled={!isViewerReady}
                style={{
                  background: showDimensions ? '#33b9ff' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px',
                  border: showDimensions ? '2px solid #33b9ff' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LuAxis3D size={28} color={showDimensions ? '#fff' : '#333'} />
                <span className="custom-tooltip">Bounding Box Dimensions</span>
              </button>

              <button
                className="button"
                onClick={() => setZoomToAreaMode(!zoomToAreaMode)}
                disabled={!isViewerReady}
                style={{
                  background: zoomToAreaMode ? '#33b9ff' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px',
                  border: zoomToAreaMode ? '2px solid #33b9ff' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaCrosshairs size={28} color={zoomToAreaMode ? '#fff' : '#333'} />
                <span className="custom-tooltip">Zoom to Area</span>
              </button>

              <button
                className="button"
                onClick={() => {
                  setPanMode(!panMode);
                  setZoomToAreaMode(false); // Disable zoom mode if active
                }}
                disabled={!isViewerReady}
                style={{
                  background: panMode ? '#33b9ff' : 'transparent',
                  borderRadius: '8px',
                  padding: '4px',
                  border: panMode ? '2px solid #33b9ff' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaHandPaper size={28} color={panMode ? '#fff' : '#333'} />
                <span className="custom-tooltip">Pan Mode</span>
              </button>
            </div>
          </>
        )}

        {showDimensions && generate3d?.data?.blob && open && dimensionLabels.length > 0 && (
          <>
            {dimensionLabels.map((label, idx) => {
              const pos = toScreenPosition(label.pos);
              return (
                <div key={idx} style={{
                  position: 'absolute',
                  left: pos.left,
                  top: pos.top,
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(0,0,0,0.85)',
                  color: '#fff',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  pointerEvents: 'none',
                  zIndex: 100
                }}>{label.text}</div>
              );
            })}
          </>
        )}

        {contextMenu.visible && (
          <div style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000,
            background: '#222',
            color: '#fff',
            borderRadius: 10,
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            minWidth: 180,
            padding: 0,
            fontSize: 16,
            overflow: 'hidden',
          }}
            onContextMenu={e => e.preventDefault()}
            onMouseDown={e => e.stopPropagation()}
          >
            <div style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #444' }} onClick={handleHideMesh}>
              Hide mesh
            </div>
            <div style={{ padding: '14px 20px', cursor: 'pointer' }} onClick={handleIsolateMesh}>
              Isolate mesh
            </div>
          </div>
        )}

      </div>
    </div>
  );

};

export default MyGlbViewer;
