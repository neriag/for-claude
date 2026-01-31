require('dotenv').config();
const express = require('express');
const { handleWebhookVerification, handleWebhookEvent } = require('./webhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook verification (GET) - called by Meta during webhook setup
app.get('/webhook', handleWebhookVerification);

// Webhook events (POST) - receives incoming messages
app.post('/webhook', handleWebhookEvent);

// Start server
app.listen(PORT, () => {
  console.log(`WhatsApp Mirror Bot running on port ${PORT}`);
  console.log(`Webhook URL: https://your-domain.com/webhook`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
