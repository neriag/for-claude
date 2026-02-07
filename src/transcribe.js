const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio using OpenAI's Whisper API
 * @param {Buffer} audioBuffer - The audio content as a buffer
 * @param {string} mimeType - The MIME type of the audio (e.g., 'audio/ogg')
 * @returns {Promise<string>} - The transcribed text
 */
async function transcribeAudio(audioBuffer, mimeType) {
  // Determine file extension from mime type
  const extensions = {
    'audio/ogg': 'ogg',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'audio/amr': 'amr',
  };

  const ext = extensions[mimeType] || 'ogg';

  // Create a File object from the buffer for the OpenAI API
  const file = new File([audioBuffer], `audio.${ext}`, { type: mimeType });

  console.log(`Transcribing audio (${mimeType}, ${audioBuffer.length} bytes)...`);

  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'whisper-1',
  });

  console.log('Transcription complete');
  return transcription.text;
}

module.exports = {
  transcribeAudio,
};
