const express = require('express');
const pool = require('../db');

const router = express.Router();

/**
 * @openapi
 * /api/v1/family-situation:
 *   post:
 *     summary: Create family situation
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - FamilySituation
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/family-situation', async (req, res) => {
  const { name } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO family_situation (name) VALUES (?)', [name]);
    conn.release();

    // If the insertion was successful, return the inserted family situation
    if (result.affectedRows === 1) {
      const insertedFamilySituation = { id: Number(result.insertId), name };
      res.json(insertedFamilySituation);
    } else {
      res.status(500).json({ error: 'Failed to insert family situation into the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/family-situations:
 *   get:
 *     summary: Get all family situations
 *     tags:
 *       - FamilySituation
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/family-situations', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM family_situation');
    conn.release();

    // Return the list of family situations
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/family-situation/{id}:
 *   get:
 *     summary: Get family situation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - FamilySituation
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: familySituationName
 */
router.get('/family-situation/:id', async (req, res) => {
  const familySituationId = req.params.id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM family_situation WHERE id = ?', [familySituationId]);
    conn.release();

    // If family situation found, return it; otherwise, return a 404 error
    if (result[0]) {
      res.json(result[0]);
    } else {
      res.status(404).json({ error: 'Family situation not found.' });
    }
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/family-situations/{id}:
 *   put:
 *     summary: Update family situation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - FamilySituation
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: familySituationName
 */
router.put('/family-situations/:id', async (req, res) => {
  const familySituationId = req.params.id;
  const { name } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('UPDATE family-situation SET name = ? WHERE id = ?', [name, familySituationId]);
    conn.release();

    // If the update was successful, return the updated family situation
    if (result.affectedRows === 1) {
      const updatedFamilySituation = { id: Number(familySituationId), name };
      res.json(updatedFamilySituation);
    } else {
      res.status(404).json({ error: 'Family situation not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/family_situations/{id}:
 *   delete:
 *     summary: Delete family situation by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - FamilySituation
 *     responses:
 *       200:
 *         description: Successful response
 */
router.delete('/family-situations/:id', async (req, res) => {
  const familySituationId = req.params.id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM family_situation WHERE id = ?', [familySituationId]);
    conn.release();

    // If the deletion was successful, return a success message
    if (result.affectedRows === 1) {
      res.json({ message: 'Family situation deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Family situation not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
