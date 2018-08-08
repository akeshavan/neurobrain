export default class Viewer {
  constructor(name) {
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
