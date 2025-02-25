const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Obtener todas las clases
router.get('/', async (req, res) => {
    try {
        const [classes] = await db.query('SELECT * FROM classes');
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear nueva clase (solo Manager)
router.post('/', authenticate, async (req, res) => {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Acceso denegado' });

    const { coach_id, class_date, max_capacity } = req.body;
    try {
        const [result] = await db.query('INSERT INTO classes (coach_id, class_date, max_capacity) VALUES (?, ?, ?)', 
        [coach_id, class_date, max_capacity]);
        res.json({ success: true, class_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar clase (solo Manager)
router.put('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Acceso denegado' });

    const { coach_id, class_date, max_capacity } = req.body;
    try {
        await db.query('UPDATE classes SET coach_id = ?, class_date = ?, max_capacity = ? WHERE id = ?', 
        [coach_id, class_date, max_capacity, req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar clase (solo Manager, solo si no tiene inscripciones)
router.delete('/:id', authenticate, async (req, res) => {
    if (req.user.role !== 'manager') return res.status(403).json({ error: 'Acceso denegado' });

    try {
        const [enrollments] = await db.query('SELECT * FROM class_enrollments WHERE class_id = ?', [req.params.id]);
        if (enrollments.length > 0) return res.status(400).json({ error: 'No se puede eliminar una clase con inscripciones' });

        await db.query('DELETE FROM classes WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
