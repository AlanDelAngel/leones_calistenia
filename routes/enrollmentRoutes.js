const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Inscribirse en una clase
router.post('/:class_id', authenticate, async (req, res) => {
    if (req.user.role !== 'member') return res.status(403).json({ error: 'Solo los miembros pueden inscribirse' });

    try {
        const [classInfo] = await db.query('SELECT * FROM classes WHERE id = ?', [req.params.class_id]);
        if (!classInfo.length) return res.status(404).json({ error: 'Clase no encontrada' });

        const [result] = await db.query('INSERT INTO class_enrollments (member_id, class_id) VALUES (?, ?)', 
        [req.user.id, req.params.class_id]);

        res.json({ success: true, enrollment_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
