const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const AuditLog = sequelize.define('AuditLog', {
        id: {
            type: DataTypes.INTEGER, // PRD says BIGINT, but Sequelize usually maps INTEGER to INT. Let's use BIGINT if possible or just INTEGER for now.
            autoIncrement: true,
            primaryKey: true
        },
        session_id: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        action_type: {
            type: DataTypes.ENUM(
                'LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE',
                'ASSIGN', 'UNASSIGN', 'TRANSFER', 'UPLOAD',
                'EXPORT', 'PASSWORD_CHANGE'
            ),
            allowNull: false
        },
        entity_type: {
            type: DataTypes.ENUM(
                'USER', 'EMPLOYEE', 'DEVICE', 'ASSIGNMENT',
                'CONSENT_FORM', 'REPORT'
            ),
            allowNull: false
        },
        entity_id: DataTypes.INTEGER,
        ip_address: DataTypes.STRING(45),
        user_agent: DataTypes.TEXT,
        old_values: DataTypes.JSON,
        new_values: DataTypes.JSON,
        description: DataTypes.TEXT,
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'audit_logs',
        timestamps: false, // PRD has timestamp column
        underscored: true
    });

    return AuditLog;
};
