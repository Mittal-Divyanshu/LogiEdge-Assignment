const express = require('express');
const router = express.Router();
const pool = require('../db');

function generateInvoiceId() {
  const digits = Math.floor(100000 + Math.random() * 900000).toString();
  return 'INVC' + digits;
}

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name AS customer_name, c.email AS customer_email
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/customer/:customerId', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.*, c.name AS customer_name
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.customer_id = $1
      ORDER BY i.created_at DESC
    `, [req.params.customerId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:invoiceId', async (req, res) => {
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.name AS customer_name, c.email AS customer_email,
             c.phone AS customer_phone, c.address AS customer_address,
             c.gstin, c.is_gst_registered
      FROM invoices i
      JOIN customers c ON i.customer_id = c.id
      WHERE i.invoice_id = $1
    `, [req.params.invoiceId]);

    if (invoiceResult.rows.length === 0)
      return res.status(404).json({ error: 'Invoice not found' });

    const itemsResult = await pool.query(
      `SELECT * FROM invoice_items WHERE invoice_id = $1`,
      [invoiceResult.rows[0].id]
    );

    res.json({ ...invoiceResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { customer_id, items } = req.body;
  if (!customer_id || !items || items.length === 0)
    return res.status(400).json({ error: 'Customer and at least one item required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const custResult = await client.query('SELECT * FROM customers WHERE id = $1', [customer_id]);
    if (custResult.rows.length === 0) throw new Error('Customer not found');
    const customer = custResult.rows[0];

    let subtotal = 0;
    for (const item of items) {
      subtotal += item.price * item.quantity;
    }

    const isGstApplied = !customer.is_gst_registered;
    const gstAmount = isGstApplied ? parseFloat((subtotal * 0.18).toFixed(2)) : 0;
    const total = parseFloat((subtotal + gstAmount).toFixed(2));

    let invoiceId;
    let isUnique = false;
    while (!isUnique) {
      invoiceId = generateInvoiceId();
      const check = await client.query('SELECT id FROM invoices WHERE invoice_id = $1', [invoiceId]);
      if (check.rows.length === 0) isUnique = true;
    }

    const invoiceResult = await client.query(
      `INSERT INTO invoices (invoice_id, customer_id, subtotal, gst_amount, total, is_gst_applied)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [invoiceId, customer_id, subtotal, gstAmount, total, isGstApplied]
    );
    const newInvoice = invoiceResult.rows[0];

    for (const item of items) {
      const amount = item.price * item.quantity;
      await client.query(
        `INSERT INTO invoice_items (invoice_id, item_id, item_name, quantity, price, amount)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newInvoice.id, item.id, item.name, item.quantity, item.price, amount]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ ...newInvoice, items });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;