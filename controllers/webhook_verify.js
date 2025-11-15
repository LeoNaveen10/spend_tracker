//for verifying webhook in whatsapp cloud API
exports.webhook = (req, res) => {
  let mode = req.query['hub.mode'];
  let challenge = req.query['hub.challenge'];
  let token = req.query['hub.verify_token'];

  if (mode && token) {
    if (mode == 'subscribe' && token == process.env.VERIFY_WEBHOOK_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.status(403).send(challenge);
    }
  }
};
