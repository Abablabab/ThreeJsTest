import * as THREE from './modules/three.module.js';
//import {ColladaLoader} from './modules/ColladaLoader.js';
import {OrbitControls} from './modules/OrbitControls.js';

// First we need to set up Three
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({canvas});

// Define camera params and create
const fov = 45;
const aspect = 2;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0,10,0);

// Set up some controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);
controls.update();

// Now set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('blue');

// Give us a checkerboard base to orientate from
{
    // First the texture
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./images/checker.png');
    texture.wrapS = THREE.RepeatWrapping; // horizontal
    texture.wrapT = THREE.RepeatWrapping; // vertical
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2; // Our texture is 2px, so half size
    texture.repeat.set(repeats, repeats);

    // Then the textured mesh
    const planeGeometry = new THREE.PlaneBufferGeometry(planeSize, planeSize);
    const planeMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeometry,planeMaterial);
    mesh.rotation.x = Math.Pi * -.5; // Great, radian maths.

    scene.add(mesh);
}

// Now we need lights to see what we're doing
{
    const skyColor = 0xB1E1FF;  // light blue
    const groundColor = 0xB97A20;  // brownish orange
    const intensity = 1;
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    scene.add(light);
}

// And at last kicking off the rendering
requestAnimationFrame(render);

function doNeedResize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
}

function render() {
    if (doNeedResize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer,render(scene, camera);
    requestAnimationFrame(render);
}
