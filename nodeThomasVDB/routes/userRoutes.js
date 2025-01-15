const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all users
router.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get user by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
});

// Create new user
router.post('/', (req, res) => {
    const { firstName, lastName, email, age } = req.body;
    if (!firstName || !lastName || !email || !age) {
        return res.status(400).json({ message: "All fields are required" });
    }
    
    db.query('INSERT INTO users (firstName, lastName, email, age) VALUES (?, ?, ?, ?)', 
        [firstName, lastName, email, age], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, firstName, lastName, email, age });
        }
    );
});

// Update user
router.put('/:id', (req, res) => {
    const { firstName, lastName, email, age } = req.body;
    db.query('UPDATE users SET firstName=?, lastName=?, email=?, age=? WHERE id=?',
        [firstName, lastName, email, age, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'User updated successfully' });
        }
    );
});

// Delete user
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted successfully' });
    });
});

module.exports = router;
