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
scene.fog = new THREE.FogExp2(0xffffff, 0.01)
scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })

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

// ambientLight
const ambientLight = new THREE.AmbientLight(0x3c3c3c)
scene.add(ambientLight)

// spot light
const spotLight = new THREE.SpotLight(0xffffff)
spotLight.position.set(-40, 40, -15)
spotLight.castShadow = true

scene.add(spotLight)

// create the ground plane
const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1)
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

// position and point the camera to the center of the scene
camera.position.set(-30, 40, 30)
camera.lookAt(scene.position)

// add the output of the renderer to the html element
document.getElementById('webgl-output').appendChild(renderer.domElement)

const controls = {
  rotationSpeed: 0.02,
  bouncingSpeed: 0.03,
  numberOfObjects: scene.children.length,
  addCube () {
    const cubeSize = Math.ceil(Math.random() * 3)
    const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })

    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    cube.name = 'cube-' + scene.children.length
    cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width))
    cube.position.y = Math.round((Math.random() * 5))
    cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height))

    scene.add(cube)
    this.numberOfObjects = scene.children.length
  },
  removeCube () {
    const allChilren = scene.children
    const lastObject = allChilren[allChilren.length - 1]
    if (lastObject instanceof THREE.Mesh) {
      scene.remove(lastObject)
      this.numberOfObjects = scene.children.length
    }
  },
  outputObjects () {
    console.log(scene.children)
  }
}

const gui = new dat.GUI()
gui.add(controls, 'rotationSpeed', 0, 0.5)
gui.add(controls, 'bouncingSpeed', 0, 0.5)
gui.add(controls, 'addCube')
gui.add(controls, 'removeCube')
gui.add(controls, 'outputObjects')
gui.add(controls, 'numberOfObjects')

const vertices = [
  new THREE.Vector3(1, 3, 1),
  new THREE.Vector3(1, 3, -1),
  new THREE.Vector3(1, -1, 1),
  new THREE.Vector3(1, -1, -1),
  new THREE.Vector3(-1, 3, -1),
  new THREE.Vector3(-1, 3, 1),
  new THREE.Vector3(-1, -1, -1),
  new THREE.Vector3(-1, -1, 1)
]

const faces = [
  new THREE.Face3(0, 2, 1),
  new THREE.Face3(2, 3, 1),
  new THREE.Face3(4, 6, 5),
  new THREE.Face3(6, 7, 5),
  new THREE.Face3(4, 5, 1),
  new THREE.Face3(5, 0, 1),
  new THREE.Face3(7, 6, 2),
  new THREE.Face3(6, 3, 2),
  new THREE.Face3(5, 7, 0),
  new THREE.Face3(7, 2, 0),
  new THREE.Face3(1, 3, 4),
  new THREE.Face3(3, 6, 4)
]

const geom = new THREE.Geometry()
geom.vertices = vertices
geom.faces = faces
geom.computeFaceNormals()

const materials = [
  new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true}),
  new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true})
]

const mesh = SceneUtils.createMultiMaterialObject(geom, materials)
mesh.castShadow = true
mesh.children.forEach(obj => {
  obj.castShadow = true
})

scene.add(mesh)

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

  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh && obj !== plane) {
      obj.rotation.x += controls.rotationSpeed
      obj.rotation.y += controls.rotationSpeed
      obj.rotation.z += controls.rotationSpeed
    }
  })

  requestAnimationFrame(renderScene)
  
  // render the scene
  renderer.render(scene, camera)
}

renderScene()