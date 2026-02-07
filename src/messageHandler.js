const { sendTextMessage, downloadMedia } = require('./whatsapp');
const { transcribeAudio } = require('./transcribe');

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
      // Download and transcribe audio
      try {
        const audioId = message.audio.id;
        const mimeType = message.audio.mime_type;
        console.log(`Processing audio message: ${audioId}`);

        const audioBuffer = await downloadMedia(audioId);
        const transcription = await transcribeAudio(audioBuffer, mimeType);

        replyText = `you said: ${transcription}`;
      } catch (error) {
        console.error('Error transcribing audio:', error);
        replyText = 'Sorry, I could not transcribe your audio message.';
      }
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
