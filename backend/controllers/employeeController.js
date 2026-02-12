const { Employee, Device, AuditLog } = require('../models');
const { Op } = require('sequelize');

exports.listEmployees = async (req, res) => {
    try {
        const { search, department, status } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { full_name: { [Op.like]: `%${search}%` } },
                { employee_id: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        if (department) where.department = department;
        if (status) where.employment_status = status;

        const employees = await Employee.findAll({
            where,
            order: [['full_name', 'ASC']]
        });
        res.json({ success: true, employees });
    } catch (error) {
        console.error('List employees error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employees' });
    }
};

exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id, {
            include: [{
                model: Device,
                as: 'currentDevices'
            }]
        });
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
        res.json({ success: true, employee });
    } catch (error) {
        console.error('Get employee error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch employee' });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const e = req.body;

        // Basic validation
        if (!e.employee_id || !e.full_name || !e.email || !e.date_of_joining) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check for duplicates
        const existing = await Employee.findOne({
            where: {
                [Op.or]: [
                    { employee_id: e.employee_id },
                    { email: e.email }
                ]
            }
        });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Employee with this ID or Email already exists' });
        }

        const employee = await Employee.create(e);

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'CREATE',
                entity_type: 'EMPLOYEE',
                entity_id: employee.id,
                description: `Created employee ${employee.full_name}`,
                ip_address: req.ip
            });
        }

        res.status(201).json({ success: true, employee });
    } catch (error) {
        console.error('Create employee error:', error);
        res.status(500).json({ success: false, message: 'Failed to create employee' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

        const oldValues = employee.toJSON();
        const e = req.body;

        await employee.update(e);

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'UPDATE',
                entity_type: 'EMPLOYEE',
                entity_id: employee.id,
                description: `Updated employee ${employee.full_name}`,
                old_values: oldValues,
                new_values: employee.toJSON(),
                ip_address: req.ip
            });
        }

        res.json({ success: true, employee });
    } catch (error) {
        console.error('Update employee error:', error);
        res.status(500).json({ success: false, message: 'Failed to update employee' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByPk(req.params.id);
        if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });

        employee.employment_status = 'terminated';
        await employee.save();

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'DELETE',
                entity_type: 'EMPLOYEE',
                entity_id: employee.id,
                description: `Terminated employee ${employee.full_name}`,
                ip_address: req.ip
            });
        }

        res.json({ success: true, message: 'Employee terminated' });
    } catch (error) {
        console.error('Delete employee error:', error);
        res.status(500).json({ success: false, message: 'Failed to terminate employee' });
    }
};
