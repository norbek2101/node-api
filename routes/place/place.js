const express = require('express');
const pool = require('../db'); 

const router = express.Router();

/**
 * @openapi
 * /api/v1/country:
 *   post:
 *     summary: Create country
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/country', async (req, res) => {
    const { name } = req.body;
  
    try {
      const conn = await pool.getConnection();
      const result = await conn.query('INSERT INTO country (name) VALUES (?)', [name]);
      conn.release();
  
      // If the insertion was successful, return the inserted country
      if (result.affectedRows === 1) {
        const insertedCountry = { id: Number(result.insertId), name };
        res.json(insertedCountry);
      } else {
        res.status(500).json({ error: 'Failed to insert country into the database.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


/**
 * @openapi
 * /api/v1/country:
 *   get:
 *     summary: Get all country
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: countryName
 */
router.get('/country', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM country');
    conn.release();

    // Return the list of categories
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @openapi
 * /api/v1/region:
 *   post:
 *     summary: Create region
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country_id:
 *                 type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 */
router.post('/region', async (req, res) => {
  const { name, country_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO region (name, country_id) VALUES (?, ?)', [name, country_id]);
    conn.release();

    // If the insertion was successful, return the inserted region
    if (result.affectedRows === 1) {
      const insertedRegion = { id: Number(result.insertId), name, country_id };
      res.json(insertedRegion);
    } else {
      res.status(500).json({ error: 'Failed to insert region into the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/region:
 *   get:
 *     summary: Get all regions
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: regionName
 *               country_id: 1
 */
router.get('/region', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM region');
    conn.release();

    // Return the list of regions
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/region/byCountry/{countryId}:
 *   get:
 *     summary: Get all regions for a specific country
 *     tags:
 *       - Places
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         description: ID of the country for which regions are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: regionName
 *               country_id: 1
 */
router.get('/region/byCountry/:countryId', async (req, res) => {
  const countryId = req.params.countryId;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM region WHERE country_id = ?', [countryId]);
    conn.release();

    // Return the list of regions for the specified country
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/district:
 *   post:
 *     summary: Create district
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               region_id:
 *                 type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: districtName
 *               region_id: 1
 */
router.post('/district', async (req, res) => {
  const { name, region_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO district (name, region_id) VALUES (?, ?)', [name, region_id]);
    conn.release();

    // If the insertion was successful, return the inserted district
    if (result.affectedRows === 1) {
      const insertedDistrict = { id: Number(result.insertId), name, region_id };
      res.json(insertedDistrict);
    } else {
      res.status(500).json({ error: 'Failed to insert district into the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/district:
 *   get:
 *     summary: Get all districts
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: districtName
 *               region_id: 1
 */
router.get('/district', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM district');
    conn.release();

    // Return the list of districts
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/district/byRegion/{regionId}:
 *   get:
 *     summary: Get all districts for a specific region
 *     tags:
 *       - Places
 *     parameters:
 *       - in: path
 *         name: regionId
 *         required: true
 *         description: ID of the region for which districts are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: districtName
 *               region_id: 1
 */
router.get('/district/byRegion/:regionId', async (req, res) => {
  const regionId = req.params.regionId;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM district WHERE region_id = ?', [regionId]);
    conn.release();

    // Return the list of districts for the specified region
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/city:
 *   post:
 *     summary: Create city
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               region_id:
 *                 type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: cityName
 *               region_id: 1
 */
router.post('/city', async (req, res) => {
  const { name, region_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('INSERT INTO city (name, region_id) VALUES (?, ?)', [name, region_id]);
    conn.release();

    // If the insertion was successful, return the inserted city
    if (result.affectedRows === 1) {
      const insertedCity = { id: Number(result.insertId), name, region_id };
      res.json(insertedCity);
    } else {
      res.status(500).json({ error: 'Failed to insert city into the database.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/city:
 *   get:
 *     summary: Get all cities
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: cityName
 *               region_id: 1
 */
router.get('/city', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM city');
    conn.release();

    // Return the list of cities
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/city/byRegion/{regionId}:
 *   get:
 *     summary: Get all cities for a specific region
 *     tags:
 *       - Places
 *     parameters:
 *       - in: path
 *         name: regionId
 *         required: true
 *         description: ID of the region for which cities are to be retrieved
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: cityName
 *               region_id: 1
 */
router.get('/city/byRegion/:regionId', async (req, res) => {
  const regionId = req.params.regionId;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM city WHERE region_id = ?', [regionId]);
    conn.release();

    // Return the list of cities for the specified region
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @openapi
 * /api/v1/city/{id}:
 *   put:
 *     summary: Update city by ID
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
 *               region_id:
 *                 type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: updatedCityName
 *               region_id: 2
 */
router.put('/city/:id', async (req, res) => {
  const cityId = req.params.id;
  const { name, region_id } = req.body;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query('UPDATE city SET name = ?, region_id = ? WHERE city_id = ?', [name, region_id, cityId]);
    conn.release();

    // If the update was successful, return the updated city
    if (result.affectedRows === 1) {
      const updatedCity = { id: Number(cityId), name, region_id };
      res.json(updatedCity);
    } else {
      res.status(404).json({ error: 'City not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




/**
 * @openapi
 * /api/v1/place:
 *   post:
 *     summary: Create place
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               country_id:
 *                 type: integer
 *               region_id:
 *                 type: integer
 *               district_id:
 *                 type: integer
 *               city_id:
 *                 type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               place:
 *                 id: 1  
 *                 user_id: 1  
 *                 country_id: 1
 *                 region_id: 2
 *                 district_id: 3
 *                 city_id: 4
 */
router.post('/place', async (req, res) => {
  const {country_id, region_id, district_id, city_id, user_id} = req.body;

  try {
    const conn = await pool.getConnection();

    // Create place
    const placeResult = await conn.query('INSERT INTO place (country_id, region_id, district_id, city_id, user_id) VALUES (?, ?, ?, ?, ?)',
      [country_id, region_id, district_id, city_id, user_id]);

    // If place creation was successful, return the created place
    if (placeResult.affectedRows === 1) {
      const createdPlace = {
        id: Number(placeResult.insertId), // Convert to a regular integer
        country_id,
        region_id,
        district_id,
        city_id,
        user_id
      };
      res.json({ place: createdPlace });
    } else {
      res.status(500).json({ error: 'Failed to create place.' });
    }

    conn.release();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/place/byUser/{userId}:
 *   put:
 *     summary: Update place by user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
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
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               user_id: 1
 *               country_id: 2
 *               region_id: 3
 *               district_id: 4
 *               city_id: 5
 */
router.put('/place/byUser/:userId', async (req, res) => {
  const userId = req.params.userId;
  const { country_id, region_id, district_id, city_id } = req.body;

  try {
    const conn = await pool.getConnection();

    // Check if the user exists
    const userCheckResult = await conn.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (userCheckResult.length === 0) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    // Update place information associated with the user
    const updatePlaceResult = await conn.query('UPDATE place SET country_id = ?, region_id = ?, district_id = ?, city_id = ? WHERE user_id = ?',
      [country_id, region_id, district_id, city_id, userId]);
    conn.release();

    // If the update was successful, return the updated place
    if (updatePlaceResult.affectedRows === 1) {
      const updatedPlace = { id: updatePlaceResult.insertId, user_id: userId, country_id, region_id, district_id, city_id };
      res.json(updatedPlace);
    } else {
      res.status(500).json({ error: 'Failed to update place.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/place/{user_id}:
 *   get:
 *     summary: Get place by user ID
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               place:
 *                 id: "1" 
 *                 user_id: "1"  
 *                 country_id: 1
 *                 region_id: 2
 *                 district_id: 3
 *                 city_id: 4
 */
router.get('/place/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    const conn = await pool.getConnection();

    // Get place by user ID
    const placeResult = await conn.query('SELECT * FROM place WHERE user_id = ?', [userId]);

    conn.release();

    // If place is found, return it
    if (placeResult.length > 0) {
      const place = placeResult[0];
      res.json(place);
    } else {
      res.status(404).json({ error: 'Place not found for the given user ID.' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/**
 * @openapi
 * /api/v1/places:
 *   get:
 *     summary: Get all places
 *     tags:
 *       - Places
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               places:
 *                 - id: "1"  
 *                   user_id: "1"  
 *                   country_id: 1
 *                   region_id: 2
 *                   district_id: 3
 *                   city_id: 4
 *                 - id: "2"
 *                   user_id: "2"
 *                   country_id: 5
 *                   region_id: 6
 *                   district_id: 7
 *                   city_id: 8
 */
router.get('/places', async (req, res) => {
  try {
    const conn = await pool.getConnection();

    // Get all places
    const placesResult = await conn.query('SELECT * FROM place');
    conn.release();

    // If places are found, return them
    const places = placesResult.map(place => ({
      // id: place.place_id ? place.place_id.toString() : null,  // Using string for BigInt serialization
      // user_id: place.user_id ? place.user_id.toString() : null,  // Using string for BigInt serialization
      id: Number(place.place_id), // Convert to a regular integer
      user_id:  Number(place.user_id),
      country_id: place.country_id,
      region_id: place.region_id,
      district_id: place.district_id,
      city_id: place.city_id
    }));

    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





router.get('/getAllPlaces', async (req, res) => {
  try {
      const conn = await pool.getConnection();
      const countries = await conn.query('SELECT * FROM countries');
      const regions = await conn.query('SELECT * FROM regions');
      const districts = await conn.query('SELECT * FROM districts');
      const cities = await conn.query('SELECT * FROM cities');
      conn.release();
      
      // Organize the results into an object
      const results = {
          countries: countries,
          regions: regions,
          districts: districts,
          cities: cities
      };
      // Return the organized data
      res.json(results);
  } catch (err) {
      res.status(500).json({error: err.message});
  }
});


module.exports = router;
