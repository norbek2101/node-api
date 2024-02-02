const express = require('express');
const pool = require('../db'); 

const router = express.Router();

/**
 * @openapi
 * /api/v1/purchase-category:
 *   post:
 *     summary: Create purchase category
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - Purchase categories
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/purchase-category', async (req, res) => {
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO purchase_category (name) VALUES (?)', [name]);
      conn.release();
  
      // If the insertion was successful, return the inserted purchase category
      if (result.affectedRows === 1) {
        const insertedCategory = { id: Number(result.insertId), name };
        res.json(insertedCategory);
      } else {
        res.status(500).json({ error: 'Failed to insert purchase category into the database.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/purchase-categories:
   *   get:
   *     summary: Get all purchase categories
   *     tags:
   *       - Purchase categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: purchaseCategoryName
   */
  router.get('/purchase-categories', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM purchase_category');
      conn.release();
  
      // Return the list of purchase-categories
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  /**
   * @openapi
   * /api/v1/purchase-category/{id}:
   *   get:
   *     summary: Get purchase category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Purchase categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: purchaseCategoryName
   */
  router.get('/purchase-category/:id', async (req, res) => {
    const purchaseCategoryId = req.params.id;
    
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM purchase-category WHERE id = ?', [purchaseCategoryId]);
      conn.release();
  
      // If category found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'Purchase category not found.' });
      }
    } catch (err) {
      console.error('Error:', err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/purchase-category/{id}:
   *   put:
   *     summary: Update purchase category by ID
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
   *       - Purchase categories
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: purchaseCategoryName
   */
  router.put('/purchase-catgory/:id', async (req, res) => {
    const purchaseCategoryId = req.params.id;
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('UPDATE purchase_category SET name = ? WHERE id = ?', [name, purchaseCategoryId]);
      conn.release();
  
      // If the update was successful, return the updated purchase category
      if (result.affectedRows === 1) {
        const updatedCategory = { id: Number(purchaseCategoryId), name };
        res.json(updatedCategory);
      } else {
        res.status(404).json({ error: 'Purchase category not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  
  /**
   * @openapi
   * /api/v1/purchase-category/{id}:
   *   delete:
   *     summary: Delete purchase category by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Purchase categories
   *     responses:
   *       200:
   *         description: Successful response
   */
  router.delete('/purchase-category/:id', async (req, res) => {
    const purchaseCategoryId = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM purchase_category WHERE id = ?', [purchaseCategoryId]);
      conn.release();
  
      // If the deletion was successful, return a success message
      if (result.affectedRows === 1) {
        res.json({ message: 'Purchase category deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Purchase category not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});




/**
 * @openapi
 * /api/v1/purchase-frequency:
 *   post:
 *     summary: Create purchase frequency
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               purchase_category_id:
 *                 type: integer
 *     tags:
 *       - Purchase frequencies
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/purchase-frequency', async (req, res) => {
  const { name, purchase_category_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO purchase_frequency (name, purchase_category_id) VALUES (?, ?)', [name, purchase_category_id]);
    conn.release();

    // If the insertion was successful, return the inserted purchase_frequency
    if (result.affectedRows === 1) {
      const insertedParam = { id: Number(result.insertId), name, purchase_category_id };
      res.json(insertedParam);
    } else {
      res.status(500).json({ error: 'Failed to insert purchase_frequency into the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
   * @openapi
   * /api/v1/purchase-frequencies:
   *   get:
   *     summary: Get all purchase frequencies
   *     tags:
   *       - Purchase frequencies
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *              application/json:
   *                example:
   *                  id: 1
   *                  name: purchaseFrequencyName
   */
router.get('/purchase-frequencies', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM purchase_frequency');
    conn.release();

    // Return the list of purchase-frequencies
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
   * @openapi
   * /api/v1/purchase-frequencies/{id}:
   *   get:
   *     summary: Get purchase frequencies by purchase category ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Purchase frequencies
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: purchaseFrequncyName
   * 
   */
router.get('/purchase-frequencies/:id', async (req, res) => {
  const purchase_category_id = req.params.id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM purchase_frequency WHERE purchase_category_id = ?', [purchase_category_id]);
    conn.release();

    // If purchase_frequency found, return it; otherwise, return a 404 error
    if (result[0]) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'purchase_frequency not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



  /**
   * @openapi
   * /api/v1/purchase-frequency/{id}:
   *   get:
   *     summary: Get purchase frequency by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Purchase frequencies
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: purchaseFrequencyName
   * 
   */
  router.get('/purchase-frequency/:id', async (req, res) => {
    const purchase_frequency_id = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM purchase_frequency WHERE id = ?', [purchase_frequency_id]);
      conn.release();
  
      // If purchase_frequency found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'purchase_frequency not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});


/**
 * @openapi
 * /api/v1/purchase-frequency/{id}:
 *   put:
 *     summary: Update purchase frequency by ID
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
 *               purchase_category_id:
 *                 type: integer
 *     tags:
 *       - Purchase frequencies
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: purchaseFrequencyName
 */
router.put('/purchase-frequency/:id', async (req, res) => {
  const purchase_frequency_id = req.params.id;
  const { name, purchase_category_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('UPDATE purchase_frequency SET name = ?,  purchase_category_id = ? WHERE id = ?', [name, purchase_category_id, purchase_frequency_id]);
    conn.release();

    // If the update was successful, return the updated purchase_frequency
    if (result.affectedRows === 1) {
      const updatedParam = { id: Number(purchase_frequency_id), name, purchase_category_id };
      res.json(updatedParam);
    } else {
      res.status(404).json({ error: 'purchase_frequency not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
* @openapi
* /api/v1/purchase-frequency/{id}:
*   delete:
*     summary: Delete purchase frequency by ID
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*     tags:
*       - Purchase frequencies
*     responses:
*       200:
*         description: Successful response
*/
router.delete('/purchase-frequency/:id', async (req, res) => {
  const purchase_frequency_id = req.params.id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('DELETE FROM purchase_frequency WHERE id = ?', [purchase_frequency_id]);
    conn.release();

    // If the deletion was successful, return a success message
    if (result.affectedRows === 1) {
      res.json({ message: 'Purchase frequency deleted successfully.' });
    } else {
      res.status(404).json({ error: 'Purchase frequency not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

  
module.exports = router;
