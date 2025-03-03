const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, async (req, res) => {
    try {
        const [user] = await db.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!user.length) return res.status(404).json({ error: 'User not found' });
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user profile (Members & Coaches Only)
router.put('/profile', authenticate, authorize(['member', 'coach']), async (req, res) => {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) return res.status(400).json({ error: 'All fields are required' });

    try {
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
            [first_name, last_name, email, req.user.id]
        );
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
