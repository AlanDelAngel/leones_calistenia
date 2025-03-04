const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all users
router.get('/users', authenticate, authorize(['manager']), async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, first_name, last_name, email, role FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user role
router.put('/users/:id/role', authenticate, authorize(['manager']), async (req, res) => {
    const { role } = req.body;
    // Restrict managers from assigning manager roles
    if (role !== "member" && role !== "coach") {
        return res.status(403).json({ error: "No tienes permiso para asignar este rol." });
    }

    try {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ success: true, message: 'Rol actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a user
router.delete('/users/:id', authenticate, authorize(['manager']), async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all classes
router.get('/classes', authenticate, authorize(['manager']), async (req, res) => {
    try {
        const [classes] = await db.query('SELECT * FROM classes');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a class
router.post('/classes', authenticate, authorize(['manager']), async (req, res) => {
    const { coach_id, class_date, max_capacity } = req.body;
    try {
        await db.query('INSERT INTO classes (coach_id, class_date, max_capacity) VALUES (?, ?, ?)', [coach_id, class_date, max_capacity]);
        res.json({ success: true, message: 'Clase creada correctamente.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/memberships', authenticate, authorize(['manager']), async (req, res) => {
    try {
        const [memberships] = await db.query(`
            SELECT users.first_name AS member_name, class_packages.package_type, 
                   class_packages.remaining_classes, class_packages.expiration_date
            FROM class_packages
            JOIN users ON class_packages.member_id = users.id
        `);
        res.json(memberships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
