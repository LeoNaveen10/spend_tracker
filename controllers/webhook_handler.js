async function sendToSheets(payload, attempt = 1) {
  try {
    const resp = await fetch(process.env.GOOGLEWEBAPPURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      timeout: 10000,
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Sheets returned ${resp.status}: ${text}`);
    }
    console.log("Successfully sent to sheets");
    return true;
  } catch (error) {
    if (attempt < 3) {
      console.warn("Retrying send to sheet, attempt", attempt + 1);
      await new Promise((r) => setTimeout(r, 1000 * attempt));
      return sendToSheets(payload, attempt + 1);
    }
    console.error("Failed to send to sheet:", err);
    return false;
  }
}
async function replyWebhook (req, res) {
  try {
    // The webhook payload is in req.body.
    const body = req.body;
    if (body.object === 'whatsapp_business_account' && 
        body.entry && body.entry[0] && 
        body.entry[0].changes && body.entry[0].changes[0] && 
        body.entry[0].changes[0].value.statuses) {

      const statusUpdate = body.entry[0].changes[0].value.statuses[0];
      const status = statusUpdate.status;
      const messageId = statusUpdate.id;
      const recipientId = statusUpdate.recipient_id;

      switch (status) {
        case "sent":
          console.log(`Message sent to ${recipientId}. Message ID: ${messageId}`);
          break;
        case "delivered":
          console.log(`Message delivered to ${recipientId}. Message ID: ${messageId}`);
          break;
        case "read":
          console.log(`Message read by ${recipientId}. Message ID: ${messageId}`);
          break;
        case "failed":
          console.log(`Message failed for ${recipientId}. Message ID: ${messageId}. Error: ${statusUpdate.errors ? JSON.stringify(statusUpdate.errors) : 'N/A'}`);
          break;
        default:
          console.log(`Unhandled status: ${status}`);
      }
      return res.status(200).end(); 
    }

    if (body.object === 'whatsapp_business_account' && 
        body.entry && body.entry[0] && 
        body.entry[0].changes && body.entry[0].changes[0] && 
        body.entry[0].changes[0].value.messages) {

      const incomingMessage = body.entry[0].changes[0].value.messages[0];
      const senderWaId = incomingMessage.from;
      const messageType = incomingMessage.type;
      
      if (messageType === "text") {
        const messageBody = incomingMessage.text.body; // The actual message text
        
        const text_body = messageBody.split("\n"); 

        const payload = {
          date: new Date().toISOString().split("T")[0],
          item: text_body[0] || null,
          price: text_body[1] ? parseFloat(text_body[1]).toFixed(2) : null,
          comment: text_body[2] || null,
          sender: senderWaId // Include sender's ID for reference
        };

        await sendToSheets(payload); 
        
        // Respond with 200 OK after processing
        return res.status(200).end(); 
      }
      
      console.log(`Received message of type: ${messageType} from ${senderWaId}`);
      return res.status(200).end();
    }
    
    return res.status(200).end(); 

  } catch (err) {
    console.error("Webhook processing error:", err);
    return res.status(500).end(); 
  }
}


module.exports = {
  sendToSheets,
  replyWebhook
};