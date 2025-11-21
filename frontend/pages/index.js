import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Zap, Sparkles, BookOpen, Share2, 
  ThumbsUp, ThumbsDown, RotateCcw, X, 
  ChevronRight, Loader2, Menu, User, Flame, Trophy, Download,
  Mail, Send, Heart, Github, Twitter, LogOut, ChevronDown
} from 'lucide-react';
import { explainAPI, verifyAPI, authAPI, feedbackAPI } from '../lib/api';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';
import { getStreak, updateStreak, getStreakEmoji } from '../lib/streak';
import { createMemeText } from '../lib/meme';

// --- UTILS ---
const gradients = {
  primary: "from-blue-500 via-purple-500 to-pink-500",
  surface: "bg-gray-900/50 backdrop-blur-xl border border-white/10",
  glow: "shadow-[0_0_30px_rgba(124,58,237,0.3)]"
};

// --- COMPONENTS ---

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients.primary} flex items-center justify-center shadow-lg`}>
      <Zap className="text-white w-6 h-6 fill-current" />
    </div>
    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
      QuickLearn
    </span>
  </div>
);

const ProfileDropdown = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-64 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img 
                  src={user.avatar} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">{user.name}</p>
                  <p className="text-gray-400 text-sm truncate">{user.email}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onSignOut();
              }}
              className="w-full px-4 py-3 flex items-center gap-3 text-gray-300 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

const ExplanationCard = ({ data, onClose, user }) => {
  const { topic, content, source } = data;
  const [liked, setLiked] = useState(null); // null, 'like', or 'dislike'
  
  const handleLike = async (rating) => {
    try {
      await feedbackAPI.submit(user?.uid, topic, rating, null);
      setLiked(rating);
      toast.success(rating === 'like' ? '👍 Thanks for the feedback!' : '👎 We\'ll improve!');
    } catch (error) {
      console.error('Feedback error:', error);
    }
  };
  
  const handleGenerateMeme = () => {
    const meme = createMemeText(topic, content);
    const memeText = `${meme.title}\n\n${meme.subtitle}\n\n#QuickLearnAI #${topic.replace(/\s+/g, '')}`;
    
    navigator.clipboard.writeText(memeText);
    toast.success('Meme copied! 🎭 Paste it on Twitter/Instagram!');
  };
  
  const handleShare = () => {
    const shareText = `Learn ${topic} in 60 seconds with QuickLearn AI! 🚀`;
    
    if (navigator.share) {
      navigator.share({
        title: `Learn ${topic}`,
        text: shareText,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`);
      toast.success('Link copied! Share with friends! 🔗');
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`w-full max-w-2xl mx-auto ${gradients.surface} rounded-3xl overflow-hidden shadow-2xl relative`}
    >
      {/* Header */}
      <div className="p-8 border-b border-white/10 relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none`} />
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">{topic}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-8">
        <section>
          <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-3">Definition</h3>
          <p className="text-xl text-gray-100 leading-relaxed font-medium">
            {content.one_line}
          </p>
        </section>

        <section>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-blue-400 uppercase tracking-wider mb-3">
            <BookOpen className="w-4 h-4" /> Simple Explanation
          </h3>
          <p className="text-gray-300 leading-relaxed">
            {content.explanation}
          </p>
        </section>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-pink-400 uppercase tracking-wider mb-3">
            <Zap className="w-4 h-4" /> Analogy
          </h3>
          <p className="text-gray-300 leading-relaxed italic">
            "{content.analogy}"
          </p>
        </div>

        {content.example && (
          <section className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 rounded-2xl border border-white/5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Real World Example</h3>
            <p className="text-gray-200">{content.example}</p>
          </section>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-6 bg-black/20 flex justify-between items-center flex-wrap gap-3">
        <div className="flex gap-2">
          <button 
            onClick={() => handleLike('like')}
            className={`p-2 transition-all ${
              liked === 'like' 
                ? 'text-green-400 scale-110' 
                : 'text-gray-400 hover:text-green-400'
            }`}
          >
            <ThumbsUp className={`w-5 h-5 ${liked === 'like' ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={() => handleLike('dislike')}
            className={`p-2 transition-all ${
              liked === 'dislike' 
                ? 'text-red-400 scale-110' 
                : 'text-gray-400 hover:text-red-400'
            }`}
          >
            <ThumbsDown className={`w-5 h-5 ${liked === 'dislike' ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateMeme}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-4 h-4" /> Generate Meme
          </button>
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:border-white/20"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const SearchScreen = ({ user, onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />

      <div className="w-full max-w-3xl relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Learn anything in <br />
            <span className={`bg-clip-text text-transparent bg-gradient-to-r ${gradients.primary}`}>
              60 Seconds
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            The fastest way to understand complex topics. Powered by advanced AI.
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className={`w-full ${gradients.surface} p-2 rounded-2xl flex items-center shadow-2xl transition-all focus-within:ring-2 ring-purple-500/50`}
        >
          <div className="p-4">
            <Search className="w-6 h-6 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to learn? (e.g. Quantum Physics, ROI, Photosynthesis)"
            className="w-full bg-transparent text-xl text-white placeholder-gray-500 focus:outline-none h-12"
            autoFocus
          />
          <button 
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`px-8 py-3 rounded-xl bg-gradient-to-r ${gradients.primary} text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ChevronRight className="w-5 h-5" />}
            <span className="hidden md:inline">Explain</span>
          </button>
        </motion.form>

        {/* Suggestions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {['Black Holes', 'Compound Interest', 'Machine Learning', 'The Renaissance'].map((tag) => (
            <button
              key={tag}
              onClick={() => onSearch(tag)}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    setIsSubmitting(true);
    try {
      // Using Formspree or mailto link
      const mailtoLink = `mailto:infinitetsukuyomi035@gmail.com?subject=QuickLearn AI Feedback&body=${encodeURIComponent(feedbackText)}`;
      window.location.href = mailtoLink;
      
      toast.success('Opening your email client! 📧');
      setFeedbackText('');
    } catch (error) {
      toast.error('Could not open email client');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-transparent to-black/50 border-t border-white/5 mt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Feedback Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Mail className="w-6 h-6 text-purple-400" />
              Send us your feedback
            </h3>
            <p className="text-gray-400 mb-6">Help us improve QuickLearn AI</p>
            <form onSubmit={handleFeedbackSubmit} className="flex gap-2">
              <input
                type="text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your thoughts, ideas, or report issues..."
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !feedbackText.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/5">
          {/* Left - Logo & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo />
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} QuickLearn AI. All rights reserved.
            </p>
          </div>

          {/* Center - Made with Love */}
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
            <span>for learners worldwide</span>
          </div>

          {/* Right - Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/himanshumudigonda/quicklearn-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:infinitetsukuyomi035@gmail.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LoginScreen = ({ onLogin, isLoading }) => (
  <div className="min-h-screen flex items-center justify-center p-6 bg-black">
    <div className="text-center space-y-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20"
      >
        <Zap className="w-12 h-12 text-white" />
      </motion.div>
      
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">QuickLearn AI</h1>
        <p className="text-gray-400">Your personal knowledge accelerator</p>
      </div>

      <div className="space-y-4 w-full max-w-xs mx-auto">
        <button
          onClick={onLogin}
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : (
            <>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="G" />
              Continue with Google
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);



// --- MAIN APP ---

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login'); // login, search, result
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState({ currentStreak: 0, bestStreak: 0 });
  const [authChecking, setAuthChecking] = useState(true);

  // Check for existing Firebase session on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, restore session
        try {
          const idToken = await firebaseUser.getIdToken();
          let backendData = {};
          
          // Try to sync with backend
          try {
            const response = await authAPI.login(idToken);
            backendData = response.data;
            localStorage.setItem('session_token', backendData.sessionToken);
          } catch (backendError) {
            console.warn('Backend sync failed, using cached data');
          }

          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: backendData.nickname || firebaseUser.displayName,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendData.avatarSeed || firebaseUser.uid}`
          };

          // Save to localStorage as backup
          localStorage.setItem('user_data', JSON.stringify(userData));
          
          setUser(userData);
          setView('search');
          
          // Load streak data
          const streakData = getStreak(firebaseUser.uid);
          setStreak(streakData);
        } catch (error) {
          console.error('Session restore error:', error);
        }
      } else {
        // No user logged in
        setUser(null);
        setView('login');
        localStorage.removeItem('user_data');
        localStorage.removeItem('session_token');
      }
      setAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const streakData = getStreak(user.uid);
      setStreak(streakData);
    }
  }, [user]);

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setView('login');
      setResult(null);
      setStreak({ currentStreak: 0, bestStreak: 0 });
      localStorage.removeItem('user_data');
      localStorage.removeItem('session_token');
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  // Handle Login
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // 1. Google Sign In
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      let backendData = {};
      try {
        // 2. Backend Sync (Optional)
        const response = await authAPI.login(idToken);
        backendData = response.data;
        localStorage.setItem('session_token', backendData.sessionToken);
      } catch (backendError) {
        console.warn("Backend sync failed, continuing in offline mode:", backendError);
        toast.error("Connected in offline mode (Backend unavailable)");
      }
      
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        name: backendData.nickname || result.user.displayName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendData.avatarSeed || result.user.uid}`
      };

      // Save to localStorage
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);
      setView('search');
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled");
      } else if (err.code === 'auth/unauthorized-domain') {
        toast.error("Domain not authorized in Firebase Console");
      } else {
        toast.error("Login failed. Try Guest Mode.");
      }
    } finally {
      setIsLoading(false);
    }
  };



  // Handle Search
  const handleSearch = async (topic) => {
    setIsLoading(true);
    try {
      // Call Real API
      const response = await explainAPI.explain(topic, user?.uid);
      setResult(response.data);
      setView('result');
      
      // Update streak when user learns something
      const newStreak = updateStreak(user.uid);
      setStreak(newStreak);
      
      // Show celebration for milestones
      if (newStreak.currentStreak % 7 === 0) {
        toast.success(`🔥 ${newStreak.currentStreak} day streak! You're on fire!`, { duration: 4000 });
      } else if (newStreak.currentStreak > streak.currentStreak) {
        toast.success(`${getStreakEmoji(newStreak.currentStreak)} Day ${newStreak.currentStreak} streak!`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not generate explanation. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseResult = () => {
    setResult(null);
    setView('search');
  };

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-purple-500/30">
      <Head>
        <title>QuickLearn AI - Learn Fast</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Learn anything in 1 minute with AI-powered explanations" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="icon" type="image/svg+xml" href="/icon0.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon1.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      {/* Navbar (only when logged in) */}
      {user && (
        <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center pointer-events-none">
          <div className="pointer-events-auto">
            <Logo />
          </div>
          <div className="pointer-events-auto flex items-center gap-4">
            {/* Streak Display */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-full shadow-lg"
            >
              <Flame className="w-5 h-5 text-white" />
              <span className="text-white font-bold text-lg">{streak.currentStreak}</span>
              {streak.bestStreak > streak.currentStreak && (
                <div className="flex items-center gap-1 ml-2 text-yellow-300">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">{streak.bestStreak}</span>
                </div>
              )}
            </motion.div>
            <ProfileDropdown user={user} onSignOut={handleSignOut} />
          </div>
        </nav>
      )}

      <AnimatePresence mode="wait">
        {authChecking ? (
          <motion.div key="loading" className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
          </motion.div>
        ) : view === 'login' ? (
          <motion.div key="login" exit={{ opacity: 0 }}>
            <LoginScreen onLogin={handleLogin} isLoading={isLoading} />
          </motion.div>
        ) : null}

        {view === 'search' && (
          <motion.div key="search" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SearchScreen user={user} onSearch={handleSearch} isLoading={isLoading} />
            <Footer />
          </motion.div>
        )}

        {view === 'result' && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="min-h-screen flex flex-col items-center justify-center p-6 pt-24"
          >
            <ExplanationCard data={result} onClose={handleCloseResult} user={user} />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

