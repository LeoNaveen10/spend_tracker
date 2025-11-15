const { webhook } = require('../controllers/webhook_verify');

describe('webhook_verify', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    process.env.VERIFY_WEBHOOK_TOKEN = 'test-token';
  });

  it('should verify webhook with correct token', () => {
    req.query = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'test-challenge',
      'hub.verify_token': 'test-token'
    };

    webhook(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('test-challenge');
  });

  it('should reject webhook with incorrect token', () => {
    req.query = {
      'hub.mode': 'subscribe',
      'hub.challenge': 'test-challenge',
      'hub.verify_token': 'wrong-token'
    };

    webhook(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('test-challenge');
  });

  it('should handle missing parameters', () => {
    req.query = {};

    webhook(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });
});