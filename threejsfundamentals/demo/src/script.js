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
