const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Employee = sequelize.define('Employee', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true, // Use autoIncrement for primary key if needed, or rely on UUID/EmployeeID as business key. PRD says INT AI PK.
            primaryKey: true
        },
        employee_id: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        phone_number: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        address_street: DataTypes.STRING(255),
        address_city: DataTypes.STRING(100),
        address_state: DataTypes.STRING(100),
        address_zip: DataTypes.STRING(20),
        address_country: {
            type: DataTypes.STRING(100),
            defaultValue: 'India'
        },
        department: DataTypes.STRING(100),
        designation: DataTypes.STRING(100),
        date_of_joining: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        employment_status: {
            type: DataTypes.ENUM('active', 'inactive', 'terminated'),
            defaultValue: 'active'
        },
        manager_name: DataTypes.STRING(100),
        photo_url: DataTypes.TEXT,
        photo_uploaded_at: DataTypes.DATE
    }, {
        tableName: 'employees',
        timestamps: true,
        underscored: true
    });

    return Employee;
};
