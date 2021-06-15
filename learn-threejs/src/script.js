import './style.css'

import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/jsm/libs/dat.gui.module.js'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import { initTrackballControls } from './utils'

// fps
const stats = new Stats()

document.body.appendChild(stats.dom)

// Scene
const scene = new THREE.Scene()
// scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
// scene.fog = new THREE.FogExp2(0xffffff, 0.01)
// scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Create a canera, which defines where we're looking at.
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(120, 60, 180)

// Create a render and set the size
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0x000000))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// show axes in the screen
const axes = new THREE.AxesHelper(20)
// scene.add(axes)

// create the ground plane
const planeGeometry = new THREE.PlaneGeometry(180, 180)
const planeMaterial = new THREE.MeshLambertMaterial({
  color: 0xffffff
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)

// rotate and position the plane
plane.rotation.x = -0.5 * Math.PI
plane.position.set(0, 0, 0)

// add the plane to the scene
scene.add(plane)

const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)

for (let j = 0; j < planeGeometry.parameters.height / 5; j++) {
  for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
    const rnd = Math.random() * 0.75 + 0.25
    const cubeMaterial = new THREE.MeshLambertMaterial()
    cubeMaterial.color = new THREE.Color(rnd, 0, 0)
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    cube.position.z = -(planeGeometry.parameters.height / 2) + 2 + (j * 5)
    cube.position.x = -(planeGeometry.parameters.width / 2) + 2 + (i * 5)
    cube.position.y = 2

    scene.add(cube)
  }
}

let lookAtGeom = new THREE.SphereGeometry(2)
let lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({color: 0x00ff00}))
scene.add(lookAtMesh)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7)
directionalLight.position.set(-20, 40, 60)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0x292929)
scene.add(ambientLight)


document.getElementById('webgl-output').appendChild(renderer.domElement)

camera.lookAt(scene.position)
let trackballControls = initTrackballControls(camera, renderer)

const controls = {
  perspective: 'Perspective',
  switchCamera () {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500)
      camera.position.x = 120
      camera.position.y = 60
      camera.position.z = 180
      camera.lookAt(scene.position)
      trackballControls = initTrackballControls(camera, renderer)
      this.perspective = 'Orthographic'
    } else {
      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.x = 120
      camera.position.y = 60
      camera.position.z = 180
      camera.lookAt(scene.position)
      trackballControls = initTrackballControls(camera, renderer)
      this.perspective = 'Perspective'
    }
  }
}

const gui = new dat.GUI()
gui.add(controls, 'switchCamera')
gui.add(controls, 'perspective').listen()

const clock = new THREE.Clock()

let step = 0

function renderScene() {
  // update the stats and the controls
  trackballControls.update(clock.getDelta())
  stats.update()

  step += 0.02

  if (camera instanceof THREE.Camera) {
    const x = 10 + (100 * Math.sin(step))
    camera.lookAt(new THREE.Vector3(x, 10, 0))
    lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0))
  }

  requestAnimationFrame(renderScene)
  
  // render the scene
  renderer.render(scene, camera)
}

renderScene()
