// Curated word lists (profanity-filtered, kid-friendly)
const ADJECTIVES = [
  'Turbo', 'Silly', 'Cosmic', 'Nimble', 'Pixel', 'Mango', 'Zippy', 'Bouncy', 'Giga', 'Fuzzy',
  'Swift', 'Happy', 'Clever', 'Bright', 'Sunny', 'Jolly', 'Witty', 'Peppy', 'Zesty', 'Chipper',
  'Dapper', 'Eager', 'Fancy', 'Gleeful', 'Hearty', 'Icy', 'Jazzy', 'Keen', 'Lively', 'Merry',
  'Noble', 'Perky', 'Quick', 'Radiant', 'Shiny', 'Tidy', 'Ultra', 'Vivid', 'Warm', 'Xtra',
  'Yellow', 'Zen', 'Alpha', 'Beta', 'Cozy', 'Dashing', 'Electric', 'Fantastic', 'Golden', 'Hero',
];

const NOUNS = [
  'Papaya', 'Otter', 'Noodle', 'Robot', 'Marshmallow', 'Penguin', 'Cactus', 'Comet', 'Waffle', 'Squirrel',
  'Dolphin', 'Pancake', 'Rocket', 'Thunder', 'Rainbow', 'Phoenix', 'Dragon', 'Ninja', 'Wizard', 'Tiger',
  'Falcon', 'Muffin', 'Banana', 'Cookie', 'Donut', 'Eagle', 'Fox', 'Giraffe', 'Hamster', 'Iguana',
  'Jaguar', 'Koala', 'Llama', 'Monkey', 'Narwhal', 'Octopus', 'Panda', 'Quokka', 'Raccoon', 'Seal',
  'Turtle', 'Unicorn', 'Viking', 'Wolf', 'Xenon', 'Yeti', 'Zebra', 'Asteroid', 'Beetle', 'Chipmunk',
];

/**
 * Hash function to convert string to integer
 */
function hashToInt(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) + str.charCodeAt(i);
  }
  return Math.abs(h);
}

/**
 * Generate deterministic nickname from user ID
 */
function makeNickname(userId) {
  const h = hashToInt(userId);
  const adjIndex = h % ADJECTIVES.length;
  const nounIndex = Math.floor(h / ADJECTIVES.length) % NOUNS.length;
  const num = (h % 1000).toString().padStart(3, '0');
  
  return `${ADJECTIVES[adjIndex]}-${NOUNS[nounIndex]}-${num}`;
}

/**
 * Generate random avatar seed
 */
function generateAvatarSeed() {
  return Math.floor(Math.random() * 1000000).toString();
}

/**
 * Generate avatar data URI (SVG) from seed
 */
function avatarDataURI(seed) {
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

module.exports = {
  makeNickname,
  generateAvatarSeed,
  avatarDataURI,
  hashToInt,
};
