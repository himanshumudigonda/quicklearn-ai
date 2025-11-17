import { motion } from 'framer-motion';
import { Copy, Download, Volume2, VolumeX, Star, CheckCircle } from 'lucide-react';
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
      
      // Reset after approximate duration
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
      className="card mt-8"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-3xl font-bold text-neutral-900 capitalize">
          {topic}
        </h2>
        {content.verified && (
          <span className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
            <CheckCircle className="w-4 h-4" />
            Verified
          </span>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* One-line definition */}
        <section>
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
            Definition
          </h3>
          <p className="text-lg text-neutral-800 font-medium">
            {content.one_line}
          </p>
        </section>

        {/* Explanation */}
        <section>
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
            Explanation
          </h3>
          <p className="text-neutral-700 leading-relaxed">
            {content.explanation}
          </p>
        </section>

        {/* Analogy */}
        <section className="bg-primary-50 p-4 rounded-lg">
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wide mb-2">
            💡 Analogy
          </h3>
          <p className="text-neutral-700 italic">
            {content.analogy}
          </p>
        </section>

        {/* Example */}
        <section>
          <h3 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-2">
            Example
          </h3>
          <p className="text-neutral-700">
            {content.example}
          </p>
        </section>

        {/* Formula (if exists) */}
        {content.formula && (
          <section className="bg-neutral-100 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-neutral-700 uppercase tracking-wide mb-2">
              Formula
            </h3>
            <p className="text-neutral-900 font-mono text-lg">
              {content.formula}
            </p>
          </section>
        )}

        {/* Quick Revision */}
        <section className="bg-gradient-to-r from-primary-100 to-primary-50 p-4 rounded-lg border-l-4 border-primary-500">
          <h3 className="text-sm font-semibold text-primary-700 uppercase tracking-wide mb-2">
            ⚡ 10-Second Revision
          </h3>
          <p className="text-neutral-800 font-medium">
            {content.revision_note}
          </p>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-3">
        <button
          onClick={handleSpeak}
          className="btn-secondary flex items-center gap-2"
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          {isSpeaking ? 'Stop' : 'Read Aloud'}
        </button>
        
        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        
        <button
          onClick={handleDownload}
          className="btn-secondary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        
        <button
          onClick={handleFavorite}
          className={`btn flex items-center gap-2 ${
            isFav ? 'bg-primary-500 text-white' : 'btn-secondary'
          }`}
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
          {isFav ? 'Saved' : 'Save'}
        </button>
      </div>
    </motion.div>
  );
}
