const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Assignment = sequelize.define('Assignment', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        device_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        assignment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        unassignment_date: DataTypes.DATEONLY,
        assignment_reason: DataTypes.TEXT,
        unassignment_reason: DataTypes.TEXT,
        assignment_status: {
            type: DataTypes.ENUM('active', 'completed', 'transferred'),
            defaultValue: 'active'
        },
        assigned_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unassigned_by: DataTypes.INTEGER,
        consent_form_id: DataTypes.INTEGER
    }, {
        tableName: 'assignments',
        timestamps: true,
        underscored: true
    });

    return Assignment;
};
