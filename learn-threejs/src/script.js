import './style.css'

import * as THREE from 'three'
import dat from 'three/examples/jsm/libs/dat.gui.module.js'
import { initCamera, addHouseAndTree, initStats, initRenderer, addDefaultCubeAndSphere, addGroundPlane } from './utils'

const stats = initStats()
const renderer = initRenderer()
const camera = initCamera()

// create a scene, that will hold all our alements such as objects, cameras and lights
const scene = new THREE.Scene()

const cubeAndSphere = addDefaultCubeAndSphere(scene)
const cube = cubeAndSphere.cube
const sphere = cubeAndSphere.sphere
const plane = addGroundPlane(scene)

// add suble ambient lighting
const ambiColor = '#1c1c1c'
const ambientLight = new THREE.AmbientLight(ambiColor)
scene.add(ambientLight)

// add spotlight for a bit of light
const spotLight0 = new THREE.SpotLight(0xcccccc)
spotLight0.position.set(-40, 30, -10)
spotLight0.lookAt(plane)
scene.add(spotLight0)

// add target and light
const target = new THREE.Object3D()
target.position.set(5, 0, 0)

const spotLight = new THREE.SpotLight('#ffffff')
spotLight.position.set(-40, 60, -10)
spotLight.castShadow = true
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 100
spotLight.target = target
spotLight.distance = 0
spotLight.angle = 0.4
spotLight.shadow.camera.fov = 120
scene.add(spotLight)

const debugCamera = new THREE.CameraHelper(spotLight.shadow.camera)

const pp = new THREE.SpotLightHelper(spotLight)
scene.add(pp)

// add a small sphere simulating the pointlight
const sphereLight = new THREE.SphereGeometry(0.2)
const sphereLightMaterial = new THREE.MeshBasicMaterial({color: 0xac6c25})
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)
sphereLightMesh.castShadow = true

sphereLightMesh.position.set(3, 20, 3)
scene.add(sphereLightMesh)

// for controlling the rendering
let step = 0
let invert = 1
let phase = 0

const controls = setupControls()

function renderScene() {
  stats.update()

  // rotate the cube around its axes
  cube.position.x += controls.rotationSpeed
  cube.position.y += controls.rotationSpeed
  cube.position.z += controls.rotationSpeed

  // bounce the sphere up and down
  step += controls.bouncingSpeed
  sphere.position.x = 20 + 10 * Math.cos(step)
  sphere.position.y = 2 + 10 * Math.sin(step)
  
  // move the light simulation
  if (!controls.stopMovingLight) {
    if (phase > 2 * Math.PI) {
      invert = invert * -1
      phase += 2 * Math.PI
    } else {
      phase += controls.rotationSpeed
    }

    sphereLightMesh.position.z = 7 * Math.sin(phase)
    sphereLightMesh.position.x = 14 * Math.cos(phase)
    sphereLightMesh.position.y = 15

    if (invert < 0) {
      const pivot = 14
      sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot
    }

    spotLight.position.copy(sphereLightMesh.position)
  }

  pp.update()

  requestAnimationFrame(renderScene)

  // render the scene
  renderer.render(scene, camera)
}

function setupControls() {
  const controls = {
    rotationSpeed: 0.03,
    bouncingSpeed: 0.03,
    ambientColor: ambiColor,
    pointColor: spotLight.color.getStyle(),
    intensity: 1,
    distance: 0,
    angle: 0.1,
    shadowDebug: false,
    castShadow: true,
    target: 'Plane',
    stopMovingLight: false,
    penumbra: 0
  }

  const gui = new dat.GUI()
  gui.addColor(controls, 'ambientColor').onChange(value => {
    ambientLight.color = new THREE.Color(value)
  })

  gui.addColor(controls, 'pointColor').onChange(value => {
    spotLight.color = new THREE.Color(value)
  })

  gui.add(controls, 'angle', 0, Math.PI * 2).onChange(value => {
    spotLight.angle = value
  })

  gui.add(controls, 'intensity', 0, 5).onChange(value => {
    spotLight.intensity = value
  })

  gui.add(controls, 'penumbra', 0, 5).onChange(value => {
    spotLight.penumbra = value
  })

  gui.add(controls, 'distance', 0, 20).onChange(value => {
    spotLight.distance = value
  })

  gui.add(controls, 'shadowDebug').onChange(value => {
    if (value) {
      scene.add(debugCamera)
    } else {
      scene.remove(debugCamera)
    }
  })

  gui.add(controls, 'castShadow').onChange(value => {
    spotLight.castShadow = value
  })

  gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(value => {
    switch (value) {
      case 'Plane':
        spotLight.target = plane
        break
      case 'Sphere':
        spotLight.target = sphere
        break
      case 'Cube':
        spotLight.target = cube
        break
    }
  })

  gui.add(controls, 'stopMovingLight').onChange(value => {
    stopMovingLight = value
  })


  return controls
}

renderScene()
