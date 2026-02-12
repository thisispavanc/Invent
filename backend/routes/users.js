const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isSuperAdmin } = require('../middlewares/auth');

// All routes require Super Admin access
router.use(isSuperAdmin);

router.post('/', userController.createUser);
router.get('/', userController.listUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.put('/:id/password', userController.resetPassword);
router.post('/:id/unlock', userController.unlockUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
