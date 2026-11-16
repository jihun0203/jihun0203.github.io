// Rotating turntable viewers for the BIM models on the home page.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Site palette: largest part gets light concrete, smaller parts get mint accents.
const PALETTE = ['#bdbab3', '#a6a39c', '#8b5a3c', '#6e7276', '#8f8d87'];
const EDGE_COLOR = 0x3a3d40;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const loader = new GLTFLoader();

function triCount(mesh) {
  const g = mesh.geometry;
  return g.index ? g.index.count / 3 : g.attributes.position.count / 3;
}

function setupViewer(stage) {
  const canvas = stage.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb7d8d5, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 1.6);
  sun.position.set(1, 2, 1.4);
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.enableDamping = true;
  canvas.style.touchAction = 'pan-y'; // keep vertical page scroll on phones
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.autoRotate = !reducedMotion;
  controls.autoRotateSpeed = 1.6;

  // The turntable: model and disc spin together.
  const turntable = new THREE.Group();
  scene.add(turntable);

  let visible = false;
  let running = false;

  function resize() {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function frame() {
    if (!visible) { running = false; return; }
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  loader.load(stage.dataset.model, (gltf) => {
    const model = gltf.scene;
    const meshes = [];
    model.traverse((o) => { if (o.isMesh) meshes.push(o); });
    meshes.sort((a, b) => triCount(b) - triCount(a));
    const colors = stage.dataset.colors ? stage.dataset.colors.split(',') : PALETTE;
    meshes.forEach((mesh, i) => {
      mesh.material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(colors[i % colors.length]),
        roughness: 0.85,
        flatShading: true, // GLBs carry no normals; derive per-face normals in the shader
        metalness: 0,
        side: THREE.DoubleSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      });
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry, 35),
        new THREE.LineBasicMaterial({ color: EDGE_COLOR, transparent: true, opacity: 0.35 })
      );
      mesh.add(edges);
    });

    // Normalise every model to a unit-ish size sitting on the disc.
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const scale = 2 / Math.max(size.x, size.z);
    model.position.set(-centre.x * scale, -box.min.y * scale, -centre.z * scale);
    model.scale.setScalar(scale);
    turntable.add(model);

    const radius = Math.hypot(size.x, size.z) * scale / 2;
    const height = size.y * scale;

    const target = new THREE.Vector3(0, height * 0.35, 0);
    const dist = Math.max(radius, height) * 3.1;
    camera.position.set(dist * 0.7, dist * 0.55, dist * 0.7).add(target);
    controls.target.copy(target);
    camera.near = dist / 100;
    camera.far = dist * 10;
    resize();
    controls.update();
    renderer.render(scene, camera);
    stage.classList.add('is-loaded');
    if (visible) start();
  }, undefined, () => {
    stage.classList.add('is-error');
  });

  new ResizeObserver(() => { resize(); renderer.render(scene, camera); }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && stage.classList.contains('is-loaded')) start();
  }, { rootMargin: '80px' }).observe(stage);
}

// Load each viewer only when it is about to scroll into view.
const lazy = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    obs.unobserve(entry.target);
    setupViewer(entry.target);
  });
}, { rootMargin: '200px' });

document.querySelectorAll('.model-stage[data-model]').forEach((el) => lazy.observe(el));
