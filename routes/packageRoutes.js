const express = require('express');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/purchase', authenticate, authorize(['member']), async (req, res) => {
    const memberId = req.user.id;
    const { package_type } = req.body;

    const packagePrices = {
        "2": 10,
        "7": 30,
        "30": 100,
        "60": 180
    };

    if (!packagePrices[package_type]) {
        return res.status(400).json({ error: 'Paquete no válido.' });
    }

    try {
        // Check if the user exists in the `members` table
        const [memberCheck] = await db.query('SELECT id FROM members WHERE id = ?', [memberId]);
        
        // If user is not found in `members`, insert them
        if (memberCheck.length === 0) {
            await db.query('INSERT INTO members (id, membership_paid) VALUES (?, ?)', [memberId, true]);
        }

        // Set expiration date based on package duration
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + parseInt(package_type));

        // Insert the class package
        await db.query(
            'INSERT INTO class_packages (member_id, package_type, remaining_classes, purchase_date, expiration_date) VALUES (?, ?, ?, NOW(), ?)',
            [memberId, package_type, package_type, expirationDate]
        );

        // Register transaction
        await db.query(
            'INSERT INTO transactions (member_id, amount, transaction_type, package_id, transaction_date) VALUES (?, ?, "package", LAST_INSERT_ID(), NOW())',
            [memberId, packagePrices[package_type]]
        );

        res.json({ message: 'Compra realizada con éxito!' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/my-packages', authenticate, authorize(['member']), async (req, res) => {
    const memberId = req.user.id;

    try {
        const [packages] = await db.query(
            'SELECT package_type, remaining_classes, purchase_date, expiration_date FROM class_packages WHERE member_id = ? ORDER BY expiration_date DESC',
            [memberId]
        );

        res.json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
