# QuickLearn AI 🚀

> Master any topic in 60 seconds

QuickLearn AI is an educational platform that delivers instant, easy-to-understand explanations for any concept. Whether you're a student, professional, or lifelong learner, get the knowledge you need in just one minute.

## ✨ Features

- **⚡ Lightning Fast** - Get comprehensive explanations in under 60 seconds
- **🎯 Simple & Clear** - Complex topics broken down with analogies and real-world examples
- **🔥 Daily Streaks** - Track your learning progress and build consistent habits
- **🎭 Social Sharing** - Generate shareable memes to spread knowledge
- **📱 Works Everywhere** - Progressive web app - install on any device
- **🔒 Privacy-Focused** - Secure authentication with Google Sign-In

## 🚀 Live Demo

Try it now: **[QuickLearn AI](https://quicklearn-ai.netlify.app)**

## 🎓 How It Works

1. **Sign in** with your Google account
2. **Enter any topic** you want to learn about
3. **Get instant explanation** with definition, analogy, and examples
4. **Build streaks** by learning something new every day
5. **Share knowledge** with friends on social media

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Tailwind CSS** - Modern styling
- **Framer Motion** - Smooth animations
- **Firebase Auth** - Google Sign-In

### Backend
- **Node.js + Express** - RESTful API
- **PostgreSQL** - Database
- **Redis** - Caching layer
- **Groq AI** - Language models

## 💻 For Developers

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Firebase project
- Groq API key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/himanshumudigonda/quicklearn-ai.git
cd quicklearn-ai

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup (in new terminal)
cd frontend
npm install
# Create .env.local with your Firebase config
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
GROQ_API_KEY=your_groq_key
FIREBASE_ADMIN_JSON={"project_id":"..."}
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
```

## 📁 Project Structure

```
quicklearn-ai/
├── backend/          # Node.js API server
├── frontend/         # Next.js web app
├── mobile/           # React Native app (coming soon)
└── README.md
```

## 🌐 Deployment

The app is deployed on:
- **Frontend**: Netlify
- **Backend**: Render
- **Database**: Neon PostgreSQL
- **Cache**: Upstash Redis

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

- **Feedback**: infinitetsukuyomi035@gmail.com
- **Issues**: [GitHub Issues](https://github.com/himanshumudigonda/quicklearn-ai/issues)

---

Made with ❤️ for learners worldwide
