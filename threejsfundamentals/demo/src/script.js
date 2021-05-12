import './style.css'

import * as THREE from 'three'

// 0. 画布
const canvas = document.querySelector('#canvas')

// 1. 渲染器
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

// 2. 摄像机
const fov = 75
const aspect = canvas.clientWidth / canvas.clientHeight
const near = 0.1
const far = 5
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.position.z = 2

// 3. 场景
const scene = new THREE.Scene()

// 4. 光源
{
  const color = 0xffffff
  const intensity = 1
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)
  scene.add(light)
}

const objects = []

// BoxGeometry
{
  const width = 0.1
  const height = 0.1
  const depth = 0.1
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const material = new THREE.MeshPhongMaterial({color: 0x44aa88})
  const box = new THREE.Mesh(geometry, material)

  objects.push(box)
  scene.add(box)
}

function render(time) {
  time *= 0.001

  objects.forEach(obj => {
    obj.rotation.x = time
    obj.rotation.y = time
  })

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
