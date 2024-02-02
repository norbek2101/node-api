const express = require('express');
const pool = require('../db'); 

const router = express.Router();

// API to create parameter
/**
 * @openapi
 * /api/v1/parameter:
 *   post:
 *     summary: Create parameter
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               ratio:
 *                 type: number
 *               category_id:
 *                 type: integer
 *     tags:
 *       - Parameters
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/parameter', async (req, res) => {
    const { name, ratio, category_id } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO params (name, ratio, category_id) VALUES (?, ?, ?)', [name, ratio, category_id]);
      conn.release();
  
      // If the insertion was successful, return the inserted parameter
      if (result.affectedRows === 1) {
        const insertedParam = { id: Number(result.insertId), name, ratio, category_id };
        res.json(insertedParam);
      } else {
        res.status(500).json({ error: 'Failed to insert parameter into the database.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  // API to get all parameters
  /**
   * @openapi
   * /api/v1/parameters:
   *   get:
   *     summary: Get all parameters
   *     tags:
   *       - Parameters
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *              application/json:
   *                example:
   *                  id: 1
   *                  name: parameterName
   *                  ratio: 3.2
   */
  router.get('/parameters', async (req, res) => {
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM params');
      conn.release();
  
      // Return the list of parameters
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


  // API to get parameters by category id
  /**
   * @openapi
   * /api/v1/parameters/{id}:
   *   get:
   *     summary: Get parameters by category ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Parameters
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: parameterName
   * 
   */
  router.get('/parameters/:id', async (req, res) => {
    const categoryId = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM params WHERE category_id = ?', [categoryId]);
      conn.release();
  
      // If parameter found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'parameter not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  
  
  // API to get parameter by id
  /**
   * @openapi
   * /api/v1/parameter/{id}:
   *   get:
   *     summary: Get parameter by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Parameters
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: parameterName
   * 
   */
  router.get('/parameter/:id', async (req, res) => {
    const paramId = req.params.id;
    // console.log("paramID:", paramId)
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('SELECT * FROM params WHERE id = ?', [paramId]);
      conn.release();
      // console.log("Result:", result[0][0])
  
      // If parameter found, return it; otherwise, return a 404 error
      if (result[0]) {
        res.json(result);
      } else {
        res.status(404).json({ error: 'parameter not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/parameter/{id}:
   *   put:
   *     summary: Update parameter by ID
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
   *               ratio:
   *                 type: number
   *               category_id:
   *                 type: integer
   *     tags:
   *       - Parameters
   *     responses:
   *       200:
   *         description: Successful response
   *         content:
   *           application/json:
   *             example:
   *               id: 1
   *               name: parameterName
   */
  router.put('/parameter/:id', async (req, res) => {
    const paramId = req.params.id;
    const { name, ratio, category_id } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('UPDATE params SET name = ?, ratio = ?, category_id = ? WHERE id = ?', [name, ratio, category_id, paramId]);
      conn.release();
  
      // If the update was successful, return the updated parameter
      if (result.affectedRows === 1) {
        const updatedParam = { id: Number(paramId), name, ratio, category_id };
        res.json(updatedParam);
      } else {
        res.status(404).json({ error: 'parameter not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  
  /**
   * @openapi
   * /api/v1/parameter/{id}:
   *   delete:
   *     summary: Delete parameter by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     tags:
   *       - Parameters
   *     responses:
   *       200:
   *         description: Successful response
   */
  router.delete('/parameter/:id', async (req, res) => {
    const paramId = req.params.id;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('DELETE FROM params WHERE id = ?', [paramId]);
      conn.release();
  
      // If the deletion was successful, return a success message
      if (result.affectedRows === 1) {
        res.json({ message: 'parameter deleted successfully.' });
      } else {
        res.status(404).json({ error: 'Param not found.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  

/**
 * @openapi
 * /api/v1/calculateCost:
 *   post:
 *     summary: Calculate cost based on parameters and user amount
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userAmount:
 *                 type: integer
 *               timeParamsId:
 *                 type: integer
 *               targetParamsId:
 *                 type: integer
 *               min_age:
 *                 type: integer
 *               max_age:
 *                 type: integer
 *     tags:
 *       - Cost Calculation
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cost:
 *                   type: number
 */ 
  router.post('/calculateCost', async (req, res) => {
    const { userAmount, timeParamsId,  targetParamsId, min_age, max_age} = req.body;
    // Acquire a connection from the pool
    const connection = await pool.getConnection();
  
    try {
      // Determine paramsName based on userAmount
      let paramsName;
  
      if (userAmount <= 200) {
        paramsName = 'до 200';
      } else if (userAmount <= 400) {
        paramsName = 'от 201 до 400';
      } else if (userAmount <= 600) {
        paramsName = 'от 401 до 600';
      } else if (userAmount <= 900) {
        paramsName = 'от 601 до 900';
      } else if (userAmount <= 1100) {
        paramsName = 'от 901 до 1100';
      } else if (userAmount <= 1300) {
        paramsName = 'от 1001 до 1300';
      } else if (userAmount <= 1600) {
        paramsName = 'от 1301 до 1600';
      } else if (userAmount <= 2000) {
        paramsName = 'от 1601 до 2000';
      } else if (userAmount <= 2500) {
        paramsName = 'от 2001 до 2500';
      } else if (userAmount <= 3000) {
        paramsName = 'от 2501 до 3000';
      } else if (userAmount <= 3500) {
        paramsName = 'от 3001 до 3500';
      } else if (userAmount <= 4000) {
        paramsName = 'от 3501 до 4000';
      } else {
        paramsName = 'свыше 4001';
      }
  
      let userGroupRatio;
      let timeGroupRatio;  
      let targetGroupRatio; 
      let ageGroupRatio = 0.00; // Default value, change as needed

      if (min_age && max_age) {
          // Additional conditions for specific cases
          if (min_age >= 18 && max_age <= 55) {
            let range = max_age - min_age;
            const ratio = 0.3;
        
            if (31 <= range && range <= 37) {
                ageGroupRatio = 0;
            } else if (21 <= range && range <= 30) {
                ageGroupRatio = 0.15;
            } else if (16 <= range && range <= 20) {
                ageGroupRatio = 0.3;
            } else if (11 <= range && range <= 15) {
                ageGroupRatio = 0.45;
            } else if (6 <= range && range <= 10) {
                ageGroupRatio = 0.75;
            } else if (range <= 5) {
                ageGroupRatio = 0.9;
            }
        } else if (min_age >= 56 && max_age <= 100) {
            let range = max_age - min_age;
            const ratio = 0.3;
        
            if (31 <= range && (range <= 37 || range <= 45)) {
                ageGroupRatio = ratio;
            } else if (21 <= range && range <= 30) {
                ageGroupRatio = 0.15 + ratio;
            } else if (16 <= range && range <= 20) {
                ageGroupRatio = 0.3 + ratio;
            } else if (11 <= range && range <= 15) {
                ageGroupRatio = 0.45 + ratio;
            } else if (6 <= range && range <= 10) {
                ageGroupRatio = 0.75 + ratio;
            } else if (range <= 5) {
                ageGroupRatio = 0.9 + ratio;
            }
        } else if (min_age >= 0 && max_age <= 18) {
            let range = max_age - min_age;
            const ratio = 0.3;
          
            if (16 <= range && range <= 20) {
                ageGroupRatio = 0.3 + ratio;
            } else if (11 <= range && range <= 15) {
                ageGroupRatio = 0.45 + ratio;
            } else if (6 <= range && range <= 10) {
                ageGroupRatio = 0.75 + ratio;
            } else if (range <= 5) {
                ageGroupRatio = 0.9 + ratio;
            } 
        } else if (min_age < 18 && max_age > 55) {
            ageGroupRatio = 0.6
        } else {
            ageGroupRatio = 0.3
        }
      }
      
      // Retrieve params information based on the determined paramsName
      if (paramsName) {
        const [paramsResult] = await connection.query('SELECT * FROM params WHERE name = ?', [paramsName]);
        if (!paramsResult || paramsResult.length === 0) {
          // Params not found
          res.status(400).json({ error: 'Params not found' });
          userGroupRatio = 0;
        }
        userGroupRatio  = paramsResult.ratio;
      }
  
      
      if (timeParamsId) {
        const [timeParams] = await connection.query('SELECT * FROM params WHERE id = ?', [timeParamsId]);
        if (!timeParams || timeParams.length === 0) {
          // Params not found
          res.status(400).json({ error: 'Time params not found' });
          timeGroupRatio;
        }
        timeGroupRatio  = timeParams.ratio;
  
      }
  
      if (targetParamsId) {
        const [targetParams] = await connection.query('SELECT * FROM params WHERE id = ?', [targetParamsId]);
        if (!targetParamsId || targetParamsId.length === 0) {
          // Params not found
          res.status(400).json({ error: 'Target params not found' });
          targetGroupRatio=0;
        }
        targetGroupRatio  = targetParams.ratio;
      }
      
      
      // Calculate cost based on the logic
      const constRatio = 3.2;
      let result = null;
      result = constRatio + result
      if (userGroupRatio !== undefined ) {
        result += Number(userGroupRatio)
      }
      if (timeGroupRatio !== undefined) {
        result += Number(timeGroupRatio)
      }
      if (targetGroupRatio !== undefined){
        result += Number(targetGroupRatio)
      }
      if (ageGroupRatio !== undefined) {
        result += Number(ageGroupRatio)
      }
      
      result = result * userAmount;
  
      // Release the connection back to the pool
      connection.release();
  
      // Send the results as JSON
      res.json({ result });
    } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;
  