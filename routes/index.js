const { replyWebhook } = require("../controllers/webhook_handler");
const { webhook } = require("../controllers/webhook_verify");

module.exports = app => {
  app.get('/webhook', webhook);
  app.post('/webhook', replyWebhook);
};
