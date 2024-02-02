const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pool = require('./routes/db');
const categoryRoutes = require('./routes/price-calc/category');
const parameterRoutes = require('./routes/price-calc/parameter');
const userFilterRoutes = require('./routes/users/user-filter');
const usersRoutes = require('./routes/users/users');
const placeRoutes = require('./routes/place/place');
const purchaseCategoryRoutes = require('./routes/purchase/purchase-category');
const incomeRoutes = require('./routes/income/income');
const familySituationsRoutes = require('./routes/family/family-situations');

const path = require('path');

const app = express();

app.use(express.json());

// Swagger setup
const swaggerOptions = {
  definition: {
      openapi: '3.0.0',
      info: {
          title: 'Dzhehuti',
          version: '1.0.0',
          description: 'API documentation for Dzhehuti API',
      },
      tags: [ // Define your tags here
          // {
          //   name: 'Cost Calculation', // Tag name
          //   description: 'Operations related to cost calculation', // Tag description
          // },
          {
            name: 'User Filter', // Tag name
            description: 'Operations related to user filter', // Tag description
          },
          // {
          //     name: 'Categories', // Tag name
          //     description: 'Operations related to categories', // Tag description
          // },
          // {
          //     name: 'Parameters', // Tag name
          //     description: 'Operations related to parameters', // Tag description
          // },
          {
            name: 'Users', // Tag name
            description: 'Operations related to users', // Tag description
          },
          // {
          //   name: 'Places', // Tag name
          //   description: 'Operations related to places', // Tag description
          // },
          {
            name: 'Purchase categories', // Tag name
            description: 'Operations related to purchase categories', // Tag description
          },
          {
            name: 'Purchase frequencies', // Tag name
            description: 'Operations related to purchase frequencies', // Tag description
          },
          {
            name: 'Income', // Tag name
            description: 'Operations related to income', // Tag description
          }
      ],
  },  
  apis: [
          'routes/price-calc/category.js', 
          'routes/price-calc/parameter.js', 
          'routes/users/users.js', 
          'routes/place/place.js', 
          'routes/users/user-filter.js' ,
          'routes/purchase/purchase-category.js',
          'routes/income/income.js',
          'routes/family/family-situations.js'
        ], // Your API routes file(s)
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// norbek
//Routes
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', parameterRoutes);
app.use('/api/v1', usersRoutes);
app.use('/api/v1', placeRoutes);
app.use('/api/v1', userFilterRoutes);
app.use('/api/v1', purchaseCategoryRoutes);
app.use('/api/v1', incomeRoutes);
app.use('/api/v1', familySituationsRoutes);


app.use('/media', express.static(path.join(__dirname, 'media')));
app.get('/api/images/:imageName', (req, res) => {
  const { imageName } = req.params;
  res.sendFile(path.join(__dirname, 'media/images', imageName));
});


  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
