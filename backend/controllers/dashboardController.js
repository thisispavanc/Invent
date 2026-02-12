const { Device, Employee, AuditLog, User, sequelize } = require('../models');
const { Op } = require('sequelize');
console.log('DEBUG: Op loaded:', !!Op);

exports.getStats = async (req, res) => {
    try {
        console.log('DEBUG: getStats called');
        console.log('DEBUG: Session:', req.session);
        console.log('DEBUG: User:', req.user);

        /* 
        DEBUGGING MODE: Temporarily verifying connection.
        If these values show up on frontend, the issue is DB query.
        If they don't, the issue is the API call failing silently. 
        */
        /*
         return res.json({
             success: true,
             stats: {
                 totalDevices: 999,
                 assignedDevices: 888,
                 expiringWarranties: 777,
                 totalEmployees: 666
             },
             recentActivity: [],
             verticalStats: {}
         });
         */

        // If employee, return only their stats
        if ((req.session && req.session.role === 'employee') || (req.user && req.user.role === 'employee')) {
            console.log('DEBUG: Returning employee view');
            // Fetch assigned devices count
            const myDevicesCount = await Device.count({
                where: { currently_assigned_to: req.session.userId || req.user?.id } // Assuming mapping exists, strictly speaking currently_assigned_to links to Employee ID not User ID. 
                // We need to find the Employee record for this User first if they are linked.
                // For now, let's assume the Dashboard for Employee just shows generic info or we skip this complex mapping if not set up.
                // User said: "only the assigned devices and details should be visible to the employee"
            });

            // Actually, currently_assigned_to is an Employee ID. Users table is for login.
            // We need to link User -> Employee.
            // The User model has `employee_id` field? Let's check User model.
            // If not, we might need to rely on email match or similar.
            // Let's check User model in next step if needed. 
            // For now, let's return a flag so frontend renders differently.

            return res.json({
                success: true,
                role: 'employee',
                stats: {}
            });
        }

        // 1. Total Devices
        const allDevicesRaw = await Device.findAll();
        console.log('DEBUG: All Devices Raw Check:', allDevicesRaw.length);
        console.log('DEBUG: First Device Status:', allDevicesRaw.length > 0 ? allDevicesRaw[0].device_status : 'None');

        const totalDevices = await Device.count({
            where: { device_status: { [Op.ne]: 'retired' } }
        });
        console.log('DEBUG: totalDevices:', totalDevices);

        // 2. Assigned Devices
        const assignedDevices = await Device.count({
            where: { device_status: 'assigned' }
        });
        console.log('DEBUG: assignedDevices:', assignedDevices);

        // 3. Expiring Warranties (Next 30 days)
        const today = new Date();
        const next30Days = new Date();
        next30Days.setDate(today.getDate() + 30);

        const expiringWarranties = await Device.count({
            where: {
                warranty_expiry_date: {
                    [Op.between]: [today, next30Days]
                },
                device_status: { [Op.ne]: 'retired' }
            }
        });
        console.log('DEBUG: expiringWarranties:', expiringWarranties);

        // 4. Total Employees
        const totalEmployees = await Employee.count({
            where: { employment_status: 'active' }
        });
        console.log('DEBUG: totalEmployees:', totalEmployees);

        // 5. Recent Activity (Audit Logs)
        const recentActivity = await AuditLog.findAll({
            limit: 50, // Increased limit for sidebar
            order: [['timestamp', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }]
        });

        // 6. Vertical (Department) Stats

        // A. Active Employees per department
        const employeesByDept = await Employee.findAll({
            where: { employment_status: 'active' },
            attributes: ['department', [sequelize.fn('COUNT', sequelize.col('Employee.id')), 'count']],
            group: ['department']
        });

        // B. Assigned Devices per department
        // We query from Employee and join Devices to count them grouping by department
        const devicesByDept = await Employee.findAll({
            attributes: [
                'department',
                [sequelize.fn('COUNT', sequelize.col('currentDevices.id')), 'count']
            ],
            include: [{
                model: Device,
                as: 'currentDevices',
                attributes: [], // We don't need device fields, just the count
                where: { device_status: 'assigned' }
            }],
            group: ['department'],
            raw: true
        });

        console.log('DEBUG: devicesByDept:', devicesByDept);

        // Format Vertical Stats
        const verticalStats = {};

        // Helper to normalize department names (e.g. handle nulls)
        const getDeptName = (d) => d || 'Unassigned';

        // Process Employees
        employeesByDept.forEach(e => {
            const dept = getDeptName(e.get('department'));
            if (!verticalStats[dept]) verticalStats[dept] = { employees: 0, devices: 0 };
            verticalStats[dept].employees = parseInt(e.get('count'), 10);
        });

        // Process Devices
        devicesByDept.forEach(d => {
            const dept = getDeptName(d.department);
            if (!verticalStats[dept]) verticalStats[dept] = { employees: 0, devices: 0 };
            verticalStats[dept].devices = parseInt(d.count, 10);
        });

        res.json({
            success: true,
            stats: {
                totalDevices,
                assignedDevices,
                expiringWarranties,
                totalEmployees
            },
            recentActivity,
            verticalStats
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
    }
};

exports.getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            order: [['timestamp', 'DESC']],
            include: [{
                model: User,
                as: 'user',
                attributes: ['username']
            }],
            limit: 1000 // reasonable limit for safety
        });
        res.json({ success: true, logs });
    } catch (error) {
        console.error('Audit logs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
    }
};

exports.getVerticalDetails = async (req, res) => {
    try {
        const { verticalName } = req.params;
        const decodedVertical = decodeURIComponent(verticalName);

        // 1. Get Employees in this Vertical
        const employees = await Employee.findAll({
            where: {
                department: decodedVertical,
                employment_status: 'active'
            },
            attributes: ['id', 'full_name', 'email', 'designation', 'phone_number']
        });

        // 2. Get Devices assigned to Employees in this Vertical
        // We can find devices where the assigned employee belongs to this department.
        const devices = await Device.findAll({
            where: { device_status: 'assigned' },
            include: [{
                model: Employee,
                as: 'employee',
                where: { department: decodedVertical },
                attributes: ['id', 'full_name']
            }]
        });

        res.json({
            success: true,
            data: {
                employees,
                devices
            }
        });

    } catch (error) {
        console.error('Vertical details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch vertical details' });
    }
};
