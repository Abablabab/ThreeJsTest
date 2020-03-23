import * as THREE from './modules/three.module.js';
import {ColladaLoader} from './modules/ColladaLoader.js';
import {OrbitControls} from './modules/OrbitControls.js';

var camera, controls, scene, renderer;

init();
animate(); // or render() for static scenes?

function init() {

    // Three setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 4000 );
    camera.position.set( 0, 0, 0 );

    // controls
	controls = new OrbitControls( camera, renderer.domElement );
    
    //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 5000;
    controls.maxPolarAngle = Math.PI / 2;

    // world
    var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );

    for ( var i = 0; i < 500; i ++ ) {
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = Math.random() * 1600 - 800;
        mesh.position.y = 0;
        mesh.position.z = Math.random() * 1600 - 800;
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        scene.add( mesh );
    }
    
    // Load Model(s)
    var loadingManager = new THREE.LoadingManager( function () {
        scene.add( elf );
    } );
    var loader = new ColladaLoader( loadingManager );
    loader.load( './model/elf.dae', function ( collada ) {
        elf = collada.scene;
	} );

	// lights
    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );

    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );

    var light = new THREE.AmbientLight( 0x222222 );
    scene.add( light );

    //
    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();
}

function render() {
    renderer.render( scene, camera );
}
