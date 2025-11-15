const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

// Mock the controllers
jest.mock('../controllers/webhook_handler');
jest.mock('../controllers/webhook_verify');

const { replyWebhook } = require('../controllers/webhook_handler');
const { webhook } = require('../controllers/webhook_verify');

describe('Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    require('../routes/index')(app);
  });

  it('should handle GET /webhook', async () => {
    webhook.mockImplementation((req, res) => {
      res.status(200).send('verified');
    });

    const response = await request(app).get('/webhook');
    expect(webhook).toHaveBeenCalled();
  });

  it('should handle POST /webhook', async () => {
    replyWebhook.mockImplementation((req, res) => {
      res.status(200).end();
    });

    const response = await request(app).post('/webhook').send({});
    expect(replyWebhook).toHaveBeenCalled();
  });
});