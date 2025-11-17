import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import ResultCard from '@/components/ResultCard';
import ProfileButton from '@/components/ProfileButton';
import PopularTopics from '@/components/PopularTopics';
import { Sparkles, Brain, Zap, Shield } from 'lucide-react';

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
    { icon: Brain, title: "AI-Powered", desc: "15+ advanced AI models working for you" },
    { icon: Shield, title: "Privacy First", desc: "No tracking, no history, just learning" }
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
            QuickLearn AI • Powered by Advanced AI Models
          </p>
          <p className="text-gray-500">
            Privacy-focused • No tracking • No history stored
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
