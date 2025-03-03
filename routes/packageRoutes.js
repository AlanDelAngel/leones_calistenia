const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Purchase a class package (Members Only)
router.post('/', authenticate, authorize(['member']), async (req, res) => {
    const memberId = req.user.id;
    const { package_type } = req.body;

    const packageDays = {
        '2': 2,
        '7': 7,
        '30': 30,
        '60': 60
    };

    if (!packageDays[package_type]) {
        return res.status(400).json({ error: 'Invalid package type' });
    }

    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + packageDays[package_type]);

        await db.query(
            'INSERT INTO class_packages (member_id, package_type, remaining_classes, purchase_date, expiration_date) VALUES (?, ?, ?, CURDATE(), ?)',
            [memberId, package_type, package_type, expirationDate]
        );

        res.json({ message: 'Package purchased successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get member's active package
router.get('/active', authenticate, authorize(['member']), async (req, res) => {
    try {
        const [activePackage] = await db.query(
            'SELECT * FROM class_packages WHERE member_id = ? AND remaining_classes > 0 AND expiration_date >= CURDATE() ORDER BY expiration_date ASC LIMIT 1',
            [req.user.id]
        );

        if (!activePackage.length) {
            return res.status(404).json({ error: 'No active package found' });
        }
        res.json(activePackage[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
