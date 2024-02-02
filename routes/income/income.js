const express = require('express');
const pool = require('../db'); 

const router = express.Router();

/**
 * @openapi
 * /api/v1/income:
 *   post:
 *     summary: Create income
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - Income
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/income', async (req, res) => {
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO income (name) VALUES (?)', [name]);
      conn.release();
  
      // If the insertion was successful, return the inserted income
      if (result.affectedRows === 1) {
        const insertedIncome = { id: Number(result.insertId), name };
        res.json(insertedIncome);
      } else {
        res.status(500).json({ error: 'Failed to insert income into the database.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


/**
   * @openapi
   * /api/v1/income:
   *   get:
   *     summary: Get all income
   *     tags:
   *       - Income
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: incomeName
   */
router.get('/income', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM income');
      conn.release();
  
      // Return the list of income
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


/**
   * @openapi
   * /api/v1/income/{id}:
   *   get:
   *     summary: Get income by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Income
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: incomeName
   */
router.get('/income/:id', async (req, res) => {
    const incomeId = req.params.id;
    
    
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM income WHERE id = ?', [incomeId]);
      conn.release();
  
  
      // If income found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Income not found.' });
      }
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: err.message });
    }
});


/**
   * @openapi
   * /api/v1/income/{id}:
   *   put:
   *     summary: Update income by ID
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
   *       - Income
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: incomeName
   */
router.put('/income/:id', async (req, res) => {
    const incomeId = req.params.id;
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('UPDATE income SET name = ? WHERE id = ?', [name, incomeId]);
      conn.release();
  
      // If the update was successful, return the updated income
      if (result.affectedRows === 1) {
        const updatedIncome = { id: Number(incomeId), name };
        res.json(updatedIncome);
      } else {
        res.status(404).json({ error: 'Income not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


 /**
   * @openapi
   * /api/v1/income/{id}:
   *   delete:
   *     summary: Delete income by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Income
   *     responses:
   *       200:
   *         description: Successful response
   */
 router.delete('/income/:id', async (req, res) => {
    const incomeID = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM income WHERE id = ?', [incomeID]);
      conn.release();
  
      // If the deletion was successful, return a success message
      if (result.affectedRows === 1) {
        res.json({ message: 'Income deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Income not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
module.exports = router;