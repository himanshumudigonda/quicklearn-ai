const { query } = require('../db');
const logger = require('../utils/logger');

// Sample popular topics to seed
const POPULAR_TOPICS = [
  'photosynthesis', 'ohms law', 'pythagorean theorem', 'dna replication',
  'newton first law', 'mitosis', 'water cycle', 'ecosystem',
  'kinetic energy', 'photosynthesis equation', 'cell membrane',
  'mitochondria', 'protein synthesis', 'food chain', 'respiration',
  'gravity', 'friction', 'inertia', 'momentum', 'velocity',
  'acceleration', 'force', 'work', 'power', 'energy conservation',
  'solar system', 'moon phases', 'eclipses', 'seasons',
  'weather', 'climate change', 'greenhouse effect', 'carbon cycle',
  'nitrogen cycle', 'osmosis', 'diffusion', 'active transport',
  'photosynthesis vs respiration', 'atomic structure', 'periodic table',
  'chemical bonds', 'acids and bases', 'ph scale', 'oxidation',
  'reduction', 'photosynthesis process', 'chloroplast', 'chlorophyll',
  'stomata', 'transpiration', 'xylem', 'phloem', 'root system',
  'pollination', 'fertilization', 'germination', 'evolution',
  'natural selection', 'adaptation', 'mutation', 'genetics',
  'chromosomes', 'genes', 'alleles', 'dominant recessive',
  'punnet square', 'inheritance', 'mendel laws', 'dna structure',
  'rna', 'transcription', 'translation', 'proteins',
  'enzymes', 'catalysis', 'metabolism', 'homeostasis',
  'nervous system', 'neurons', 'synapse', 'brain',
  'heart', 'circulatory system', 'blood', 'digestive system',
  'respiratory system', 'excretory system', 'immune system',
  'skeletal system', 'muscular system', 'endocrine system',
  'hormones', 'reproduction', 'meiosis', 'gametes',
  'zygote', 'embryo', 'fetus', 'metamorphosis',
  'life cycle', 'biomes', 'habitat', 'niche',
  'population', 'community', 'biodiversity', 'extinction',
  'conservation', 'sustainability', 'renewable energy',
  'fossil fuels', 'pollution', 'ozone layer', 'deforestation'
];

async function seedTopics() {
  logger.info('Starting topic seeding...');
  
  for (const topic of POPULAR_TOPICS) {
    try {
      // Check if topic already exists
      const existing = await query(
        'SELECT id FROM explanations WHERE topic = $1',
        [topic]
      );

      if (existing.rows.length === 0) {
        // Generate explanation for this topic
        // In production, you'd call the actual model here
        // For seeding, we'll create placeholder
        const content = {
          one_line: `Definition of ${topic}`,
          explanation: `This is a placeholder explanation for ${topic}. Replace with actual AI-generated content.`,
          analogy: `Think of ${topic} like...`,
          example: `For example, in ${topic}...`,
          formula: '',
          revision_note: `Remember: ${topic} is important.`
        };

        await query(
          `INSERT INTO explanations (topic, content, source_model, verified, uses)
           VALUES ($1, $2, $3, $4, $5)`,
          [topic, JSON.stringify(content), 'seed', false, Math.floor(Math.random() * 100)]
        );

        logger.info(`Seeded: ${topic}`);
      } else {
        logger.info(`Skipped (exists): ${topic}`);
      }
    } catch (error) {
      logger.error(`Failed to seed ${topic}:`, error);
    }
  }

  logger.info('Seeding complete!');
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  require('dotenv').config();
  const { setupDatabase } = require('../db');
  
  setupDatabase()
    .then(() => seedTopics())
    .catch(err => {
      logger.error('Seed failed:', err);
      process.exit(1);
    });
}

module.exports = { seedTopics };
