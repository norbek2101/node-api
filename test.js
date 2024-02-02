// Before (using require)
const chai = require('chai');
// After (using import)

const chaiHttp = require('chai-http');
const app = require('./app.js'); // Replace with the path to your Express app file
const expect = chai.expect;

import chai from 'chai';

chai.use(chaiHttp);

describe('Category API Endpoints', () => {
  let categoryId;

  it('should create a new category', async () => {
    const res = await chai.request(app)
      .post('/api/v1/categories')
      .send({ name: 'TestCategory' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('name', 'TestCategory');
    categoryId = res.body.id;
  });

  it('should get all categories', async () => {
    const res = await chai.request(app)
      .get('/api/v1/categories');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('should get a specific category by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/v1/categories/${categoryId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id', categoryId);
  });

  it('should update a category by ID', async () => {
    const res = await chai.request(app)
      .put(`/api/v1/categories/${categoryId}`)
      .send({ name: 'UpdatedTestCategory' });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id', categoryId);
    expect(res.body).to.have.property('name', 'UpdatedTestCategory');
  });

  it('should delete a category by ID', async () => {
    const res = await chai.request(app)
      .delete(`/api/v1/categories/${categoryId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Category deleted successfully');
  });

  it('should handle 404 error for getting a non-existing category', async () => {
    const res = await chai.request(app)
      .get('/api/v1/categories/9999');

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error', 'Category not found.');
  });
});

describe('Parameter API Endpoints', () => {
  let parameterId;

  it('should create a new parameter', async () => {
    const res = await chai.request(app)
      .post('/api/v1/parameter')
      .send({ name: 'TestParameter', price: 19.99, category_id: 1 });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id');
    expect(res.body).to.have.property('name', 'TestParameter');
    parameterId = res.body.id;
  });

  it('should get all parameters', async () => {
    const res = await chai.request(app)
      .get('/api/v1/parameters');

    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });

  it('should get a specific parameter by ID', async () => {
    const res = await chai.request(app)
      .get(`/api/v1/parameter/${parameterId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id', parameterId);
  });

  it('should update a parameter by ID', async () => {
    const res = await chai.request(app)
      .put(`/api/v1/parameter/${parameterId}`)
      .send({ name: 'UpdatedTestParameter', price: 29.99, category_id: 2 });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('id', parameterId);
    expect(res.body).to.have.property('name', 'UpdatedTestParameter');
  });

  it('should delete a parameter by ID', async () => {
    const res = await chai.request(app)
      .delete(`/api/v1/parameter/${parameterId}`);

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('message', 'Parameter deleted successfully');
  });

  it('should handle 404 error for getting a non-existing parameter', async () => {
    const res = await chai.request(app)
      .get('/api/v1/parameter/9999');

    expect(res).to.have.status(404);
    expect(res.body).to.have.property('error', 'Parameter not found.');
  });
});

describe('Calculate Total Cost Endpoint', () => {
  it('should calculate total cost of selected parameters', async () => {
    const res = await chai.request(app)
      .post('/api/v1/parameters/calculateTotalCost')
      .send({ selectedParams: [1, 2, 3] });

    expect(res).to.have.status(200);
    expect(res.body).to.have.property('totalCost').that.is.a('number');
  });

  it('should handle 500 error for calculating total cost with invalid parameter IDs', async () => {
    const res = await chai.request(app)
      .post('/api/v1/parameters/calculateTotalCost')
      .send({ selectedParams: [9999] });

    expect(res).to.have.status(500);
    expect(res.body).to.have.property('error');
  });
});

// Add more describe blocks for additional endpoints or functionalities
