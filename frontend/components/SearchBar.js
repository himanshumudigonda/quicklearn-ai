import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { explainAPI } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { setCurrentExplanation, setCurrentTopic, setIsLoading, user } = useStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setCurrentTopic(query);
    
    try {
      const response = await explainAPI.explain(query, user?.uid);
      setCurrentExplanation(response.data.content);
      toast.success(`Answer ready! (${response.data.cached ? 'cached' : 'fresh'})`);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to get explanation. Please try again.');
      setCurrentExplanation(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      className={`${compact ? 'mb-0' : 'mb-0'} w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative group">
        <motion.div
          className={`relative flex items-center ${
            compact ? 'max-w-2xl mx-auto' : 'max-w-3xl mx-auto'
          }`}
          animate={{
            scale: isFocused ? 1.02 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
          
          <div className="relative flex w-full items-center bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 focus-within:border-indigo-400 focus-within:shadow-xl transition-all duration-300">
            <Sparkles className="ml-5 w-5 h-5 text-gray-400" />
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Ask me anything..."
              className={`flex-1 px-4 ${
                compact ? 'py-4 text-base' : 'py-5 sm:py-6 text-base sm:text-lg'
              } bg-transparent outline-none text-gray-900 placeholder-gray-400`}
              autoFocus={!compact}
            />
            
            <motion.button
              type="submit"
              className={`mr-2 ${
                compact ? 'px-6 py-3' : 'px-8 py-3 sm:py-4'
              } bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
              {!compact && <span className="hidden sm:inline">Generate</span>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.form>
  );
}
