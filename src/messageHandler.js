const { sendTextMessage } = require('./whatsapp');

/**
 * Handle an incoming WhatsApp message.
 * This is where you add your custom logic.
 *
 * @param {object} message - The incoming message object
 * @param {object} metadata - Metadata including phone_number_id
 */
async function handleIncomingMessage(message, metadata) {
  const from = message.from; // Sender's phone number
  const phoneNumberId = metadata.phone_number_id; // Your bot's phone number ID

  console.log(`Received message from ${from}`);

  // Handle different message types
  let replyText;

  switch (message.type) {
    case 'text':
      // Mirror the text message
      replyText = `you wrote: ${message.text.body}`;
      break;

    case 'image':
      replyText = 'you wrote: [image]';
      break;

    case 'audio':
      replyText = 'you wrote: [audio message]';
      break;

    case 'video':
      replyText = 'you wrote: [video]';
      break;

    case 'document':
      replyText = 'you wrote: [document]';
      break;

    case 'sticker':
      replyText = 'you wrote: [sticker]';
      break;

    case 'location':
      replyText = 'you wrote: [location]';
      break;

    case 'contacts':
      replyText = 'you wrote: [contact]';
      break;

    default:
      replyText = `you wrote: [${message.type}]`;
  }

  // Send the reply
  await sendTextMessage(from, replyText, phoneNumberId);
}

module.exports = {
  handleIncomingMessage,
};
