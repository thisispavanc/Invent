const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ success: false, message: 'Authentication required' });
};

const isSuperAdmin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.session.role === 'super_admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Super admin access required' });
};

const isAdmin = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (req.session.role === 'admin' || req.session.role === 'super_admin') {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { isAuthenticated, isSuperAdmin, isAdmin };
