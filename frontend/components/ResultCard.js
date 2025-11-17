import { motion } from 'framer-motion';
import { Copy, Download, Volume2, VolumeX, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { speakText, stopSpeech, copyToClipboard, downloadAsPDF } from '@/lib/utils';
import useStore from '@/lib/store';
import toast from 'react-hot-toast';

export default function ResultCard({ topic, content }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { favorites, addFavorite, removeFavorite } = useStore();
  
  const isFav = favorites.some((f) => f.topic === topic);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      const text = `${topic}. ${content.one_line}. ${content.explanation}. ${content.analogy}. ${content.example}.`;
      speakText(text);
      setIsSpeaking(true);
      
      setTimeout(() => setIsSpeaking(false), text.length * 50);
    }
  };

  const handleCopy = async () => {
    const text = `${topic.toUpperCase()}\n\n${content.one_line}\n\n${content.explanation}\n\nAnalogy: ${content.analogy}\n\nExample: ${content.example}\n\nRevision: ${content.revision_note}`;
    const success = await copyToClipboard(text);
    if (success) toast.success('Copied to clipboard!');
  };

  const handleDownload = () => {
    downloadAsPDF(topic, content);
    toast.success('Downloaded!');
  };

  const handleFavorite = () => {
    if (isFav) {
      removeFavorite(topic);
      toast.success('Removed from favorites');
    } else {
      addFavorite(topic, content);
      toast.success('Added to favorites!');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden"
    >
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 sm:px-8 py-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white capitalize">
          {topic}
        </h2>
      </div>

      <div className="px-6 sm:px-8 py-6 sm:py-8">
        {/* Content Sections */}
        <div className="space-y-6">
          {/* One-line definition */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">
                Definition
              </h3>
            </div>
            <p className="text-lg sm:text-xl text-gray-900 font-semibold leading-relaxed">
              {content.one_line}
            </p>
          </section>

          {/* Explanation */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-purple-500 rounded-full"></div>
              <h3 className="text-sm font-bold text-purple-600 uppercase tracking-wide">
                Detailed Explanation
              </h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {content.explanation}
            </p>
          </section>

          {/* Analogy */}
          <section className="bg-gradient-to-br from-indigo-50 to-purple-50 p-5 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-700 uppercase tracking-wide">
                Simple Analogy
              </h3>
            </div>
            <p className="text-base text-gray-800 italic leading-relaxed">
              {content.analogy}
            </p>
          </section>

          {/* Example */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-5 bg-green-500 rounded-full"></div>
              <h3 className="text-sm font-bold text-green-600 uppercase tracking-wide">
                Real Example
              </h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed">
              {content.example}
            </p>
          </section>

          {/* Formula (if exists) */}
          {content.formula && (
            <section className="bg-gray-100 p-5 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-5 bg-gray-600 rounded-full"></div>
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                  Formula
                </h3>
              </div>
              <p className="text-lg text-gray-900 font-mono bg-white p-3 rounded-lg border border-gray-200">
                {content.formula}
              </p>
            </section>
          )}

          {/* Quick Revision */}
          <section className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-xl border-l-4 border-orange-400">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">⚡</span>
              <h3 className="text-sm font-bold text-orange-700 uppercase tracking-wide">
                Quick Revision
              </h3>
            </div>
            <p className="text-base text-gray-800 font-semibold leading-relaxed">
              {content.revision_note}
            </p>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <motion.button
            onClick={handleSpeak}
            className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 flex items-center gap-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isSpeaking ? 'Stop' : 'Listen'}
          </motion.button>
          
          <motion.button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 flex items-center gap-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Copy className="w-4 h-4" />
            Copy
          </motion.button>
          
          <motion.button
            onClick={handleDownload}
            className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 flex items-center gap-2"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
          
          <motion.button
            onClick={handleFavorite}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              isFav 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
            {isFav ? 'Saved' : 'Save'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
