const { User, AuditLog } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const existing = await User.findOne({ where: { [Op.or]: [{ username }, { email }] } });
        if (existing) return res.status(409).json({ success: false, message: 'Username or email already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password_hash,
            role: role || 'employee',
            created_by: req.session.userId,
            is_active: true
        });

        // Audit Log
        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'SuperAdmin',
            action_type: 'CREATE',
            entity_type: 'USER',
            entity_id: user.id,
            description: `Created user ${username} with role ${role}`,
            ip_address: req.ip
        });

        res.status(201).json({ success: true, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ success: false, message: 'Failed to create user' });
    }
};

exports.listUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users' });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password_hash'] }
        });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username, email, role, is_active } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const oldValues = user.toJSON();

        if (username) user.username = username;
        if (email) user.email = email;
        if (role) user.role = role;
        if (is_active !== undefined) user.is_active = is_active;

        await user.save();

        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'SuperAdmin',
            action_type: 'UPDATE',
            entity_type: 'USER',
            entity_id: user.id,
            description: `Updated user ${user.username}`,
            old_values: oldValues,
            new_values: user.toJSON(),
            ip_address: req.ip
        });

        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update user' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ success: false, message: 'Password required' });

        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(password, salt);
        await user.save();

        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'SuperAdmin',
            action_type: 'PASSWORD_CHANGE',
            entity_type: 'USER',
            entity_id: user.id,
            description: `Reset password for user ${user.username}`,
            ip_address: req.ip
        });

        res.json({ success: true, message: 'Password updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

exports.unlockUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.is_locked = false;
        user.locked_until = null;
        user.failed_login_attempts = 0;
        await user.save();

        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'SuperAdmin',
            action_type: 'UPDATE',
            entity_type: 'USER',
            entity_id: user.id,
            description: `Unlocked user ${user.username}`,
            ip_address: req.ip
        });

        res.json({ success: true, message: 'User unlocked' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unlock user' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.is_active = false;
        await user.save();

        await AuditLog.create({
            session_id: req.sessionID || 'unknown',
            user_id: req.session.userId,
            username: req.session.username || 'SuperAdmin',
            action_type: 'DELETE',
            entity_type: 'USER',
            entity_id: user.id,
            description: `Deactivated user ${user.username}`,
            ip_address: req.ip
        });

        res.json({ success: true, message: 'User deactivated' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to deactivate user' });
    }
};
