const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
    'audio/ogg; codecs=opus': 'ogg',
    'audio/mpeg': 'mp3',
    'audio/mp4': 'm4a',
    'audio/wav': 'wav',
    'audio/webm': 'webm',
    'audio/amr': 'amr',
  };

  const ext = extensions[mimeType] || 'ogg';

  // Write buffer to a temp file (Node.js compatible approach)
  const tempFile = path.join(os.tmpdir(), `whatsapp-audio-${Date.now()}.${ext}`);

  console.log(`Transcribing audio (${mimeType}, ${audioBuffer.length} bytes)...`);

  try {
    // Write the audio buffer to a temp file
    fs.writeFileSync(tempFile, audioBuffer);

    // Create a read stream for the OpenAI API
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: 'whisper-1',
    });

    console.log('Transcription complete');
    return transcription.text;
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
  }
}

module.exports = {
  transcribeAudio,
};
