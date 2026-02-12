const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.get('/', isAuthenticated, deviceController.listDevices);
router.get('/:id', isAuthenticated, deviceController.getDevice);
router.post('/', isAdmin, deviceController.createDevice);
router.put('/:id', isAdmin, deviceController.updateDevice);
router.delete('/:id', isAdmin, deviceController.deleteDevice);

module.exports = router;
