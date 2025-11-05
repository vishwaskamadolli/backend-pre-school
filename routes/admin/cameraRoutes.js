const express = require('express');
const { addCamera, getCameras, deleteCamera, assignCamera, getCameraById, updateCamera } = require('../../controller/admin/cameraController');


const router = express.Router();

// Camera routes (no middleware)
router.post('/addcamera', addCamera);
router.get('/get/cameras', getCameras);
router.get('/id/cameras/:id', getCameraById);
// Update camera
router.put('/update/cameras/:id', updateCamera);
router.delete('/:id', deleteCamera);
router.put('/:id/assign', assignCamera);

module.exports = router;
