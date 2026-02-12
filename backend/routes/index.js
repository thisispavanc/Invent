const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/users', require('./users'));
router.use('/devices', require('./devices'));
router.use('/employees', require('./employees'));
router.use('/dashboard', require('./dashboard'));

module.exports = router;
