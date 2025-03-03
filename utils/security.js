const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Security Middleware
const securityMiddleware = (app) => {
    // Set security headers
    app.use(helmet());
    
    // Enable CORS
    app.use(cors({
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }));
    
    // Rate Limiting (Prevent brute force attacks)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests, please try again later.',
    });
    app.use(limiter);
};

module.exports = securityMiddleware;
