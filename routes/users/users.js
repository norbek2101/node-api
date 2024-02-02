const express = require('express');
const pool = require('../db'); 

const router = express.Router();

/**
 * @openapi
 * /api/v1/user:
 *   post:
 *     summary: Create user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               purchase_category_id:
 *                 type: integer
 *               purchase_frequency_id:
 *                 type: integer
 *               income:
 *                 type: integer
 *               financial_situation:
 *                 type: string
 *               family_situation:
 *                 type: string
 *              
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               user:
 *                 id: 1
 *                 name: "userName"
 *                 age: 25
 *                 gender: "Male"
 *                 purchase_category_id: 1
 *                 purchase_frequency_id: 2
 *                 income: 3400000
 *                 financial_situation: "Rich"
 *                 family_situation: "Single"
 */
router.post('/user', async (req, res) => {
    const { name, age, gender, purchase_category_id, purchase_frequency_id, income, financial_situation, family_situation } = req.body;
  
    try {
      const conn = await pool.getConnection();
  
      // Create user
      const userResult = await conn.query('INSERT INTO users (name, age, gender, ', + 
                                          'purchase_category_id, purchase_frequency_id, income, financial_situation, family_situation) ' +  
                                          'VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
      [name, age, gender, purchase_category_id,  
      purchase_frequency_id, income, financial_situation, family_situation]);
      
  
      // Retrieve the generated user ID
      const userId = userResult.insertId.toString();  // Convert to string for BigInt serialization
  
      conn.release();
  
      // If user creation was successful, return the created user
      if (userResult.affectedRows === 1) {
        const createdUser = { id: Number(userId), name, age, gender, 
          purchase_category_id, purchase_frequency_id, income, financial_situation, family_situation };

        res.json({ user: createdUser });
      } else {
        res.status(500).json({ error: 'Failed to create user.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

/**
 * @openapi
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: userName1
 *                 age: 25
 *                 gender: Male
 *                 purchase_category_id: 1
 *                 purchase_frequency_id: 1
 *                 income: 3200000
 *                 financial_situation: Rich
 *                 family_situation: "Single"
 *               - id: 2
 *                 name: userName2
 *                 age: 30
 *                 gender: Female
 *                 purchase_category_id: 1
 *                 purchase_frequency_id: 2
 *                 income: 1500000
 *                 financial_situation: Rich
 *                 family_situation: "Married"
 */
router.get('/users', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM users');
    conn.release();

    // Return the list of users
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: userName
 *               age: 25
 *               gender: Male
 *               purchase_category_id: 1
 *               purchase_frequency_id: 2
 *               income: 5700000
 *               financial_situation: Rich
 *               family_situation: "Single"
 */
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM users WHERE id = ?', [userId]);
    conn.release();

    // Check if the user with the specified ID exists
    if (result.length === 0) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Return the user information
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/users/byGender/{gender}:
 *   get:
 *     summary: Get users by gender
 *     parameters:
 *       - in: path
 *         name: gender
 *         required: true
 *         schema:
 *           type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: userName1
 *                 age: 25
 *                 gender: Male
 *                 purchase_category_id: 1
 *                 purchase_frequency_id: 2
 *                 income: 1250000
 *                 financial_situation: Rich
 *               - id: 2
 *                 name: userName2
 *                 age: 30
 *                 gender: Male
 *                 income: 4100000
 *                 financial_situation: Rich
 */       
router.get('/users/byGender/:gender', async (req, res) => {
  const gender = req.params.gender;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM user WHERE gender = ?', [gender]);
    conn.release();

    // Return the list of users with the specified gender
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/user/{id}:
 *   put:
 *     summary: Update user by ID
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
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *               purchase_category_id:
 *                 type: integer
 *               purchase_frequency_id:
 *                 type: integer
 *               income:
 *                 type: integer
 *               financial_situation:
 *                 type: string
 *               family_situation: 
 *                 type: string
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: updatedUserName
 *               age: 30
 *               gender: Female
 *               purchase_category_id: 1
 *               purchase_frequency_id: 2
 *               income: 3500000
 *               financial_situation: Rich
 */
router.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const updateParams = {};

  // Extract only provided parameters from the request body
  const { name, age, gender, purchase_category_id,
      purchase_frequency_id, income, financial_situation, family_situation } = req.body;
  
  // Populate updateParams object with provided parameters
  if (name !== undefined) updateParams.name = name;
  if (age !== undefined) updateParams.age = age;
  if (gender !== undefined) updateParams.gender = gender;
  if (purchase_category_id !== undefined) updateParams.purchase_category_id = purchase_category_id;
  if (purchase_frequency_id !== undefined) updateParams.purchase_frequency_id = purchase_frequency_id;
  if (income !== undefined) updateParams.income = income;
  if (financial_situation !== undefined) updateParams.financial_situation = financial_situation;
  if (family_situation !== undefined) updateParams.family_situation = family_situation;

  try {
      const conn = await pool.getConnection();
      
      // Check if the user exists
      const userCheckResult = await conn.query('SELECT * FROM users WHERE user_id = ?', [userId]);
  
      if (userCheckResult.length === 0) {
          res.status(404).json({ error: 'User not found.' });
          return;
      }
  
      // Prepare the SET clause dynamically based on the provided parameters
      const setClause = Object.keys(updateParams).map(key => `${key} = ?`).join(', ');

      // Update user information
      const updateUserResult = await conn.query(
          `UPDATE users SET ${setClause} WHERE user_id = ?`,
          [...Object.values(updateParams), userId]
      );
      
      conn.release();
  
      // If the update was successful, return the updated user
      if (updateUserResult.affectedRows === 1) {
          const updatedUser = { id: Number(userId), ...updateParams };
          res.json(updatedUser);
      } else {
          res.status(500).json({ error: 'Failed to update user.' });
      }
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/user/{id}:
 *   delete:
 *     summary: Delete user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 */
router.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const conn = await pool.getConnection();

    // Check if the user exists
    const userCheckResult = await conn.query('SELECT * FROM users WHERE user_id = ?', [userId]);

    if (userCheckResult.length === 0) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Delete the user
    const deleteUserResult = await conn.query('DELETE FROM users WHERE user_id = ?', [userId]);
    conn.release();

    // If the deletion was successful, return a success message
    if (deleteUserResult.affectedRows === 1) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete user.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;