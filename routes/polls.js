const express = require('express');
const router = express.Router();

const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/createPoll', (req, res) => {
    const { name, description, is_active, owner_id, company_id } = req.body;

    if (!name || !description || is_active === undefined || !owner_id || !company_id) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
        INSERT INTO polls (name, description, is_active, owner_id, company_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [name, description, is_active, owner_id, company_id], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Poll creation failed' });
        }

        return res.status(201).json({ message: 'Poll created successfully', pollId: result.insertId });
    });
});


router.post('/deletePoll', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Poll ID is required' });
    }

    const query = 'DELETE FROM polls WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Poll deletion failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Poll not found' });
        }

        return res.status(200).json({ message: 'Poll deleted successfully' });
    });
});


module.exports = router;
