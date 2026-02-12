const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { isAuthenticated } = require('../middlewares/auth');

router.get('/stats', isAuthenticated, dashboardController.getStats);
router.get('/audit-logs', isAuthenticated, dashboardController.getAuditLogs);
router.get('/vertical/:verticalName', isAuthenticated, dashboardController.getVerticalDetails);

module.exports = router;
