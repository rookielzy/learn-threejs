import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'
import { Color4, Engine, Scene } from "@babylonjs/core";

// enum for states
enum State { START = 0, GAME = 1, LOSE = 2, CUTSCENE = 3 }

class App {
  // General Entire Application
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;

  // Scene - related
  private _state: number = 0
  constructor() {
    this._canvas = this._createCanvas()

    // initialize babylon scene and engine
    this._engine = new BABYLON.Engine(this._canvas, true)
    this._scene = new BABYLON.Scene(this._engine)

    var camera: BABYLON.ArcRotateCamera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), this._scene)
    camera.attachControl(this._canvas, true)
    var light1 = new BABYLON.HemisphericLight('ligt1', new BABYLON.Vector3(1, 1, 0), this._scene)
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 1 }, this._scene)

    // hide/show the Inspector
    window.addEventListener('keydown', (ev) => {
      // Shift+Ctrl+Alt+I
      if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
        if (this._scene.debugLayer.isVisible()) {
          this._scene.debugLayer.hide()
        } else {
          this._scene.debugLayer.show()
        }
      }
    })

    this._goToStart()

    // run the main render loop
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }

  private _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.id = 'gameCanvas'
    document.body.appendChild(canvas)

    return canvas
  }

  private async _goToStart() {
    this._engine.displayLoadingUI()

    this._scene.detachControl()
    let scene = new BABYLON.Scene(this._engine)
    scene.clearColor = new Color4(0, 0, 0, 1)
    let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), scene)
    camera.setTarget(BABYLON.Vector3.Zero())

    // create a fullscreen ui for all of our GUI elements
    const guiMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    guiMenu.idealHeight = 720 // fit our fullscreen ui to this height

    // create a simple button
    const startBtn = GUI.Button.CreateSimpleButton('start', 'PLAY')
    startBtn.width = 0.2
    startBtn.height = '40px'
    startBtn.color = 'white'
    startBtn.top = '-14px'
    startBtn.thickness = 0
    startBtn.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    guiMenu.addControl(startBtn)

    // this handles interactions with the start button attached to the scene
    startBtn.onPointerDownObservable.add(() => {
      this._goToCutScene()
      scene.detachControl()
    })

    // --SCENE FINISHED LOADING--
    await scene.whenReadyAsync()
    this._engine.hideLoadingUI()
    // lastly set the current state to the start state and set the scene to the start scene
    this._scene.dispose()
    this._scene = scene
    this._state = State.START
  }

  private async _goToLose(): Promise<void> {
    this._engine.displayLoadingUI()

    //--SCENE SETUP--
    this._scene.detachControl()
    let scene = new BABYLON.Scene(this._engine)
    scene.clearColor = new Color4(0, 0, 0, 1)
    let camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 0, 0), scene)
    camera.setTarget(BABYLON.Vector3.Zero())

    //--GUI--
    const guiMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI')
    const mainBtn = GUI.Button.CreateSimpleButton('mainmenu', 'MAIN MENU')
    mainBtn.width = 0.2
    mainBtn.height = '40px'
    mainBtn.color = 'white'
    guiMenu.addControl(mainBtn)
    // this handles interactions with the start button attached to the scene
    mainBtn.onPointerUpObservable.add(() => {
      this._goToStart()
    })

    //--SCENE FINISHED LOADING--
    await scene.whenReadyAsync();
    this._engine.hideLoadingUI(); //when the scene is ready, hide loading
    //lastly set the current state to the lose state and set the scene to the lose scene
    this._scene.dispose();
    this._scene = scene;
    this._state = State.LOSE;
  }

  private async _goToCutScene() {
    var finishedLoading = false

    //--PROGRESS DIALOGUE--
    const next = GUI.Button.CreateSimpleButton('next', 'NEXT')
    next.color = 'white'
    next.thickness = 0
    next.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    next.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
    next.width = '64px'
    next.height = '64px'
    next.top = '-3%'
    next.left = '12%'

    next.onPointerUpObservable.add(() => {
      this._goToGame()
    })

    await this._setUpGame().then((res) => {
      finishedLoading = true
    })
  }


  private async _setUpGame() {}

  private async _goToGame() {}
}

new App()
