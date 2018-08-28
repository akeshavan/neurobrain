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

export class Viewer {

  constructor(name) {

    /* eslint new-cap: ["error", { "newIsCap": false }] */
    this.sh = new AMI.stackHelperFactory(THREE);
    this.AMI = AMI;
    this.THREE = THREE;
    this._name = name;
    this.loader = new AMI.VolumeLoader(this.container);
    this.data = [];
    this.reset();
  }

  get name() {
    return this._name;
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

  addData(file, dataName) {
    return this.loadVolume(file, dataName);
  }

  addLayer(series, viewName) {

    var canvas;
    var stack = series[0].stack[0];
    var StackHelper = new AMI.stackHelperFactory(THREE);
    var stackHelper = new StackHelper(stack);

    var worldbb = stack.worldBoundingBox();
    var lpsDims = new THREE.Vector3(worldbb[1] - worldbb[0], worldbb[3] - worldbb[2], worldbb[5] - worldbb[4]);
    var box = {
      center: stack.worldCenter().clone(),
      halfDimensions: new THREE.Vector3(lpsDims.x + 10, lpsDims.y + 10, lpsDims.z + 10)
    };

    console.log('in addLayer');

    // tune slice border
    stackHelper.border.color = 0xff9800;
    stackHelper.border.visible = false;

    console.log('adding layer', viewName);

    // init and zoom
    canvas = {
      width: this.views[viewName].container.clientWidth,
      height: this.views[viewName].container.clientHeight
    };

    this.views[viewName].camera.directions = [stack.xCosine, stack.yCosine, stack.zCosine];
    this.views[viewName].camera.box = box;

    // here is the issue
    this.views[viewName].camera.canvas = canvas;
    // view.camera.orientation = 'coronal';
    this.views[viewName].camera.update();

    // tune bounding box
    stackHelper.bbox.visible = false;
    this.views[viewName].camera.update();

    console.log('this.views[viewName].camera.stackOrientation;', this.views[viewName].camera.stackOrientation);
    stackHelper.orientation = this.views[viewName].camera.stackOrientation;
    // make it fit the most space: https://github.com/FNNDSC/ami/issues/120
    this.views[viewName].camera.fitBox(2, 2);

    this.views[viewName].camera.controls.addEventListener('OnScroll', (event) => {
      // console.log('e.delta', event.delta);
      if (event.delta > 0) {
        if (stackHelper.index >= stackHelper.orientationMaxIndex - 1) {
          return false;
        }
        stackHelper.index += 1;
      } else {
        if (stackHelper.index <= 0) {
          return false;
        }
        stackHelper.index -= 1;
      }
      return 0;
    });

    this.views[viewName].scene.add(stackHelper);
    console.log('done adding layer');
  }

  loadVolume(file, name) {
    var loader = this.loader;

    return loader.load(file)
      .then((data) => {
        // merge files into clean series/stack/frame structure
        var series = loader.data[0].mergeSeries(loader.data);

        // loader.free();
        // loader = null;

        console.log('done loading');
        return new Promise((resolve, reject) => {
          resolve(series);
        });

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

  constructor(element, plane) {
    this.element = element;
    this.container = document.getElementById(element);
    // this.type = type || 'orth';
    this.plane = plane || 0;
    this._initRenderer();
  }

  _initRenderer() {
    var self = this;
    var container = this.container;

    /* eslint new-cap: ["error", { "newIsCap": false }] */
    var OrthographicCamera = new AMI.orthographicCameraFactory(THREE);
    var TrackballOrthoControl = new AMI.trackballOrthoControlFactory(THREE);

    var camera = new OrthographicCamera(
      container.clientWidth / -2,
      container.clientWidth / 2,
      container.clientHeight / 2,
      container.clientHeight / -2,
      0.1,
      10000
    );

    var controls = new TrackballOrthoControl(camera, this.container);

    camera.orientation = this.plane;
    // camera.update();
    // camera.stackOrientation = this.plane;
    this.camera = camera;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    this.renderer.localClippingEnabled = true;
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setClearColor(0x000000, 1);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    controls.staticMoving = true;
    controls.noRotate = true;
    controls.noPan = true;
    controls.noZoom = false;
    this.camera.controls = controls;

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

    function animate() {
      // render
      controls.update();
      self.renderer.render(self.scene, camera);

      // request new frame
      requestAnimationFrame(() => {
        animate();
      });
    }
    animate();

  }

}
