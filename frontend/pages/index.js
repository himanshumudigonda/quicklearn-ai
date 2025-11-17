import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import ResultCard from '@/components/ResultCard';
import ProfileButton from '@/components/ProfileButton';
import PopularTopics from '@/components/PopularTopics';
import { Sparkles, Zap, Brain, TrendingUp } from 'lucide-react';

export default function Home() {
  const { currentExplanation, currentTopic, isLoading } = useStore();
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (currentExplanation) {
      setShowResult(true);
    }
  }, [currentExplanation]);

  return (
    <>
      <Head>
        <title>QuickLearn AI - Master Any Topic in 60 Seconds</title>
        <meta name="description" content="AI-powered learning platform. Get instant, concise explanations for any topic in under 1 minute." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"
                >
                  <Sparkles className="w-6 h-6 text-white" />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-lg opacity-30"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QuickLearn AI
              </h1>
            </motion.div>
            <ProfileButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
              >
                {/* Hero Section */}
                <motion.div
                  className="text-center mb-12 max-w-3xl"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                        Learn Anything
                      </span>
                      <br />
                      <span className="text-3xl sm:text-4xl md:text-5xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        in 60 Seconds
                      </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 mb-12 px-4">
                      AI-powered explanations for any topic. Simple, fast, and free forever.
                    </p>
                  </motion.div>

                  {/* Search Bar */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <SearchBar />
                  </motion.div>

                  {/* Popular Topics */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <PopularTopics />
                  </motion.div>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                  className="grid sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-4xl mt-12"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {[
                    { icon: Zap, title: "Instant", desc: "Under 60 seconds", color: "from-yellow-400 to-orange-500" },
                    { icon: Brain, title: "AI-Powered", desc: "Advanced models", color: "from-indigo-400 to-purple-500" },
                    { icon: TrendingUp, title: "Always Free", desc: "No limits", color: "from-green-400 to-emerald-500" }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      className="group relative p-6 bg-white rounded-2xl border border-gray-200/50 hover:border-indigo-200 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10"
                      whileHover={{ y: -5, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="py-8"
              >
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mb-8"
                >
                  <SearchBar compact />
                </motion.div>
                
                {isLoading ? (
                  <motion.div 
                    className="bg-white rounded-2xl border border-gray-200/50 p-8 shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="space-y-4 animate-pulse">
                      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </motion.div>
                ) : (
                  <ResultCard
                    topic={currentTopic}
                    content={currentExplanation}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          className="py-8 text-center border-t border-gray-200/50 mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-600 text-sm sm:text-base">
            QuickLearn AI • Powered by Advanced AI
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">
            Learn anything, anytime, anywhere
          </p>
        </motion.footer>
      </div>
    </>
  );
}

export default function Home() {
  const { currentExplanation, currentTopic, isLoading } = useStore();
  const [showResult, setShowResult] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (currentExplanation) {
      setShowResult(true);
    }
  }, [currentExplanation]);

  // Mouse move effect for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Zap, title: "Instant Answers", desc: "Get explanations in under 60 seconds" },
    { icon: Brain, title: "AI-Powered", desc: "Advanced AI models at your service" },
    { icon: Shield, title: "Always Free", desc: "Premium features, zero cost forever" }
  ];

  return (
    <>
      <Head>
        <title>QuickLearn AI - Master Any Topic in 60 Seconds</title>
        <meta name="description" content="AI-powered learning platform. Get instant, concise explanations for any topic in under 1 minute." />
      </Head>

      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* Animated gradient background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(circle 800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(138, 43, 226, 0.15), transparent)`,
            }}
          />
          {/* Animated particles - only render on client */}
          {typeof window !== 'undefined' && (
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: Math.random() * window.innerHeight,
                    opacity: Math.random() * 0.5
                  }}
                  animate={{
                    y: [null, Math.random() * window.innerHeight],
                    opacity: [null, 0, Math.random() * 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 10 + 10,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Header */}
        <header className="sticky top-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-purple-400 w-10 h-10" />
              </motion.div>
              <h1 className="text-3xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  QuickLearn
                </span>
              </h1>
            </motion.div>
            <ProfileButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-20"
              >
                {/* Hero Section */}
                <div className="text-center mb-16">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h2 
                      className="text-7xl md:text-8xl font-black mb-6 leading-tight"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Learn{' '}
                      <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                        Anything
                      </span>
                      <br />
                      <span className="text-6xl md:text-7xl">in 60 Seconds</span>
                    </motion.h2>
                    <motion.p 
                      className="text-2xl text-gray-400 mb-12 max-w-3xl mx-auto"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Powered by 15+ AI models. Instant explanations. Zero complexity.
                    </motion.p>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <SearchBar />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <PopularTopics />
                  </motion.div>
                </div>

                {/* Features Grid */}
                <motion.div
                  className="grid md:grid-cols-3 gap-6 mt-24"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {features.map((feature, i) => (
                    <motion.div
                      key={i}
                      className="group relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -5 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <feature.icon className="w-12 h-12 text-purple-400 mb-4 relative z-10" />
                      <h3 className="text-xl font-bold mb-2 relative z-10">{feature.title}</h3>
                      <p className="text-gray-400 relative z-10">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SearchBar compact />
                
                {isLoading ? (
                  <motion.div 
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                      <div className="space-y-4">
                        <div className="h-8 bg-white/10 rounded-lg w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-white/10 rounded w-full animate-pulse delay-75"></div>
                        <div className="h-4 bg-white/10 rounded w-5/6 animate-pulse delay-150"></div>
                        <div className="h-4 bg-white/10 rounded w-4/6 animate-pulse delay-300"></div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <ResultCard
                    topic={currentTopic}
                    content={currentExplanation}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <motion.footer 
          className="relative z-10 mt-32 py-12 text-center border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <p className="text-gray-400 text-lg mb-2">
            QuickLearn AI • Powered by Advanced AI
          </p>
          <p className="text-gray-500">
            Learn anything, anytime, anywhere
          </p>
        </motion.footer>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}
