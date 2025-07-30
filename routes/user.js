const express = require('express');
const router = express.Router();

const connection = require('../db');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
  const { username, email, password, name, surname } = req.body;

  if (!username || !email || !password || !name || !surname) {
    return res.status(400).json({ message: 'Required field not provided' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (username, password, email, permissions, name, surname)
      VALUES (?, ?, ?, 5, ?, ?)
    `;

    connection.query(query, [username, hashedPassword, email, name, surname], (err, result) => {
      if (err) {
        console.error('MySQL error:', err);
        return res.status(500).json({ message: 'Registration failed'});
      }
      return res.status(201).json({ message: 'User registered'});
    });
  } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error'});
  }
});


router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'No username or password'});
  }

  const findUserQuery = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  connection.query(findUserQuery, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error'});
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'Incorrect username or password'});
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error'});
      }
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect username or password'});
      }

      const updateLoginQuery = 'UPDATE users SET last_login = NOW() WHERE username = ?';
      connection.query(updateLoginQuery, [username], (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Login update error'});
        }

        res.send('Logged in successfully');
      });
    });
  });
});

router.post('/delete', (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).send('Missing username');
  }

  const deleteUserQuery = 'DELETE FROM users WHERE username = ?';
  connection.query(deleteUserQuery, [username], (err, result) => {
    if (err) {
      console.error('Błąd MySQL:', err);
      return res.status(500).send('User deletion error');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }

    res.send('User deleted successfully');
  });
});

module.exports = router;
