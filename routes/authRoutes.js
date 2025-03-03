const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const BLACKLISTED_TOKENS = new Set();

// Register a new user
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
    if (!first_name || !last_name || !email || !password || !role) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)', 
            [first_name, last_name, email, hashedPassword, role]);
        res.status(201).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'Credenciales inválidas' });
        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Credenciales inválidas' });
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Logout Route
router.post('/logout', authenticate, (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ error: "Token missing" });
    }

    BLACKLISTED_TOKENS.add(token);
    res.json({ message: "Logged out successfully" });
});

// Middleware to check if token is blacklisted
const checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (BLACKLISTED_TOKENS.has(token)) {
        return res.status(401).json({ error: "Token is invalid, please login again" });
    }
    next();
};

router.use(checkBlacklist);

module.exports = router;
