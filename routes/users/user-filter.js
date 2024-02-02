const express = require('express');
const pool = require('../db'); 

const router = express.Router();


/**
 * @openapi
 * /api/v1/searchUsers:
 *   post:
 *     summary: Search users based on parameters and get total user count
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country_id:
 *                 type: integer
 *               region_id:
 *                 type: integer
 *               district_id:
 *                 type: integer
 *               city_id:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 default: "Both"
 *               age_min:
 *                 type: integer
 *               age_max:
 *                 type: integer
 *               purchase_category_id:
 *                 type: integer
 *               purchase_frequency_id:
 *                 type: integer
 *               income_id:
 *                 type: integer
 *               financial_situation:
 *                 type: string
 *                 default: Any
 *               family_situation_id:
 *                 type: integer
 *               
 *     tags:
 *       - User Filter
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 */
router.post('/searchUsers', async (req, res) => {
  const {
    country_id,
    region_id,
    district_id,
    city_id,
    gender,
    age_min,
    age_max,
    purchase_category_id,
    purchase_frequency_id,
    income_id,
    financial_situation,
    family_situation_id
  } = req.body;

  try {
    // Acquire a connection from the pool
    const connection = await pool.getConnection();

    // Build the WHERE clause based on the provided parameters
    const whereConditions = [];
    const queryParams = [];
    const extraConditions = [];


    if (country_id) {
      whereConditions.push('place.country_id = ?');
      queryParams.push(country_id);
    }

    if (region_id) {
      whereConditions.push('place.region_id = ?');
      queryParams.push(region_id);
    }

    if (district_id) {
      whereConditions.push('place.district_id = ?');
      queryParams.push(district_id);
    }

    if (city_id) {
      whereConditions.push('place.city_id = ?');
      queryParams.push(city_id);
    }

    // Gender parameter
    // if (gender && gender !== 'Both') {
    if (gender !== 'Both') {
      // If only gender is selected, add to extraConditions
      if (whereConditions.length === 0) {
        extraConditions.push('users.gender = ?');
        queryParams.push(gender);
      } else {
        whereConditions.push('users.gender = ?');
        queryParams.push(gender);
      }
    }

    // Age range parameter
    // if (age_min !== undefined && age_max !== undefined) {
    if (age_min !== 0 && age_max !== 0) {
      // If only age range is selected, add to extraConditions
      if (whereConditions.length === 0) {
        extraConditions.push('(users.age >= ? AND users.age <= ?)');
        queryParams.push(age_min, age_max);
      } else {
        whereConditions.push('(users.age >= ? AND users.age <= ?)');
        queryParams.push(age_min, age_max);
      }
    }

    //Purchase category
    if (purchase_category_id) {
      whereConditions.push('users.purchase_category_id = ?')
      queryParams.push(purchase_category_id)

      //Purchase frequency
      if (purchase_frequency_id) {
        whereConditions.push('users.purchase_frequency_id = ?')
        queryParams.push(purchase_frequency_id)
      }
    } 

    // Income parameter
    if (income_id) {
      const [query_income] = await connection.query('SELECT * FROM income WHERE income_id = ?', [income_id]);
      
      // If only income is selected, add to extraConditions
      if (whereConditions.length === 0) {
        if (query_income.name === "1 000 000 - 2 000 000 сум") {
          extraConditions.push('(users.income >= ? AND users.income <= ?)');
          queryParams.push(1000000, 2000000);
        } else if (query_income.name === "2 100 000 - 4 000 000 сум") {
          extraConditions.push('(users.income >= ? AND users.income <= ?)');
          queryParams.push(2100000, 4000000);
        } else if (query_income.name === "4 100 000 - 6 000 000 сум") {
          extraConditions.push('(users.income >= 4100000 AND users.income <= ?)');
          queryParams.push(4100000, 6000000);
        }
      } else {
        if (query_income.name === "1 000 000 - 2 000 000 сум") {
          whereConditions.push('(users.income >= ? AND users.income <= ?)');
          queryParams.push(1000000, 2000000);
        } else if (query_income.name === "2 100 000 - 4 000 000 сум") {
          whereConditions.push('(users.income >= ? AND users.income <= ?)');
          queryParams.push(2100000, 4000000);
        } else if (query_income.name === "4 100 000 - 6 000 000 сум") {
          whereConditions.push('(users.income >= ? AND users.income <= ?)');
          queryParams.push(4100000, 6000000);
        }
      }
    }
    
    // Financial situation
    if (financial_situation !== 'Any') {
      // If only financial_situation is selected, add to extraConditions
      if (whereConditions.length === 0) {
        extraConditions.push('users.financial_situation = ?');
        queryParams.push(financial_situation);
      } else {
        whereConditions.push('users.financial_situation = ?');
        queryParams.push(financial_situation);
      }
    }

    // Family 
    if (family_situation_id) {
      const [fsQuery] = await connection.query('SELECT * FROM family_situation WHERE id = ?', [family_situation_id]);
      // If only family_situation_id is selected, add to extraConditions
      if (whereConditions.length === 0) {
        if (fsQuery.name === "Single") {
          extraConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Married") {
          extraConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Divorced") {
          extraConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Widow") {
          extraConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        }
      } else {
        if (fsQuery.name === "Single") {
          whereConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Married") {
          whereConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Divorced") {
          whereConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        } else if (fsQuery.name === "Widow") {
          whereConditions.push('(users.family_situation = ?)');
          queryParams.push(fsQuery.name);
        }
      }
    }
    
    // Construct the SQL query
    let sqlQuery = `
    SELECT COUNT(*) as totalUsers
    FROM users
    `;
    
    // Check if there are any conditions
    if (whereConditions.length > 0) {
      // If conditions exist, add the JOIN and WHERE clause
      sqlQuery += ` 
      JOIN place ON users.user_id = place.user_id
      WHERE ${whereConditions.join(' AND ')}
      `;
    } else if (extraConditions.length > 0) {
      // If only gender and/or age range is selected, add the conditions
      sqlQuery += `
      WHERE ${extraConditions.join(' AND ')}
      `;
    }
    
    // Execute the SQL query to get total user count
    const [results] = await connection.query(sqlQuery, queryParams);

    // Get total user count
    const totalUsers = Number(results.totalUsers);

    // Release the connection back to the pool
    connection.release();

    // Send the results as JSON
    res.json({ totalUsers });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;