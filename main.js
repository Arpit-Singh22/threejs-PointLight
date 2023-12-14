import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ColorGUIHelper } from "./ColorGUIHelper";
import GUI from "lil-gui";

const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
camera.position.set(0, 10, 20);

const planeSize = 40;

const loader = new THREE.TextureLoader();
const texture = loader.load("../public/pxfuel.jpg");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
texture.colorSpace = THREE.SRGBColorSpace;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const material = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(planeGeo, material);
mesh.rotation.x = Math.PI * -0.5;
scene.add(mesh);

{
  const cubeSize = 4;
  const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMat = new THREE.MeshPhongMaterial({ color: "#8AC" });
  const mesh = new THREE.Mesh(cubeGeo, cubeMat);
  mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
  scene.add(mesh);
}
{
  const sphereRadius = 3;
  const sphereWidthDivisions = 32;
  const sphereHeightDivisions = 16;
  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    sphereWidthDivisions,
    sphereHeightDivisions
  );
  const sphereMat = new THREE.MeshPhongMaterial({ color: "#CA8" });
  const mesh = new THREE.Mesh(sphereGeo, sphereMat);
  mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
  scene.add(mesh);
}

// Point light
const color = 0xffffff;
const intensity = 150;
const light = new THREE.PointLight(color, intensity);
light.position.set(0, 10, 0);
scene.add(light);

// Point light helper
const helper = new THREE.PointLightHelper(light);
scene.add(helper);
function updateLight() {
  helper.update();
}
updateLight();

const gui = new GUI();

// for point light
gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
gui.add(light, "intensity", 0, 2, 0.01);
gui.add(light, "distance", 0, 40).onChange(updateLight);

function makeXYZGUI(gui, vector3, name, onChangeFn) {
  const folder = gui.addFolder(name);
  folder.add(vector3, "x", -10, 10).onChange(onChangeFn);
  folder.add(vector3, "y", 0, 10).onChange(onChangeFn);
  folder.add(vector3, "z", -10, 10).onChange(onChangeFn);
  folder.open();
}

makeXYZGUI(gui, light.position, "position", updateLight);

const canvas = document.querySelector("canvas.threejs");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);

const render = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(render);
};
render();
