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

const geometry = new THREE.BoxBufferGeometry(1, 1, 1)
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/albedo-texture.jpeg')
texture.repeat.x = 2
texture.repeat.y = 3
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping
texture.offset.x = 0.5
texture.offset.y = 0.5
const material = new THREE.MeshBasicMaterial({map: texture})
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

// debug
const gui = new dat.GUI()

// step slider
gui.add(cube.position, 'x').min(-3).max(3).step(0.01).name('x axis')
gui.add(cube.position, 'y').min(-3).max(3).step(0.01).name('y axis')
gui.add(cube.position, 'z').min(-3).max(3).step(0.01).name('z axis')
// boolean
gui.add(cube, 'visible')
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
  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
