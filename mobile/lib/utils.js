function hashToInt(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

export function generateAvatarColor(seed) {
  const colors = [
    '#FFD966', '#F28C8C', '#9AD3BC', '#C6B1E1',
    '#FFD9A6', '#A8D8EA', '#FFB6C1', '#B2DFDB'
  ];
  const h = hashToInt(seed.toString());
  return colors[h % colors.length];
}

export function formatTimeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
