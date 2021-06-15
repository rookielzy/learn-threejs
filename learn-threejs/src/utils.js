import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

/**
 * Initialize trackball controls to control the scene
 * 
 * @param {THREE.Camera} camera 
 * @param {THREE.Renderer} renderer 
 */
 export function initTrackballControls(camera, renderer) {
  var trackballControls = new TrackballControls(camera, renderer.domElement);
  trackballControls.rotateSpeed = 1.0;
  trackballControls.zoomSpeed = 1.2;
  trackballControls.panSpeed = 0.8;
  trackballControls.noZoom = false;
  trackballControls.noPan = false;
  trackballControls.staticMoving = true;
  trackballControls.dynamicDampingFactor = 0.3;
  trackballControls.keys = [65, 83, 68];

  return trackballControls;
}

export function initCamera(initialPosition) {
  const position = (initialPosition !== undefined) ? initialPosition : new THREE.Vector3(-30, 40, 30)

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.copy(position)
  camera.lookAt(new THREE.Vector3(0, 0, 0))

  return camera
}

export function addHouseAndTree(scene) {

  createBoundingWall(scene)
  createGroundPlane(scene)
  createHouse(scene)
  createTree(scene)
  
  function createBoundingWall(scene) {
    const wallLeft = new THREE.CubeGeometry(70, 2, 2)
    const wallRight = new THREE.CubeGeometry(70, 2, 2)
    const wallTop = new THREE.CubeGeometry(2, 2, 50)
    const wallBottom = new THREE.CubeGeometry(2, 2, 50)

    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0xa0522d
    })

    const wallLeftMesh = new THREE.Mesh(wallLeft, wallMaterial)
    const wallRightMesh = new THREE.Mesh(wallRight, wallMaterial)
    const wallTopMesh = new THREE.Mesh(wallTop, wallMaterial)
    const wallBottomMesh = new THREE.Mesh(wallBottom, wallMaterial)

    wallLeftMesh.position.set(15, 1, -25)
    wallRightMesh.position.set(15, 1, 25)
    wallTopMesh.position.set(-19, 1, 0)
    wallBottomMesh.position.set(49, 1, 0)

    scene.add(wallLeftMesh, wallRightMesh, wallTopMesh, wallBottomMesh)
  }

  function createGroundPlane(scene) {
    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(70, 50)
    const planeMaterial = new THREE.MeshPhongMaterial({
      color: 0x9acd32
    })
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0

    scene.add(plane)
  }

  function createHouse(scene) {
    const roof = new THREE.ConeGeometry(5, 4)
    const base = new THREE.CylinderGeometry(5, 5, 6)

    // create the mesh
    const roofMesh = new THREE.Mesh(roof, new THREE.MeshPhongMaterial({color: 0x8b7213}))
    const baseMesh = new THREE.Mesh(base, new THREE.MeshPhongMaterial({color: 0xffe4c4}))

    roofMesh.position.set(25, 8, 0)
    baseMesh.position.set(25, 3, 0)

    roofMesh.receiveShadow = true
    baseMesh.receiveShadow = true
    roofMesh.castShadow = true
    baseMesh.castShadow = true

    scene.add(roofMesh, baseMesh)
  }

  function createTree(scene) {
    const trunk = new  THREE.CubeGeometry(1, 8, 1)
    const leaves = new THREE.SphereGeometry(4)

    // create the mesh
    const trunkMesh = new THREE.Mesh(trunk, new THREE.MeshPhongMaterial({color: 0x8b4513}))
    const leavesMesh = new THREE.Mesh(leaves, new THREE.MeshPhongMaterial({color: 0x00ff00}))

    // position the trunk. set y to half of height of trunk
    trunkMesh.position.set(-10, 4, 0)
    leavesMesh.position.set(-10, 12, 0)

    trunkMesh.castShadow = true
    trunkMesh.receiveShadow = true
    leavesMesh.castShadow = true
    leavesMesh.receiveShadow = true

    scene.add(trunkMesh)
    scene.add(leavesMesh)
  }
}
