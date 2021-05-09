# Three.js 基础

首先先要清楚 `Three.js` 的应用结构，如下图所示：

![threejs-structure](../images/threejs-structure.svg)

* 首先最核心的就是渲染器 `Renderer`，我们几乎所有的 3D 对象，属性等都会包含于此，其中最基础也就是场景 `Scene` 与摄像机 `Camera`。
* 其中一个场景图包含了一个场景 `Scene`，各种网格 `Mesh` 对象，光源 `Light` 对象，群组 `Group`，三维物体 `Object3D` 和摄像机 `Camera` 对象。你可以注意到其中 `Camera` 不一定需要在场景图中起作用。

![frustum-3d](../images/frustum-3d.svg)
