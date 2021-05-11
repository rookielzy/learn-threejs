import './style.css'

import * as THREE from 'three'

// 0. 画布
const canvas = document.querySelector('#canvas')

// 1. 渲染器：负责将所有数据渲染绘制到 canvas 上
const renderer = new THREE.WebGLRenderer({canvas})

// 2. 为了能看到图像，我们需要一双眼睛，即摄像机，这里我们用透视摄像机（PerspectiveCamera）
const fov = 75  // 视野范围（field of view）此处指垂直方向为 75 度
const aspect = 2  // 默认值为 2，指画布的宽高比
const near = 0.1  // 近平面
const far = 5 // 远平面
// 近平面和远平面限制了摄像机面朝方向的可绘制区域，可参考 READNE 中的第三张图
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

// 摄像机默认指向 Z 轴负方向，上方向朝向 Y 轴正方向，待会我们会把立方体放置在坐标原点，因此我们需要将摄像机往后移。效果如 README 中的第四张图
camera.position.z = 2

// 3. 创建一个场景 Scene，后面我们所绘制的东西都需要加入到场景中去
const scene = new THREE.Scene()

// 4. 为了使我们的立体效果更明显，我们先来加一盏平行光
{
  const color = 0xffffff
  const intensity = 1
  const light = new THREE.DirectionalLight(color, intensity)
  light.position.set(-1, 2, 4)
  scene.add(light)
}

// 4. 用 Three.js 提供的 `BoxGeometry` 来创建一个立方体几何体，这是立方体的基础形状
const boxWidth = 1
const boxHeight = 1
const boxDepth = 1
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth)

// 5. 由于场景里有了光源，我们也想在立方体上体现光源的效果，因此这里的材质需要用 `MeshPhongMaterial`
// 这个材质将会收到光源的影响
const material = new THREE.MeshPhongMaterial({color: 0x44aa88})

// 6. 有了立方体基础形状和材质之后，我们就需要一个网格对象 `Mesh` 来应用这两个属性，并呈现在页面上。
// 为什么要用网格对象 `Mesh` 呢？因为 `Three.js` 实际就是一个封装了 `WebGL` 基础操作的图形库；在 `WebGL` 中只存在简单的三角形，线段
// 没有现成的立方体；也就是说在画一个立方体，我们需要用多个三角形拼接而成。而上述的 `Geometry` 就是指立方体是如何通过三角形拼接而成的，
// 网格 `Mesh` 对象就是应用了几何体与材质之后的产物
const cube = new THREE.Mesh(geometry, material)

// 7. 要呈现这个立方体，我们需要将这个立方体放置到场景中 `Scene` 就如 README 中第一张图（`Three.js` 的应用结构）所示
scene.add(cube)

// 8. 这里我们简单处理一下图像模糊的问题
camera.aspect = canvas.clientWidth / canvas.clientHeight
camera.updateProjectionMatrix()
// 上述方法解决了图像拉伸的问题，但图像的锯齿感仍然很严重
// 因此我们需要重新设置一下渲染器的尺寸，我们先简单的用 `canvas` 画布尺寸来对渲染器尺寸进行赋值
renderer.setSize(canvas.clientWidth | 0, canvas.clientHeight | 0, false)

// 9. 我们先让这个立方体动起来
function render(time) {
  time *= 0.001 // 将时间单位变成秒

  // 每一帧都变换立方体的 x 与 y 的值
  cube.rotation.x = time
  cube.rotation.y = time

  renderer.render(scene, camera)

  requestAnimationFrame(render)
}

// 根据屏幕刷新率来绘制每一帧的效果
requestAnimationFrame(render)
