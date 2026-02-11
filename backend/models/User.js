const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password_hash: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('admin', 'employee'),
            defaultValue: 'employee'
        },
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'employees', // referencing table name directly or model name if using string reference
                key: 'id'
            }
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true
    });

    return User;
};
