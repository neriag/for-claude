const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Transcribe audio using OpenAI's Whisper API (using native fetch)
 * @param {Buffer} audioBuffer - The audio content as a buffer
 * @param {string} mimeType - The MIME type of the audio (e.g., 'audio/ogg')
 * @returns {Promise<string>} - The transcribed text
 */
async function transcribeAudio(audioBuffer, mimeType) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

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
  const filename = `audio.${ext}`;

  console.log(`Transcribing audio (${mimeType}, ${audioBuffer.length} bytes)...`);

  // Create FormData with the audio file
  const formData = new FormData();
  formData.append('file', new Blob([audioBuffer], { type: mimeType }), filename);
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('OpenAI API error:', error);
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const result = await response.json();
  console.log('Transcription complete');
  return result.text;
}

module.exports = {
  transcribeAudio,
};
