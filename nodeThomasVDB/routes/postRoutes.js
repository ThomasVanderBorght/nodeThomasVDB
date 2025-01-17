const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, (req, res) => {
    const { limit = 10, offset = 0, sort_by = 'id', order = 'ASC' } = req.query;

    const validSortColumns = ['id', 'title', 'category'];
    const validOrder = ['ASC', 'DESC'];

    if (!validSortColumns.includes(sort_by) || !validOrder.includes(order.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid sorting parameters.' });
    }
    db.query(
        `SELECT * FROM posts ORDER BY ${sort_by} ${order} LIMIT ? OFFSET ?`,
        [Number(limit), Number(offset)],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json(results);
        }
    );

});

router.get('/:id',authenticateToken, (req, res) => {
    db.query('SELECT * FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'Post not found' });
        res.json(results[0]);
    });
});

router.post('/create',authenticateToken, (req, res) => {
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

router.put('/update/:id', authenticateToken,(req, res) => {
    const { title, content, category } = req.body;
    db.query('UPDATE posts SET title=?, content=?, category=? WHERE id=?',
        [title, content, category, req.params.id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Post updated successfully' });
        }
    );
});

router.delete('/delete/:id', authenticateToken, (req, res) => {
    db.query('DELETE FROM posts WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Post deleted successfully' });
    });
});

router.get('/search/category', authenticateToken, (req, res) => {
    const { category } = req.query;

    if (!category) {
        return res.status(400).json({ message: 'Category is required.' });
    }

    const query = 'SELECT * FROM posts WHERE LOWER(category) LIKE ?';
    const params = [`%${category.toLowerCase()}%`];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No posts found for the given category.' });
        }

        res.json(results);
    });
});

router.get('/search/title',  authenticateToken, (req, res) => {
    const { title } = req.query;

    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }

    const query = 'SELECT * FROM posts WHERE LOWER(title) LIKE ?';
    const params = [`%${title.toLowerCase()}%`];

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'No posts found for the given title.' });
        res.json(results);
    });
});

router.get('/search/category/title',  authenticateToken, (req, res) => {
    const { category, title } = req.query;

    if (!category || !title) {
        return res.status(400).json({ message: 'Both category and title are required.' });
    }

    const query = 'SELECT * FROM posts WHERE LOWER(category) LIKE ? AND LOWER(title) LIKE ?';
    const params = [`%${category.toLowerCase()}%`, `%${title.toLowerCase()}%`];

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) return res.status(404).json({ message: 'No posts found for the given category and title.' });
        res.json(results);
    });
});

module.exports = router;

module.exports = router;
