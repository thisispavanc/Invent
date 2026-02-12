const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

router.get('/', isAuthenticated, employeeController.listEmployees);
router.get('/:id', isAuthenticated, employeeController.getEmployee);
router.post('/', isAdmin, employeeController.createEmployee);
router.put('/:id', isAdmin, employeeController.updateEmployee);
router.delete('/:id', isAdmin, employeeController.deleteEmployee);

module.exports = router;
