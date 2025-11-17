import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { explainAPI } from '@/lib/api';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function SearchBar({ compact = false }) {
  const [query, setQuery] = useState('');
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
      className={`${compact ? 'mb-8' : 'mb-8'} w-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything... (e.g., Ohm's law, photosynthesis)"
          className={`input pr-12 ${compact ? 'text-base' : 'text-lg'} shadow-lg`}
          autoFocus={!compact}
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary p-2.5 rounded-lg"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {!compact && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Photosynthesis', 'Quantum entanglement', 'Blockchain', 'DNA replication'].map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => setQuery(topic)}
              className="px-4 py-2 bg-white rounded-full text-sm text-neutral-700 hover:bg-primary-100 hover:text-primary-700 transition-colors shadow-sm"
            >
              {topic}
            </button>
          ))}
        </div>
      )}
    </motion.form>
  );
}
