import './style.css'

import * as THREE from 'three'

// 0. 画布
const canvas = document.querySelector('#canvas')

// 1. 渲染器
const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

// 2. 摄像机
const fov = 40
const aspect = canvas.clientWidth / canvas.clientHeight
const near = 0.1
const far = 1000
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
// 默认从高处垂直于原点往下看
camera.position.set(0, 150, 0)
camera.up.set(0, 0, 1)
camera.lookAt(0, 0, 0)

// 3. 场景
const scene = new THREE.Scene()

const objects = []

// 4. 星体对象
const radius = 1
const widthSegments = 6
const heightSegments = 6
const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)

// 引入太阳系节点来解决节点尺寸变化影响子节点的问题
const solarSystem = new THREE.Object3D()
scene.add(solarSystem)
objects.push(solarSystem)

// sun  默认位置在原点
const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xffff00})
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial)
sunMesh.scale.set(5, 5, 5)  // 放大太阳的尺寸大小
solarSystem.add(sunMesh)
objects.push(sunMesh)

// 光源默认位置在原点，在此加上光源，模拟太阳发出的光
{
  const color = 0xffffff
  const intensity = 3
  const light = new THREE.PointLight(color, intensity)
  scene.add(light)
}

// 同理，我们来创建一个以地球为中心的节点
const earthOrbit = new THREE.Object3D()
earthOrbit.position.x = 10
solarSystem.add(earthOrbit)
objects.push(earthOrbit)

// earth
const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233ff, emissive: 0x112244})
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial)
// scene.add(earthMesh) 如果直接把地球加入到场景中，地球就不会围着太阳公转了
// 因此需要将地球成为太阳的子节点
earthOrbit.add(earthMesh)
objects.push(earthMesh)

// moon
const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222})
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial)
moonMesh.position.x = 2
moonMesh.scale.set(0.5, 0.5, 0.5)
earthOrbit.add(moonMesh)
objects.push(moonMesh)

function render(time) {
  time *= 0.001

  objects.forEach(obj => {
    obj.rotation.y = time
  })

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

requestAnimationFrame(render)
