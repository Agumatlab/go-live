// import './darkmode.css'
// import './style.css'
// import './page1.css'
// import './page2.css'
// import './page3.css'
// import './page4.css'
// import './page5.css'
// import './page6.css'
// import './page7.css'
// import './page8.css'
// import './page9.css'
// import './navigationmenu.css'

import * as THREE from '../node_modules/three'
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'lil-gui' // <--not used for now
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js'
// import { randFloat } from 'three/src/math/MathUtils'


// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ------------BEGIN OF FAVOURITE THEME COLOR
    const colorThemes = document.querySelectorAll('[name="theme"]');

    // store theme
    const storeTheme = function (theme) {
    localStorage.setItem("theme", theme);
    };

    // set theme when visitor returns
    const setTheme = function () {
    const activeTheme = localStorage.getItem("theme");
    colorThemes.forEach((themeOption) => {
        if (themeOption.id === activeTheme) {
        themeOption.checked = true;
        }
    });
    // fallback for no ':has()' support
    document.documentElement.className = activeTheme;
    };

    colorThemes.forEach((themeOption) => {
    themeOption.addEventListener("click", () => {
        storeTheme(themeOption.id);
        // fallback for no :has() support
        document.documentElement.className = themeOption.id;
    });
    });

    document.onload = setTheme();
// END----------------------------------------

// ---------------------------------------MENU
    var icons = document.querySelectorAll('.list');
    
    icons.forEach((item) => 
        item.addEventListener("click", function (){
        if (item.classList.contains('active')){
            item.classList.remove('active')
        } else {
            item.classList.add('active')
            if (item.id=="navmoveup"){ item.classList.remove('active')}
        }
        })
    )
// END------------------------------------------

// ------------4AGER FOUNDERS ROTATION ANIMATION
    const ritmo = 6000;
    const changeFounder = function(){
        var actualfounder = document.querySelector('#founders input:checked')
        var nextfounder = document.querySelector('#founders input:checked+input')
        if (!nextfounder){nextfounder=document.querySelector('#founders #f1')}
        actualfounder.checked=false;
        nextfounder.checked=true;
    };
    var founderPeriod = setInterval(changeFounder,ritmo)

    const founders = document.querySelectorAll('#founders input')
    founders.forEach( (f)=> {f.addEventListener('click',function(){
        clearInterval(founderPeriod)
        founderPeriod = setInterval(changeFounder,ritmo);
        })
    })
// END------------------------------------------


// Scene
const scene = new THREE.Scene()
const canvas = document.querySelector('canvas.webgl')

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const light = new THREE.AmbientLight( 0xFFFFFF,0.85 ); // soft white light
light.position.set(0,20,5)
scene.add( light ); 

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader)
var sat1,sat2,terra, redlight;

loader.load( 'models/MyGMaps/Satellite.glb', function ( gltf ) {
    
	
    sat1 = gltf.scene.children[0]
    redlight = new THREE.SpotLight( 0x00ff00, 1e10, 0, Math.PI/100 ,2,2);
    sat1.add(redlight)
    
    sat2 = gltf.scene.clone()

    scene.add(sat1)
    scene.add(sat2)

    // console.log(sat1)
    
    }, undefined, function ( error ) { console.error( error ); } 
);


loader.load( 'models/MyGMaps/terra.glb', function ( gltf ) {
    
	scene.add( gltf.scene );
    terra=gltf.scene.children[0]
    terra.metalness = 0;
    terra.roughness = 1;
    }, undefined, function ( error ) { console.error( error ); } 
);

// Sizes
const sizes = {   width: 800,    height: 600}

// Camera
const camera = new THREE.OrthographicCamera(-15,15,15,-15,-50,50)
camera.position.set(3,3,3)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enablePan = false;

const pi=Math.PI

controls.target.set(0, 1, 0)
controls.maxZoom = 100;
controls.minZoom = 0.8;

controls.maxPolarAngle = pi/2;
controls.minPolarAngle = 0;


controls.enableDamping = true;
controls.autoRotateSpeed = .1
controls.update()

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)  // VA PER ULTIMO!!!
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let previousTime = 0

var ang = 0, aa=0, bb=0, ii=0
const r=10, h=9, pace=50;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation 
    // empty for now
 
    controls.autoRotate = (controls.getPolarAngle() >1)? true : false;

    // Update controls
    controls.update()

    renderer.render(scene, camera)

    if (sat1){
      
    ang += .001

    sat1.position.set(r*Math.cos(ang),   h,r*Math.sin(ang)   )
    sat2.position.set(r*Math.cos(ang+pi),h,r*Math.sin(ang+pi))
    
    // sat1.rotation.set(0+aa,-ang,   -150/180*pi+bb)
    // sat2.rotation.set(0+aa,-ang+pi,-150/180*pi+bb)

    sat1.rotation.set(0,-ang,   -150/180*pi)
    sat2.rotation.set(0,-ang+pi,-150/180*pi)
    
    
    sat1.children[0].position.set(sat1.position.x,sat1.position.y,sat1.position.z)
    sat1.children[0].target.position.set( aa, 1, bb)

    sat2.children[0].children[0].position.set(sat2.position.x,sat2.position.y,sat2.position.z)
    // sat2.children[0].children[0].target.position.set( aa, 1, bb)
    
    // console.log(sat2)
    ii = ii > pace ? 0 : ii+1;
    if (ii==pace){
        aa = (Math.random()*1 -0.5)*40/180*pi;
        bb = (Math.random()*1 -0.5)*40/180*pi;       
    }
      
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


// SPOSTA LA ZOLLA A LATO durante la story e FAI APPARIRE I CAPITOLI---------
if (
    "IntersectionObserver" in window &&
    "IntersectionObserverEntry" in window &&
    "intersectionRatio" in window.IntersectionObserverEntry.prototype) 
{
    let moveToRight = new IntersectionObserver(entries => {
    entries[0].isIntersecting? canvasMain.classList.remove("not-at-top"):canvasMain.classList.add("not-at-top");
    });

    let restoreInTheEnd = new IntersectionObserver(entries => {
        entries[0].isIntersecting? canvasMain.classList.remove("not-at-top"):canvasMain.classList.add("not-at-top");
    });
    
  moveToRight.observe( welcome );
  restoreInTheEnd.observe( document.getElementById('p9') );
}
// FINE-----------------------------------------------------------------------






/* SLIDER CHE SI SPOSTA A MANO--------------------------------------- */
// var mousePosition;
// var isDown=false;

// var half = document.getElementById("half");
//     half.style.width= '10px';
// var edge = document.getElementById("edge");
// edge.addEventListener('mousedown', function(e) { isDown = true;  }, true);
// document.addEventListener('mouseup', function() { isDown = false; }, true);
// document.addEventListener('mousemove', function(event) {
//     event.preventDefault();
//     if (isDown) {
//         mousePosition = {
//             x : event.clientX,
//             y : event.clientY };
//         half.style.width = mousePosition.x+'px';   
//     }}, true);

// FINE






