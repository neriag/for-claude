const { handleIncomingMessage } = require('./messageHandler');

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'your-verify-token';

/**
 * Handle webhook verification request from Meta.
 * This is called once when you configure your webhook URL in the Meta Developer Console.
 */
function handleWebhookVerification(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('Webhook verification failed. Check your VERIFY_TOKEN.');
    res.sendStatus(403);
  }
}

/**
 * Handle incoming webhook events (messages, status updates, etc.)
 */
async function handleWebhookEvent(req, res) {
  const body = req.body;

  // Verify this is a WhatsApp webhook
  if (body.object !== 'whatsapp_business_account') {
    return res.sendStatus(404);
  }

  // Always respond with 200 OK quickly to acknowledge receipt
  // Process the message asynchronously
  res.sendStatus(200);

  // Process each entry (usually just one)
  for (const entry of body.entry || []) {
    // Process each change in the entry
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;

      const value = change.value;
      const messages = value.messages || [];

      // Process each message
      for (const message of messages) {
        try {
          await handleIncomingMessage(message, value.metadata);
        } catch (error) {
          console.error('Error handling message:', error);
        }
      }
    }
  }
}

module.exports = {
  handleWebhookVerification,
  handleWebhookEvent,
};
