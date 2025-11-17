import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { topicsAPI } from '@/lib/api';
import useStore from '@/lib/store';

export default function PopularTopics() {
  const [topics, setTopics] = useState([]);
  const { setCurrentTopic, setIsLoading, setCurrentExplanation } = useStore();

  useEffect(() => {
    loadPopularTopics();
  }, []);

  const loadPopularTopics = async () => {
    try {
      const response = await topicsAPI.popular(20);
      setTopics(response.data.topics.slice(0, 12));
    } catch (error) {
      console.error('Failed to load popular topics:', error);
    }
  };

  const handleTopicClick = async (topic) => {
    setCurrentTopic(topic);
    setIsLoading(true);
    
    try {
      const { explainAPI } = await import('@/lib/api');
      const response = await explainAPI.explain(topic);
      setCurrentExplanation(response.data.content);
    } catch (error) {
      console.error('Failed to load topic:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (topics.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-16"
    >
      <div className="flex items-center gap-2 mb-6 justify-center">
        <TrendingUp className="w-5 h-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-neutral-700">
          Popular Topics
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {topics.map((topic, index) => (
          <motion.button
            key={topic.topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            onClick={() => handleTopicClick(topic.topic)}
            className="card p-4 text-left hover:shadow-xl hover:scale-105 transition-all duration-200 group"
          >
            <p className="font-medium text-neutral-800 capitalize group-hover:text-primary-600">
              {topic.topic}
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              {topic.uses} views
            </p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
