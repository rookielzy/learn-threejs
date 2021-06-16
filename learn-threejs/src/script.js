import './style.css'

import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import dat from 'three/examples/jsm/libs/dat.gui.module.js'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils.js'
import { initCamera, addHouseAndTree } from './utils'

// fps
const stats = new Stats()

document.body.appendChild(stats.dom)

// Scene
const scene = new THREE.Scene()
// scene.fog = new THREE.Fog(0xffffff, 0.015, 100)
// scene.fog = new THREE.FogExp2(0xffffff, 0.01)
// scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })

// Create a canera, which defines where we're looking at.
let camera = initCamera()

// Create a render and set the size
const renderer = new THREE.WebGLRenderer()
renderer.setClearColor(new THREE.Color(0x000000))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const ambientLight = new THREE.AmbientLight('#606008', 1)
scene.add(ambientLight)

const spotLight = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4)
spotLight.shadow.mapSize.set(2048, 2048)
spotLight.position.set(-30, 40, -10)
spotLight.castShadow = true
scene.add(spotLight)

const controls = setUpControls()

function setUpControls() {
  const controls = {
    intensity: ambientLight.intensity,
    ambientColor: ambientLight.color.getStyle(),
    disableSpotLight: false
  }

  const gui = new dat.GUI()
  gui.add(controls, 'intensity', 0, 3, 0.1).onChange(() => {
    ambientLight.color = new THREE.Color(controls.ambientColor)
    ambientLight.intensity = controls.intensity
  })
  gui.addColor(controls, 'ambientColor').onChange(() => {
    ambientLight.color = new THREE.Color(controls.ambientColor)
    ambientLight.intensity = controls.intensity
  })
  gui.add(controls, 'disableSpotLight').onChange(value => {
    spotLight.visible = !value
  })

  return controls
}

// add a simple scene
addHouseAndTree(scene)

document.getElementById('webgl-output').appendChild(renderer.domElement)

function renderScene() {
  stats.update()

  requestAnimationFrame(renderScene)
  
  // render the scene
  renderer.render(scene, camera)
}

renderScene()
