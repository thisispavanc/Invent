const { Device, Employee, AuditLog, Assignment, User } = require('../models');
const { Op } = require('sequelize');
const path = require('path');

exports.listDevices = async (req, res) => {
    try {
        const { search, category, status } = req.query;
        const where = {};

        if (search) {
            where[Op.or] = [
                { device_name: { [Op.like]: `%${search}%` } },
                { asset_tag: { [Op.like]: `%${search}%` } },
                { serial_number: { [Op.like]: `%${search}%` } }
            ];
        }
        if (category) where.device_category = category;
        if (status) where.device_status = status;

        const devices = await Device.findAll({
            where,
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['id', 'full_name', 'employee_id']
            }],
            order: [['created_at', 'DESC']]
        });
        res.json({ success: true, devices });
    } catch (error) {
        console.error('List devices error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch devices' });
    }
};

exports.getDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id, {
            include: [{
                model: Employee,
                as: 'employee',
                attributes: ['id', 'full_name', 'employee_id', 'email', 'department']
            }, {
                model: Assignment,
                as: 'assignmentHistory',
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'full_name', 'employee_id']
                }],
                order: [['assignment_date', 'DESC']]
            }]
        });
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });
        res.json({ success: true, device });
    } catch (error) {
        console.error('Get device error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch device' });
    }
};

exports.createDevice = async (req, res) => {
    try {
        const d = req.body;

        // Basic validation
        if (!d.asset_tag || !d.device_name || !d.device_category) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Check for duplicate asset_tag or serial_number
        const existing = await Device.findOne({
            where: {
                [Op.or]: [
                    { asset_tag: d.asset_tag },
                    ...(d.serial_number ? [{ serial_number: d.serial_number }] : [])
                ]
            }
        });
        if (existing) {
            return res.status(409).json({ success: false, message: 'Device with this Asset Tag or Serial Number already exists' });
        }

        const device = await Device.create(d);

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'CREATE',
                entity_type: 'DEVICE',
                entity_id: device.id,
                description: `Created device ${device.asset_tag} - ${device.device_name}`,
                ip_address: req.ip
            });
        }

        res.status(201).json({ success: true, device });
    } catch (error) {
        console.error('Create device error:', error);
        res.status(500).json({ success: false, message: 'Failed to create device' });
    }
};

exports.updateDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

        const oldValues = device.toJSON();
        const d = req.body;

        await device.update(d);

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'UPDATE',
                entity_type: 'DEVICE',
                entity_id: device.id,
                description: `Updated device ${device.asset_tag}`,
                old_values: oldValues,
                new_values: device.toJSON(),
                ip_address: req.ip
            });
        }

        res.json({ success: true, device });
    } catch (error) {
        console.error('Update device error:', error);
        res.status(500).json({ success: false, message: 'Failed to update device' });
    }
};

exports.deleteDevice = async (req, res) => {
    try {
        const device = await Device.findByPk(req.params.id);
        if (!device) return res.status(404).json({ success: false, message: 'Device not found' });

        device.device_status = 'retired';
        await device.save();

        // Audit Log
        const userId = req.session ? req.session.userId : null;
        if (userId) {
            await AuditLog.create({
                session_id: req.sessionID || 'unknown',
                user_id: userId,
                username: req.session.username || 'Admin',
                action_type: 'DELETE',
                entity_type: 'DEVICE',
                entity_id: device.id,
                description: `Retired device ${device.asset_tag}`,
                ip_address: req.ip
            });
        }

        res.json({ success: true, message: 'Device retired' });
    } catch (error) {
        console.error('Delete device error:', error);
        res.status(500).json({ success: false, message: 'Failed to retire device' });
    }
};

// Get devices assigned to logged-in employee
exports.getMyDevices = async (req, res) => {
    try {
        // Get user's employee record
        const user = await User.findByPk(req.session.userId, {
            include: [{ model: Employee, as: 'employeeDetails' }]
        });

        if (!user || !user.employeeDetails) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        const employeeId = user.employeeDetails.id;

        // Get all active assignments for this employee with device details
        const assignments = await Assignment.findAll({
            where: {
                employee_id: employeeId,
                assignment_status: 'active'
            },
            include: [{
                model: Device,
                as: 'device',
                include: [{
                    model: Employee,
                    as: 'employee',
                    attributes: ['id', 'full_name', 'employee_id']
                }]
            }],
            order: [['assignment_date', 'DESC']]
        });

        res.json({ success: true, assignments });
    } catch (error) {
        console.error('Get my devices error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch your devices' });
    }
};

// Upload device photo by employee
exports.uploadDevicePhoto = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No photo uploaded' });
        }

        // Get user's employee record
        const user = await User.findByPk(req.session.userId, {
            include: [{ model: Employee, as: 'employeeDetails' }]
        });

        if (!user || !user.employeeDetails) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        const employeeId = user.employeeDetails.id;

        // Find the assignment and verify it belongs to this employee
        const assignment = await Assignment.findByPk(assignmentId);

        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        if (assignment.employee_id !== employeeId) {
            return res.status(403).json({ success: false, message: 'Not authorized to upload photo for this assignment' });
        }

        // Save photo URL (relative path)
        const photoUrl = `/uploads/device-photos/${req.file.filename}`;
        assignment.device_photo_url = photoUrl;
        await assignment.save();

        // Audit log
        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'Employee',
            action_type: 'UPDATE',
            entity_type: 'ASSIGNMENT',
            entity_id: assignment.id,
            description: `Uploaded device photo for assignment ${assignmentId}`,
            ip_address: req.ip
        });

        res.json({ success: true, photoUrl, message: 'Photo uploaded successfully' });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload photo' });
    }
};

// Get all assignments with photos for admin gallery view
exports.getAllDevicesWithPhotos = async (req, res) => {
    try {
        const assignments = await Assignment.findAll({
            where: {
                device_photo_url: { [Op.ne]: null },
                assignment_status: 'active'
            },
            include: [{
                model: Device,
                as: 'device'
            }, {
                model: Employee,
                as: 'employee',
                attributes: ['id', 'full_name', 'employee_id']
            }],
            order: [['updated_at', 'DESC']]
        });

        res.json({ success: true, assignments });
    } catch (error) {
        console.error('Get all device photos error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch device photos' });
    }
};

