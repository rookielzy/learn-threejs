import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from '@babylonjs/core'
import { Engine, Scene } from "@babylonjs/core";

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

    // run the main render loop
    this._engine.runRenderLoop(() => {
      this._scene.render()
    })
  }

  _createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.id = 'gameCanvas'
    document.body.appendChild(canvas)

    return canvas
  }
}

new App()
