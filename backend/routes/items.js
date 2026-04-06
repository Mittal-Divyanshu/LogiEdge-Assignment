const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, description, price, unit, status } = req.body;
  if (!name || !price) return res.status(400).json({ error: 'Name and price are required' });
  try {
    const result = await pool.query(
      `INSERT INTO items (name, description, price, unit, status)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description || null, price, unit || 'pcs', status || 'active']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;