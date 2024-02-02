const express = require('express');
const pool = require('../db'); 

const router = express.Router();

/**
 * @openapi
 * /api/v1/category:
 *   post:
 *     summary: Create category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/category', async (req, res) => {
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO categories (name) VALUES (?)', [name]);
      conn.release();
  
      // If the insertion was successful, return the inserted category
      if (result.affectedRows === 1) {
        const insertedCategory = { id: Number(result.insertId), name };
        res.json(insertedCategory);
      } else {
        res.status(500).json({ error: 'Failed to insert category into the database.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/categories:
   *   get:
   *     summary: Get all categories
   *     tags:
   *       - Categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: categoryName
   */
  router.get('/categories', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM categories');
      conn.release();
  
      // Return the list of categories
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  /**
   * @openapi
   * /api/v1/category/{id}:
   *   get:
   *     summary: Get category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: categoryName
   */
  router.get('/category/:id', async (req, res) => {
    const categoryId = req.params.id;
    
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM categories WHERE id = ?', [categoryId]);
      conn.release();
  
      // If category found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Category not found.' });
      }
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/categories/{id}:
   *   put:
   *     summary: Update category by ID
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
   *       - Categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: categoryName
   */
  router.put('/categories/:id', async (req, res) => {
    const categoryId = req.params.id;
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('UPDATE categories SET name = ? WHERE id = ?', [name, categoryId]);
      conn.release();
  
      // If the update was successful, return the updated category
      if (result.affectedRows === 1) {
        const updatedCategory = { id: Number(categoryId), name };
        res.json(updatedCategory);
      } else {
        res.status(404).json({ error: 'Category not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  /**
   * @openapi
   * /api/v1/categories/{id}:
   *   delete:
   *     summary: Delete category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Categories
   *     responses:
   *       200:
   *         description: Successful response
   */
  router.delete('/categories/:id', async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM categories WHERE id = ?', [categoryId]);
      conn.release();
  
      // If the deletion was successful, return a success message
      if (result.affectedRows === 1) {
        res.json({ message: 'Category deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Category not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
module.exports = router;
