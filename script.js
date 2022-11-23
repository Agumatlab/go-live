import './darkmode.css'
import './style.css'
import './page1.css'
import './page2.css'
import './page3.css'
import './page4.css'
import './page5.css'
import './page6.css'
import './page7.css'
import './page8.css'
import './page9.css'
import './navigationmenu.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
//import * as dat from 'lil-gui' // <--not used for now
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { randFloat } from 'three/src/math/MathUtils'

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


// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

const light = new THREE.AmbientLight( 0xFFFFFF ); // soft white light
light.position.set(0,1,5)
scene.add( light ); 

const loader = new GLTFLoader();
var sat1,sat2,terra;
loader.setDRACOLoader(dracoLoader)
loader.load( 'models/MyGMaps/Satellite.glb', function ( gltf ) {
    
	scene.add( gltf.scene );
    
    
    sat1 = gltf.scene.children[0]
    sat2 = gltf.scene.clone()
    sat2.position.set(0,1,0)
    scene.add(sat2)
    }, undefined, function ( error ) { console.error( error ); } 
);

loader.load( 'models/MyGMaps/terra.glb', function ( gltf ) {
    
	scene.add( gltf.scene );
    terra=gltf.scene.children[0]
    }, undefined, function ( error ) { console.error( error ); } 
);


// Sizes
const sizes = {   width: 800,    height: 600}

// Camera
// const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height)
const camera = new THREE.OrthographicCamera(-100,100,100,-100,-10,10)

scene.add(camera)

// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)



// Renderer


const controls = new OrbitControls(camera, canvas)


controls.target.set(0, 1, 0)
controls.maxZoom = 100;
controls.minZoom = .0001;

console.log(controls)

controls.enableDamping = true;
controls.autoRotateSpeed = .1

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)  // VA PER ULTIMO!!!
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let previousTime = 0

var ang = 0
const pi=Math.PI
const r=10

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Model animation 
    // empty for now
 
    // controls.autoRotate = (controls.getPolarAngle() >1)? true : false;

    // Update controls
    // controls.update()

    // console.log(camera.position)
    // console.log(camera.near)
    // console.log(camera.zoom)
    // // Render
    renderer.render(scene, camera)


    if (sat1 && controls.getPolarAngle() >1){
      
    ang += .001

    sat1.position.set(r*Math.cos(ang),5,r*Math.sin(ang))
    sat2.position.set(r*Math.cos(ang+pi),5,r*Math.sin(ang+pi))

    sat1.rotation.set(0,-ang,-150/180*pi)
    sat2.rotation.set(0,-ang+pi,-150/180*pi)
    
    }
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
// function animate() {

// 	requestAnimationFrame( animate );

// 	// required if controls.enableDamping or controls.autoRotate are set to true
// 	controls.update();

// 	renderer.render( scene, camera );
 
// }


// function animate() {
//     requestAnimationFrame( animate );
//     renderer.render( scene, camera );
// }
// animate();














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
  

    //    let animateTxt = new IntersectionObserver( aa_div =>{
    //             aa_div[0].target.classList.add('revealUp')}
    //    );
    //    document.querySelectorAll('.aa').forEach(aa => animateTxt.observe( aa ))
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






