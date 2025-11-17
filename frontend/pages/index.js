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
