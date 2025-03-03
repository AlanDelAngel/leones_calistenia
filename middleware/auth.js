const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to authenticate users
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden: Invalid token" });
        req.user = user;
        next();
    });
};

// Middleware to enforce role-based access
const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
