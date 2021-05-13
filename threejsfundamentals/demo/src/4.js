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
  const light = new THREE.AmbientLight(color, intensity)
  scene.add(light)
}

const objects = []

// BoxGeometry
{
  const width = 0.1
  const height = 0.1
  const depth = 0.1
  const widthSegments = 4
  const heightSegments = 4
  const depthSegments = 4
  const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
  const material = new THREE.MeshPhongMaterial({color: 0x44aa88, wireframe: true})
  const box = new THREE.Mesh(geometry, material)

  box.position.x = -1
  box.position.y = 1

  objects.push(box)
  scene.add(box)
}

{
  const radius = 0.1
  const segments = 24
  const thetaStart = Math.PI * 0.25 // 起始角度
  const thetaLength = Math.PI * 1.5 // 圆形扇区的中心角
  const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
  const material = new THREE.MeshPhongMaterial({color: 0xaa4488, wireframe: true})
  const circle = new THREE.Mesh(geometry, material)

  circle.position.x = -0.5
  circle.position.y = 1

  objects.push(circle)
  scene.add(circle)
}

{
  const radius = 0.1
  const height = 0.2
  const radialSegments = 16
  const heightSegments = 2
  const openEnded = true
  const thetaStart = Math.PI * 0.25
  const thetaLength = Math.PI * 1.5
  const geometry = new THREE.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength)
  const material = new THREE.MeshPhongMaterial({color: 0xaa8844, wireframe: true})
  const cone = new THREE.Mesh(geometry, material)

  cone.position.x = 0
  cone.position.y = 1

  objects.push(cone)
  scene.add(cone)
}

{
  class CustomSinCurve extends THREE.Curve {
    constructor(scale) {
      super()
      this.scale = scale
    }

    getPoint(t) {
      const tx = t * 3 - 1.5
      const ty = Math.sin(2 * Math.PI * t)
      const tz = 0

      return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale)
    }
  }

  const path = new CustomSinCurve(0.3)
  const tubularSegments = 20
  const radius = 0.1
  const radialSegments = 8
  const closed = false
  const geometry = new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed)
  const material = new THREE.MeshPhongMaterial({color: 0x8844aa, wireframe: true})
  const tube = new THREE.Mesh(geometry, material)

  tube.position.x = -1
  tube.position.y = 0

  objects.push(tube)
  scene.add(tube)
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
