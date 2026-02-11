const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Import models
const User = require('./User')(sequelize);
const Employee = require('./Employee')(sequelize);
const Device = require('./Device')(sequelize);
const Assignment = require('./Assignment')(sequelize);
const ConsentForm = require('./ConsentForm')(sequelize);
const AuditLog = require('./AuditLog')(sequelize);

// Define Associations

// 1. User <-> Employee
User.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employeeDetails' });
Employee.hasOne(User, { foreignKey: 'employee_id', as: 'userAccount' });

// 2. Employee <-> Device (Currently Assigned)
Employee.hasMany(Device, { foreignKey: 'currently_assigned_to', as: 'currentDevices' });
Device.belongsTo(Employee, { foreignKey: 'currently_assigned_to', as: 'assignee' });

// 3. Employee <-> Assignment (History)
Employee.hasMany(Assignment, { foreignKey: 'employee_id', as: 'assignmentHistory' });
Assignment.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

// 4. Device <-> Assignment (History)
Device.hasMany(Assignment, { foreignKey: 'device_id', as: 'assignmentHistory' });
Assignment.belongsTo(Device, { foreignKey: 'device_id', as: 'device' });

// 5. Assignment <-> Users (Assigned By/Unassigned By)
User.hasMany(Assignment, { foreignKey: 'assigned_by', as: 'assignmentsGiven' });
Assignment.belongsTo(User, { foreignKey: 'assigned_by', as: 'assigner' });

User.hasMany(Assignment, { foreignKey: 'unassigned_by', as: 'assignmentsRevoked' });
Assignment.belongsTo(User, { foreignKey: 'unassigned_by', as: 'revoker' });

// 6. Consent Forms
Employee.hasMany(ConsentForm, { foreignKey: 'employee_id', as: 'consentForms' });
ConsentForm.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

User.hasMany(ConsentForm, { foreignKey: 'uploaded_by', as: 'uploadedFiles' });
ConsentForm.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });

Assignment.hasOne(ConsentForm, { foreignKey: 'assignment_id', as: 'consentForm' });
ConsentForm.belongsTo(Assignment, { foreignKey: 'assignment_id', as: 'assignment' });

// 7. Audit Logs
User.hasMany(AuditLog, { foreignKey: 'user_id', as: 'auditLogs' });
AuditLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Export everything
module.exports = {
    sequelize,
    User,
    Employee,
    Device,
    Assignment,
    ConsentForm,
    AuditLog
};
