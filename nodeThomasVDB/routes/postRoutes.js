const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all posts with pagination
router.get('/', (req, res) => {
    const { limit = 10, offset = 0 } = req.query;
    db.query('SELECT * FROM posts LIMIT ? OFFSET ?', [Number(limit), Number(offset)], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Get post by ID
router.get('/:id', (req, res) => {
    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json(results[0]);
    });
});

// Create a new post
router.post('/', (req, res) => {
    const { title, content, category, author_id } = req.body;
    if (!title || !content || !category || !author_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    db.query('INSERT INTO posts (title, content, category, author_id) VALUES (?, ?, ?, ?)', 
        [title, content, category, author_id], 
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: results.insertId, title, content, category, author_id });
        }
    );
});

// Update post
router.put('/:id', (req, res) => {
    const { title, content, category } = req.body;
    db.query('UPDATE posts SET title=?, content=?, category=? WHERE id=?',
        [title, content, category, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Post updated successfully' });
        }
    );
});

// Delete post
router.delete('/:id', (req, res) => {
    db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Post deleted successfully' });
    });
});

// Search posts by category
router.get('/search/:category', (req, res) => {
    db.query('SELECT * FROM posts WHERE category LIKE ?', [`%${req.params.category}%`], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

module.exports = router;
