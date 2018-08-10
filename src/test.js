import {neurobrain} from './viewer.js'
var viewer = neurobrain.Viewer('myviewer');
var view1 = neurobrain.View('view1');
var file = 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/adi_brain/adi_brain.nii.gz';

viewer.addView(view1);
viewer.addLayer(file, 'view1');
