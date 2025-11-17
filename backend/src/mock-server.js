// Mock server for local development without DB/Redis dependencies
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage
const users = new Map();
const explanations = new Map();

// Nickname generator
const ADJS = ['Turbo','Silly','Cosmic','Nimble','Pixel','Mango','Zippy','Bouncy','Giga','Fuzzy','Clever','Bright','Quick','Wise'];
const NOUNS = ['Papaya','Otter','Noodle','Robot','Marshmallow','Penguin','Cactus','Comet','Waffle','Squirrel','Koala','Panda','Rocket'];

function hashToInt(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
    return Math.abs(h);
}

function makeNickname(seed) {
    const h = hashToInt(seed);
    const a = ADJS[h % ADJS.length];
    const n = NOUNS[Math.floor(h / ADJS.length) % NOUNS.length];
    const num = (h % 1000).toString().padStart(3, '0');
    return `${a}-${n}-${num}`;
}

function generateAvatarSeed() {
    return Date.now().toString() + Math.random().toString(36).substring(7);
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        mode: 'mock',
        message: 'Mock server running without DB/Redis dependencies'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'QuickLearn AI Mock API',
        version: '1.0.0',
        status: 'running',
        mode: 'development-mock',
        endpoints: {
            health: '/health',
            login: 'POST /api/auth/login',
            explain: 'POST /api/explain'
        }
    });
});

// Mock Firebase verification (always succeeds)
function mockVerifyIdToken(idToken) {
    return Promise.resolve({
        uid: 'mock-user-' + Date.now(),
        email: 'user@example.com'
    });
}

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ error: 'ID token required' });
        }

        // Mock verify token
        const decodedToken = await mockVerifyIdToken(idToken);
        const userId = decodedToken.uid;

        // Check if user exists
        let user = users.get(userId);

        if (!user) {
            // Create new user
            const nickname = makeNickname(userId);
            const avatarSeed = generateAvatarSeed();

            user = {
                id: userId,
                nickname,
                avatar_seed: avatarSeed,
                created_at: new Date().toISOString(),
                credits_verified: 0
            };

            users.set(userId, user);
        }

        // Generate mock JWT
        const sessionToken = 'mock-jwt-' + userId;

        res.json({
            sessionToken,
            nickname: user.nickname,
            avatarSeed: user.avatar_seed,
            creditsVerified: user.credits_verified
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
});

// POST /api/auth/regenerate-nickname
app.post('/api/auth/regenerate-nickname', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const newNickname = makeNickname(userId + Date.now());
        
        const user = users.get(userId);
        if (user) {
            user.nickname = newNickname;
            users.set(userId, user);
        }

        res.json({ nickname: newNickname });

    } catch (error) {
        console.error('Regenerate nickname error:', error);
        res.status(500).json({ error: 'Failed to regenerate nickname', message: error.message });
    }
});

// POST /api/auth/regenerate-avatar
app.post('/api/auth/regenerate-avatar', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'User ID required' });
        }

        const newSeed = generateAvatarSeed();
        
        const user = users.get(userId);
        if (user) {
            user.avatar_seed = newSeed;
            users.set(userId, user);
        }

        res.json({ avatarSeed: newSeed });

    } catch (error) {
        console.error('Regenerate avatar error:', error);
        res.status(500).json({ error: 'Failed to regenerate avatar', message: error.message });
    }
});

// POST /api/explain
app.post('/api/explain', async (req, res) => {
    try {
        const { topic, user_id, force_verify } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic required' });
        }

        const normalizedTopic = topic.toLowerCase().trim();

        // Check cache
        let explanation = explanations.get(normalizedTopic);

        if (!explanation || force_verify) {
            // Generate mock explanation
            explanation = {
                topic: normalizedTopic,
                source: 'mini',
                one_line: `${topic} is a fundamental concept that involves specific processes and characteristics.`,
                explanation: `${topic} refers to a complex system or concept that plays a crucial role in its field. This involves multiple interconnected components working together to achieve specific outcomes. Understanding ${topic} requires examining its core principles, mechanisms, and real-world applications.`,
                analogy: `Think of ${topic} like a well-organized machine. Just as a machine has different parts working in harmony, ${topic} has various elements that coordinate to produce results. When one component functions properly, it enables the entire system to operate efficiently.`,
                example: `A common example of ${topic} can be seen in everyday situations. For instance, when you observe natural phenomena or technological processes, you're witnessing ${topic} in action. This demonstrates how theoretical concepts translate into practical applications.`,
                formula: topic.includes('law') || topic.includes('equation') ? 'A = B × C' : '',
                revision_note: `Remember: ${topic} is essential because it explains how specific mechanisms work. Focus on understanding the relationship between cause and effect, and how different factors influence the overall outcome.`,
                verified: false,
                cached: false,
                created_at: new Date().toISOString()
            };

            explanations.set(normalizedTopic, explanation);
        } else {
            explanation.cached = true;
        }

        res.json(explanation);

    } catch (error) {
        console.error('Explain error:', error);
        res.status(500).json({ error: 'Failed to generate explanation', message: error.message });
    }
});

// POST /api/verify
app.post('/api/verify', async (req, res) => {
    try {
        const { topic, user_id, priority } = req.body;

        if (!topic) {
            return res.status(400).json({ error: 'Topic required' });
        }

        const jobId = 'mock-job-' + Date.now();

        // Mock job creation
        res.json({
            job_id: jobId,
            status: 'queued',
            message: 'Verification request queued (mock)'
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({ error: 'Failed to queue verification', message: error.message });
    }
});

// GET /api/topics/popular
app.get('/api/topics/popular', (req, res) => {
    res.json({
        topics: [
            'Photosynthesis',
            'Ohm\'s Law',
            'GDP',
            'Python Loops',
            'Mitochondria',
            'Newton\'s Laws',
            'DNA Replication',
            'Supply and Demand'
        ]
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: err.message 
    });
});

// Start server
app.listen(PORT, () => {
    console.log('\n🚀 QuickLearn AI Mock Server Started!');
    console.log(`📍 Running on: http://localhost:${PORT}`);
    console.log('🔧 Mode: Development (No DB/Redis required)');
    console.log('✅ All endpoints are mock implementations\n');
    console.log('Available endpoints:');
    console.log(`  - GET  http://localhost:${PORT}/health`);
    console.log(`  - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`  - POST http://localhost:${PORT}/api/explain`);
    console.log(`  - POST http://localhost:${PORT}/api/verify\n`);
});

module.exports = app;
