import { useState } from 'react';
import { motion } from 'framer-motion';
import { explainAPI } from '@/lib/api';
import useStore from '@/lib/store';

export default function PopularTopics() {
  const { setCurrentTopic, setIsLoading, setCurrentExplanation, user } = useStore();

  const exampleTopics = [
    { text: 'How does photosynthesis work?', icon: '🌱' },
    { text: 'Explain quantum computing', icon: '⚛️' },
    { text: 'What is blockchain?', icon: '🔗' },
    { text: 'How does DNA replication occur?', icon: '🧬' },
  ];

  const handleTopicClick = async (topic) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    
    try {
      const response = await explainAPI.explain(topic, user?.uid);
      setCurrentExplanation(response.data.content);
    } catch (error) {
      console.error('Failed to load topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-8"
    >
      <p className="text-sm text-gray-500 mb-4">Try asking:</p>
      
      <div className="flex flex-wrap gap-3 justify-center max-w-2xl mx-auto">
        {exampleTopics.map((topic, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleTopicClick(topic.text)}
            className="group px-4 py-2.5 bg-white rounded-xl text-sm text-gray-700 hover:text-indigo-600 border border-gray-200/50 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{topic.icon}</span>
            <span className="font-medium">{topic.text}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
