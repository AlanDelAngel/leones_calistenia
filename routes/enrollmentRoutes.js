const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Enroll in a class (Members Only)
router.post('/:class_id', authenticate, authorize(['member']), async (req, res) => {
    const memberId = req.user.id;
    const classId = req.params.class_id;

    try {
        // Check if the class exists
        const [classInfo] = await db.query('SELECT * FROM classes WHERE id = ?', [classId]);
        if (!classInfo.length) return res.status(404).json({ error: 'Class not found' });

        // Check if class is full
        const [enrollmentCount] = await db.query('SELECT COUNT(*) AS enrolled FROM class_enrollments WHERE class_id = ?', [classId]);
        if (enrollmentCount[0].enrolled >= classInfo[0].max_capacity) {
            return res.status(400).json({ error: 'Class is full' });
        }

        // Check if member has an active package with remaining classes
        const [activePackage] = await db.query(
            'SELECT id, remaining_classes, expiration_date FROM class_packages WHERE member_id = ? AND remaining_classes > 0 AND expiration_date >= CURDATE() ORDER BY expiration_date ASC LIMIT 1',
            [memberId]
        );
        
        if (!activePackage.length) {
            return res.status(400).json({ error: 'No valid package available' });
        }

        // Deduct one class from package
        await db.query('UPDATE class_packages SET remaining_classes = remaining_classes - 1 WHERE id = ?', [activePackage[0].id]);

        // Enroll the member
        await db.query('INSERT INTO class_enrollments (member_id, class_id) VALUES (?, ?)', [memberId, classId]);

        res.json({ message: 'Enrollment successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
