const express = require('express');
const router = express.Router();

const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/createTenant', (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).json({ message: 'Required field not provided' });
    }

    const query = `
        INSERT INTO tenants (name, description)
        VALUES (?, ?)
    `;

    connection.query(query, [name, description], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Tenant creation failed' });
        }

        return res.status(201).json({ message: 'Tenant created' });
    });
});


router.post('/deleteTenant', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Tenant ID is required' });
    }

    const query = 'DELETE FROM tenants WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Tenant deletion failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        return res.status(200).json({ message: 'Tenant deleted successfully' });
    });
});


module.exports = router;
