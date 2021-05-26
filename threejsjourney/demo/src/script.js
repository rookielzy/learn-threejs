import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'

// 我们需要如下几个元素来呈现简单的 3D 图形效果
// 一个图形场景，包含各种 3D 对象
// 3D 对象
// 一个摄像机
// 一个渲染器

// 0. canvas
const canvas = document.querySelector('#canvas')

// 1. renderer
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(canvas.clientWidth, canvas.clientHeight)

// 2. camera
const fov = 75
const aspect = canvas.clientWidth / canvas.clientHeight
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2

const controls = new OrbitControls(camera, canvas)

// 摄像机默认对准原点，我们可以通过以下方法更改控制器对准的目标位置
// controls.target.y = 0.1

// 3. scene
const scene = new THREE.Scene()

// 4. objects
const parameters = {
  color: 0xff0000
}

const material = new THREE.MeshNormalMaterial()

material.flatShading = true

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 16, 16),
  material
)

sphere.position.x = -1.5

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1),
  material
)

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.2, 16, 32),
  material
)

torus.position.x = 1.5

scene.add(sphere, plane, torus)

// debug
const gui = new dat.GUI()

// step slider
gui.add(material, 'wireframe')

// color picker
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color)
})

// resize
window.addEventListener('resize', () => {
  const width = window.innerWidth
  const height = window.innerHeight

  // 尺寸的变化会导致 camera 的宽高比不再适用，因此需要更新
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  // 同时窗口尺寸变化也影响画布的尺寸，这里我们只需要更新渲染器的尺寸即可（它会同步更新 canvas 的尺寸）
  renderer.setSize(width, height)
})

const clock = new THREE.Clock()

function render() {
  const time = clock.getElapsedTime()

  sphere.rotation.y = 0.1 * time
  plane.rotation.y = 0.1 * time
  torus.rotation.y = 0.1 * time

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
