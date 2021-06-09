import './style.css'

import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/jsm/libs/dat.gui.module.js'
import { initTrackballControls } from './utils'

// fps
const stats = new Stats()

document.body.appendChild(stats.dom)

// Scene
const scene = new THREE.Scene()

// Create a canera, which defines where we're looking at.
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

// Create a render and set the size
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0x000000))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// show axes in the screen
const axes = new THREE.AxesHelper(20)
// scene.add(axes)

// spot light
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 40, -15)
spotLight.castShadow = true
spotLight.shadow.mapSize = new THREE.Vector2(1024, 1024)
spotLight.shadow.camera.far = 130
spotLight.shadow.camera.near = 40

scene.add(spotLight)

// create the ground plane
const planeGeometry = new THREE.PlaneGeometry(60, 20)
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI
plane.position.set(15, 0, 0)

// add the plane to the scene
scene.add(plane)

// create a cube
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
const cubeMaterial = new THREE.MeshLambertMaterial({
  color: 0xff0000,
  wireframe: false
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true

// position the cube
cube.position.set(-4, 3, 0)

// add the cube to the scene
scene.add(cube)

// create a sphere
const sphereGeometry = new THREE.SphereGeometry(4, 20, 20)
const sphereMaterial = new THREE.MeshLambertMaterial({
  color: 0x7777ff,
  wireframe: false
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.castShadow = true

// position the sphere
sphere.position.set(20, 4, 2)

// add the sphere to the scene
scene.add(sphere)

// position and point the camera to the center of the scene
camera.position.set(-30, 40, 30)
camera.lookAt(scene.position)

// add the output of the renderer to the html element
document.getElementById('webgl-output').appendChild(renderer.domElement)

const controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03
}

const gui = new dat.GUI()
gui.add(controls, 'rotationSpeed', 0, 0.5)
gui.add(controls, 'bouncingSpeed', 0, 0.5)

let step = 0

const trackballControls = initTrackballControls(camera, renderer)
const clock = new THREE.Clock()

window.addEventListener('resize', onResize, false)

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function renderScene() {
  // update the stats and the controls
  trackballControls.update(clock.getDelta())
  stats.update()
  
  // animate the cube
  cube.rotation.x += controls.rotationSpeed
  cube.rotation.y += controls.rotationSpeed
  cube.rotation.z += controls.rotationSpeed

  // bouncing the sphere
  step += controls.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))

  requestAnimationFrame(renderScene)
  
  // render the scene
  renderer.render(scene, camera)
}

renderScene()
