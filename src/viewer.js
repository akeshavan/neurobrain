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

export default class Viewer {
  constructor(name) {
    this.THREE = THREE;
    this.AMI = AMI;
    // this.CoreUtils = AMI.CoreUtils;
    this.StackHelper = AMI.stackHelperFactory(THREE);

    this.sh = new this.StackHelper();

    this._name = name;
  }
  get name() {
    return this._name;
  }
  addView(elementId, plane) {
    /*
    elementId = DOM element id,
    plane = "x", "y", "z"
    */
    this;
  }
  loadImage(filenameOrUrl) {
    /*
    filename_or_url = "filename or url to .nii/.nii.gz/.mgz file"
    */
    this;
  }
}
