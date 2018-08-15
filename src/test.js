import { neurobrain } from './viewer';

var viewer = neurobrain.Viewer('myviewer');
var view1 = neurobrain.View('view1');
var view2 = neurobrain.View('view2');
var file = 'https://cdn.rawgit.com/FNNDSC/data/master/nifti/adi_brain/adi_brain.nii.gz';

viewer.addView(view1);
viewer.addView(view2);
viewer.addLayer(file, 'view1');
viewer.addLayer(file, 'view2', 'y');
