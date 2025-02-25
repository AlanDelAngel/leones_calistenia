const express = require('express');
const db = require('../db');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Comprar un paquete de clases
router.post('/', authenticate, async (req, res) => {
    if (req.user.role !== 'member') return res.status(403).json({ error: 'Solo los miembros pueden comprar paquetes' });

    const { package_type } = req.body;
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    try {
        const [result] = await db.query('INSERT INTO class_packages (member_id, package_type, remaining_classes, purchase_date, expiration_date) VALUES (?, ?, ?, NOW(), ?)', 
        [req.user.id, package_type, package_type, expirationDate]);

        res.json({ success: true, package_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ver paquetes comprados por el usuario
router.get('/', authenticate, async (req, res) => {
    if (req.user.role !== 'member') return res.status(403).json({ error: 'Solo los miembros pueden ver paquetes' });

    try {
        const [packages] = await db.query('SELECT * FROM class_packages WHERE member_id = ?', [req.user.id]);
        res.json(packages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
