const WHATSAPP_API_VERSION = 'v18.0';
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`;

/**
 * Send a text message via WhatsApp Cloud API
 * @param {string} to - Recipient phone number (with country code, no +)
 * @param {string} text - Message text to send
 * @param {string} phoneNumberId - Your WhatsApp Business phone number ID
 */
async function sendTextMessage(to, text, phoneNumberId) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('WHATSAPP_ACCESS_TOKEN environment variable is not set');
  }

  const url = `${WHATSAPP_API_BASE}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('WhatsApp API error:', error);
    throw new Error(`WhatsApp API error: ${response.status}`);
  }

  const result = await response.json();
  console.log('Message sent successfully:', result.messages?.[0]?.id);
  return result;
}

module.exports = {
  sendTextMessage,
};
