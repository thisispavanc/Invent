const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const ConsentForm = sequelize.define('ConsentForm', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        form_type: {
            type: DataTypes.ENUM('joining', 'assignment'),
            allowNull: false
        },
        file_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        file_name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        file_size: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        file_type: DataTypes.STRING(50),
        uploaded_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        upload_date: {
            type: DataTypes.DATE, // Datetime
            defaultValue: DataTypes.NOW
        },
        assignment_id: DataTypes.INTEGER,
        notes: DataTypes.TEXT
    }, {
        tableName: 'consent_forms',
        timestamps: true, // CreatedAt is handled by upload_date sort of, but let's keep it consistent
        underscored: true
    });

    return ConsentForm;
};
