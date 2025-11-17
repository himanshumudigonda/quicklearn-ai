/**
 * Generate avatar data URI from seed
 */
export function avatarDataURI(seed) {
  const h = hashToInt(seed.toString());
  const colors = ['#FFD966', '#F28C8C', '#9AD3BC', '#C6B1E1', '#FFD9A6', '#A8D8EA', '#FFB6C1', '#B2DFDB'];
  const bg = colors[h % colors.length];
  const s1 = (h >> 3) % 360;
  const s2 = (h >> 7) % 360;
  
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
    <rect width='64' height='64' rx='12' fill='${bg}'/>
    <circle cx='22' cy='22' r='10' fill='hsl(${s1},70%,60%)' opacity='0.95'/>
    <rect x='36' y='36' width='14' height='14' rx='3' fill='hsl(${s2},70%,60%)' opacity='0.95'/>
  </svg>`;
  
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function hashToInt(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

/**
 * Text-to-speech using Web Speech API
 */
export function speakText(text) {
  if (!window.speechSynthesis) {
    alert('Text-to-speech not supported in your browser');
    return;
  }
  
  window.speechSynthesis.cancel(); // Stop any current speech
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop text-to-speech
 */
export function stopSpeech() {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Format timestamp to relative time
 */
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

/**
 * Download text as PDF (simple text file for now)
 */
export function downloadAsPDF(topic, content) {
  const text = `${topic.toUpperCase()}\n\n` +
    `Definition: ${content.one_line}\n\n` +
    `Explanation: ${content.explanation}\n\n` +
    `Analogy: ${content.analogy}\n\n` +
    `Example: ${content.example}\n\n` +
    (content.formula ? `Formula: ${content.formula}\n\n` : '') +
    `Quick Revision: ${content.revision_note}\n`;
  
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${topic.replace(/\s+/g, '-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}
