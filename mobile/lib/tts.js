import * as Speech from 'expo-speech';

export async function speakText(text) {
  // Stop any ongoing speech
  await Speech.stop();
  
  // Speak the text
  await Speech.speak(text, {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9,
  });
}

export async function stopSpeech() {
  await Speech.stop();
}

export function isSpeaking() {
  return Speech.isSpeakingAsync();
}
