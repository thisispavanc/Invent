const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const upload = require('../config/multer');

// IMPORTANT: More specific routes must come before generic :id routes
router.get('/my-devices', isAuthenticated, deviceController.getMyDevices);
router.get('/all-with-photos', isAdmin, deviceController.getAllDevicesWithPhotos);
router.post('/assignment/:assignmentId/upload-photo', isAuthenticated, upload.single('photo'), deviceController.uploadDevicePhoto);

router.get('/', isAuthenticated, deviceController.listDevices);
router.get('/:id', isAuthenticated, deviceController.getDevice);
router.post('/', isAdmin, deviceController.createDevice);
router.put('/:id', isAdmin, deviceController.updateDevice);
router.delete('/:id', isAdmin, deviceController.deleteDevice);

module.exports = router;
