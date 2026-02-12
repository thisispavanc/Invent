const { User, Device, Employee, sequelize } = require('../models');

async function debugStats() {
    try {
        await sequelize.authenticate();
        console.log('Database connected.');

        const userCount = await User.count();
        console.log('Total Users:', userCount);
        const users = await User.findAll({ attributes: ['username', 'role'] });
        console.log('Users:', JSON.stringify(users, null, 2));

        const empCount = await Employee.count();
        console.log('Total Employees:', empCount);
        const employees = await Employee.findAll();
        console.log('Employees:', JSON.stringify(employees, null, 2));

        const devCount = await Device.count();
        console.log('Total Devices:', devCount);
        const devices = await Device.findAll();
        console.log('Devices:', JSON.stringify(devices, null, 2));

        console.log('Done.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

debugStats();
