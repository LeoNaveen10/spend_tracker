const { sendToSheets, replyWebhook } = require('../controllers/webhook_handler');

// Mock fetch globally
global.fetch = jest.fn();

describe('webhook_handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
  });

  describe('sendToSheets', () => {
    it('should send data successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200
      });

      const payload = { date: '2024-01-01', item: 'Coffee', price: '5.50' };
      const result = await sendToSheets(payload);

      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledWith(process.env.GOOGLEWEBAPPURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 10000
      });
    });

    it('should retry on failure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));
      fetch.mockResolvedValueOnce({ ok: true, status: 200 });

      const result = await sendToSheets({ item: 'Test' });
      expect(result).toBe(true);
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('replyWebhook', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          entry: [{
            changes: [{
              value: {}
            }]
          }]
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        end: jest.fn()
      };
    });

    it('should handle text messages', async () => {
      req.body.entry[0].changes[0].value = {
        messages: [{
          type: 'text',
          text: { body: 'Coffee\n5.50\nMorning coffee' }
        }]
      };

      fetch.mockResolvedValueOnce({ ok: true });

      await replyWebhook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });

    it('should handle status updates', async () => {
      req.body.entry[0].changes[0].value = {
        statuses: [{ status: 'sent' }]
      };

      await replyWebhook(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith('message sent');
    });

    it('should handle errors', async () => {
      req.body = null;

      await replyWebhook(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});