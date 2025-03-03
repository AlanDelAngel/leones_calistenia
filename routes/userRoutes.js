const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/profile', authenticate, async (req, res) => {
    try {
        const [user] = await db.query('SELECT id, first_name, last_name, email, role FROM users WHERE id = ?', [req.user.id]);
        if (!user.length) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener todos los usuarios (solo para Managers)
router.get('/', authenticate, authorize(['manager']), async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, first_name, last_name, email, role FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar perfil del usuario (solo Members y Coaches pueden modificar su perfil)
router.put('/profile', authenticate, authorize(['member', 'coach']), async (req, res) => {
    const { first_name, last_name, email } = req.body;
    if (!first_name || !last_name || !email) return res.status(400).json({ error: 'Todos los campos son obligatorios' });

    try {
        await db.query(
            'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
            [first_name, last_name, email, req.user.id]
        );
        res.json({ message: 'Perfil actualizado con éxito' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
