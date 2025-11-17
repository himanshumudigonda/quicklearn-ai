import { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import useStore from '@/lib/store';
import SearchBar from '@/components/SearchBar';
import ResultCard from '@/components/ResultCard';
import ProfileButton from '@/components/ProfileButton';
import PopularTopics from '@/components/PopularTopics';
import { Sparkles } from 'lucide-react';

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
        <title>QuickLearn AI - Learn Anything in 1 Minute</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="text-primary-500 w-8 h-8" />
              <h1 className="text-2xl font-bold text-neutral-900">
                Quick<span className="text-primary-500">Learn</span>
              </h1>
            </motion.div>
            <ProfileButton />
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {!showResult ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-20 text-center"
            >
              <h2 className="text-5xl font-bold mb-4 text-neutral-900">
                Learn anything in
                <span className="text-primary-500"> 1 minute</span>
              </h2>
              <p className="text-xl text-neutral-600 mb-12">
                Get instant, concise explanations for any topic
              </p>

              <SearchBar />

              <PopularTopics />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <SearchBar compact />
              
              {isLoading ? (
                <div className="mt-8">
                  <div className="card animate-pulse">
                    <div className="h-6 bg-neutral-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 bg-neutral-200 rounded mb-2 w-5/6"></div>
                    <div className="h-4 bg-neutral-200 rounded w-4/6"></div>
                  </div>
                </div>
              ) : (
                <ResultCard
                  topic={currentTopic}
                  content={currentExplanation}
                />
              )}
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-20 py-8 text-center text-neutral-500 text-sm">
          <p>QuickLearn AI • Powered by advanced AI models</p>
          <p className="mt-2">Privacy-focused • No history stored</p>
        </footer>
      </div>
    </>
  );
}
