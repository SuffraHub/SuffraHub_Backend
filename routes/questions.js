const express = require('express');
const router = express.Router();

const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/createQuestion', (req, res) => {
    const { question, company_id, description, hidden, user_id } = req.body;

    if (!question || !company_id || !description || hidden === undefined || !user_id) {
        return res.status(400).json({ message: 'Required field not provided' });
    }

    const query = `
        INSERT INTO questions (question, company_id, description, hidden, user_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(query, [question, company_id, description, hidden, user_id], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Question creation failed' });
        }

        return res.status(201).json({ message: 'Question created' });
    });
});



router.post('/deleteQuestion', (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Question ID is required' });
    }

    const query = 'DELETE FROM questions WHERE id = ?';

    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error('MySQL error:', err);
            return res.status(500).json({ message: 'Question deletion failed' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }

        return res.status(200).json({ message: 'Question deleted successfully' });
    });
});


module.exports = router;
