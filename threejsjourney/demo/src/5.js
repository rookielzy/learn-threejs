import './style.css'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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
// const geometry = new THREE.Geometry()
// // 添加顶点
// geometry.vertices.push(new THREE.Vector3(0, 0, 0))
// geometry.vertices.push(new THREE.Vector3(0, 1, 0))
// geometry.vertices.push(new THREE.Vector3(1, 0, 0))

// 将三个顶点组合成一个面
// geometry.faces.push(new THREE.Face3(0, 1, 2))

const geometry = new THREE.BufferGeometry()

const positionsArray = new Float32Array([
  0, 0, 0,  // 第一个顶点
  0, 1, 0,  // 第二个顶点
  1, 0, 0,  // 第三个顶点
])

const positionAttribute = new THREE.BufferAttribute(positionsArray, 3)
geometry.setAttribute('position', positionAttribute)

// 注意这里需要将 wireframe 设置为 true 才能看到效果
const material = new THREE.MeshBasicMaterial({color: 'red', wireframe: true})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

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
