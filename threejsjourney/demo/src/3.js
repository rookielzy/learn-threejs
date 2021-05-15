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
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)
const clock = new THREE.Clock()

function render() {
  const time = clock.getElapsedTime()
  
  // update cube
  cube.rotation.x = time
  cube.rotation.y = time

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
