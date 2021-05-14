import './style.css'

import * as THREE from 'three'

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
camera.position.x = 1
camera.position.y = 0.3
camera.position.z = 2

// 3. scene
const scene = new THREE.Scene()

// 4. objects
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color: 'red'})
const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

renderer.render(scene, camera)
