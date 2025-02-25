const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Obtener todos los usuarios (solo para admins en futuro)
router.get('/', authenticate, async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, first_name, last_name, email, role FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un usuario por ID
router.get('/me', authenticate, async (req, res) => {
    try {
        const [user] = await db.query(
            'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
            [req.user.id]
        );

        if (!user.length) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(user[0]);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/delete', authenticate, async (req, res) => {
    try {
        await db.query("DELETE FROM users WHERE id = ?", [req.user.id]);
        res.json({ success: true, message: "Cuenta eliminada correctamente." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;