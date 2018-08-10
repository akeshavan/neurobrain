import * as THREE from 'three';
import * as AMI from 'ami.js';

/*
import CoreUtils from 'base/core/core.utils';
import LoadersVolume from 'base/loaders/loaders.volume';
import HelpersStack from 'base/helpers/helpers.stack';
import HelpersLut from 'base/helpers/helpers.lut';
import CamerasOrthographic from 'base/cameras/cameras.orthographic';
import ControlsOrthographic from 'base/controls/controls.trackballortho';
*/

/* eslint-disable */

export class Viewer {

  constructor(name) {

    this.sh = new AMI.stackHelperFactory(THREE);
    this.AMI = AMI;
    this.THREE = THREE;
    this._name = name;
    this.loader = new AMI.VolumeLoader(this.container);
    this.reset();
  }

  reset() {
    this.views = {};
    this.layers = new Map();
  }

  addView(view) {
    this.views[view.element] = view;
  }

  dropView(element) {
    delete this.views[element];
  }

  getView(element) {
    return this.views[element];
  }

  dropLayer() {
    this;
  }

  addLayer(file, view) {
    this.loadVolume(file, view);
  }

  loadVolume(file, view) {
    var loader = this.loader;

    loader.load(file)
      .then(function () {
        // merge files into clean series/stack/frame structure
        var series = loader.data[0].mergeSeries(loader.data);
        var stack = series[0].stack[0];
        var StackHelper = new AMI.stackHelperFactory(THREE);
        var stackHelper = new StackHelper(stack);

        // center camera and interactor to center of bouding box
        // for nicer experience
        // set camera
        var worldbb = stack.worldBoundingBox();
        var lpsDims = new THREE.Vector3(worldbb[1] - worldbb[0], worldbb[3] - worldbb[2], worldbb[5] - worldbb[4]);

        // box: {halfDimensions, center}
        var box = {
          center: stack.worldCenter().clone(),
          halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
        };

        // init and zoom
        var canvas = {
          width: view.container.clientWidth,
          height: view.container.clientHeight
        };

        loader.free();
        loader = null;

        // tune bounding box
        stackHelper.bbox.visible = false;

        // tune slice border
        stackHelper.border.color = 0xff9800;
        // stackHelper.border.visible = false;

        view.scene.add(stackHelper);
        view.camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
        view.camera.box = box;
        view.camera.canvas = canvas;
        view.camera.update();
        view.camera.fitBox(2);
      });
  }
}

// class Layer {
//
//   constructor(image, visible = true, opacity = 1.0) {
//     this.image = image;
//     this.visible = visible;
//     this.opacity = opacity;
//   }
// }

export class View {

  constructor(element, type = 'orth', plane = 'x') {
    this.element = element;
    this.container = document.getElementById(element);
    this.type = type;
    this.plane = plane;
    this._initRenderer();
  }

  _initRenderer() {
    var container = this.container;
    var OrthographicCamera = new AMI.orthographicCameraFactory(THREE);
    console.log("container is", container)
    var camera = new OrthographicCamera(
      container.clientWidth / -2,
      container.clientWidth / 2,
      container.clientHeight / 2,
      container.clientHeight / -2,
      0.1,
      10000
    );
    console.log('camera', camera);
    var controls = new AMI.trackballOrthoControlFactory(this.camera, this.container);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x2196F3, 1);
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.camera = camera;

    controls.staticMoving = true;
    controls.noRotate = true;
    camera.controls = controls;

    function onWindowResize() {
      camera.canvas = {
        width: container.offsetWidth,
        height: container.offsetHeight
      };
      camera.fitBox(2);

      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
    }
    this.container.addEventListener('resize', onWindowResize, false);

    this.renderer.render(this.scene, this.camera);
  }

}
