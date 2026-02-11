const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Device = sequelize.define('Device', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        asset_tag: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        device_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        device_category: {
            type: DataTypes.ENUM(
                'laptop', 'desktop', 'monitor', 'mobile_phone',
                'tablet', 'accessory', 'software_license', 'other'
            ),
            allowNull: false
        },
        serial_number: {
            type: DataTypes.STRING(100),
            unique: true
        },
        brand: DataTypes.STRING(100),
        specifications: DataTypes.TEXT,
        purchase_cost: DataTypes.DECIMAL(10, 2),
        purchase_date: DataTypes.DATEONLY,
        warranty_expiry_date: DataTypes.DATEONLY,
        vendor: DataTypes.STRING(100),
        device_status: {
            type: DataTypes.ENUM('available', 'assigned', 'in_repair', 'retired'),
            defaultValue: 'available'
        },
        device_condition: {
            type: DataTypes.ENUM('new', 'good', 'fair', 'poor'),
            defaultValue: 'good'
        },
        location: {
            type: DataTypes.STRING(100),
            defaultValue: 'Office'
        },
        currently_assigned_to: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees',
                key: 'id'
            }
        },
        assignment_date: DataTypes.DATEONLY,
        assignment_notes: DataTypes.TEXT
    }, {
        tableName: 'devices',
        timestamps: true,
        underscored: true
    });

    return Device;
};
