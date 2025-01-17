const express = require('express');
const router = express.Router();
const db = require('../db');
const Joi = require('joi');
const authenticateToken = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

router.get('/:id', authenticateToken, (req, res) => {
    db.query('SELECT * FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
});

const userSchema = Joi.object({
    firstName: Joi.string().pattern(/^[A-Za-z]+$/).required().messages({
        'string.pattern.base': 'First name must only contain letters.',
        'any.required': 'First name is required.'
    }),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).required(),
    phone: Joi.string().pattern(/^\+32 \d{3} \d{2} \d{2} \d{2}$/).required().messages({
        'string.pattern.base': 'Phone number must match format: +32 444 44 44 44.'
    }),
    password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
        'string.pattern.base':
            'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.',
        'string.min': 'Password must be at least 8 characters long.',
        'any.required': 'Password is required.'
    })
});

router.post('/create', async (req, res) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const { firstName, lastName, email, age, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        'INSERT INTO users (firstName, lastName, email, age, phone, password) VALUES (?, ?, ?, ?, ?, ?)',
        [firstName, lastName, email, age, phone, hashedPassword],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, firstName, lastName, email, age, phone });
        }
    );
});

router.put('/update/:id', authenticateToken, (req, res) => {
    const { firstName, lastName, email, age } = req.body;
    db.query('UPDATE users SET firstName=?, lastName=?, email=?, age=? WHERE id=?',
        [firstName, lastName, email, age, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'User updated successfully' });
        }
    );
});

router.delete('/delete/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'User deleted successfully' });
    });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.', error: err });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, firstName: user.firstName },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token });
    });
});

module.exports = router;
