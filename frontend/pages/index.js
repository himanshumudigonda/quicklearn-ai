import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Search,
  Volume2,
  Copy,
  Heart,
  CheckCircle,
  Bookmark,
  Compass,
  X,
  RefreshCw,
  LogOut,
  AlignLeft,
  GitPullRequest,
  Eye,
  BarChart2,
  Clock,
  Loader2
} from 'lucide-react';

// --- MOCK API ---
const mockApi = {
  login: () =>
    new Promise((resolve) =>
      setTimeout(() => {
        const uid = 'mock-uid-' + Date.now();
        const nickname = makeNickname(uid);
        const avatarSeed = uid;
        resolve({ uid, nickname, avatarSeed });
      }, 600)
    ),
  explain: (topic) =>
    new Promise((resolve) =>
      setTimeout(() => {
        const normalized = topic.toLowerCase();
        resolve({
          topic: normalized,
          source: 'mini',
          content: {
            one_line: `${topic} is a useful concept you can learn quickly.`,
            explanation: `A concise, 1-minute explanation of ${topic}.`,
            analogy: `Think of ${topic} as...`,
            example: `Example: ${topic} in practice.`,
            formula: '',
            revision_note: `Quick takeaway about ${topic}.`,
            verified: false
          },
          cached: false
        });
      }, 400)
    ),
  verify: (topic) =>
    new Promise((resolve) => setTimeout(() => resolve({ job_id: 'mock-job-' + Date.now() }), 300))
};

// --- HELPERS ---
const ADJS = ['Turbo', 'Silly', 'Cosmic', 'Nimble', 'Pixel', 'Mango', 'Zippy', 'Bouncy', 'Giga', 'Fuzzy', 'Clever', 'Bright', 'Quick', 'Wise'];
const NOUNS = ['Papaya', 'Otter', 'Noodle', 'Robot', 'Marshmallow', 'Penguin', 'Cactus', 'Comet', 'Waffle', 'Squirrel', 'Koala', 'Panda', 'Rocket'];

function hashToInt(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) + str.charCodeAt(i);
  return Math.abs(h);
}

function makeNickname(seed) {
  const h = hashToInt(seed);
  const a = ADJS[h % ADJS.length];
  const n = NOUNS[Math.floor(h / ADJS.length) % NOUNS.length];
  const num = (h % 1000).toString().padStart(3, '0');
  return `${a}-${n}-${num}`;
}

function avatarDataURI(seed) {
  const h = hashToInt(seed.toString());
  const bg = ['#FFD966', '#F28C8C', '#9AD3BC', '#C6B1E1', '#FFD9A6', '#A0E7E5', '#FDACAC', '#B4E1FF'][h % 8];
  const s1 = (h >> 3) % 360;
  const s2 = (h >> 7) % 360;
  const shapeType = h % 3;
  let shape1, shape2;
  if (shapeType === 0) {
    shape1 = `<circle cx='22' cy='22' r='10' fill='hsl(${s1},70%,60%)' opacity='0.9'/>`;
    shape2 = `<rect x='36' y='36' width='14' height='14' rx='3' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
  } else if (shapeType === 1) {
    shape1 = `<rect x='16' y='16' width='14' height='14' rx='3' fill='hsl(${s1},70%,60%)' opacity='0.9' transform='rotate(15 23 23)'/>`;
    shape2 = `<path d='M 32 32 L 48 32 L 40 48 Z' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
  } else {
    shape1 = `<path d='M 16 30 L 32 16 L 32 30 Z' fill='hsl(${s1},70%,60%)' opacity='0.9'/>`;
    shape2 = `<circle cx='40' cy='40' r='10' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><rect width='64' height='64' rx='12' fill='${bg}'/>${shape1}${shape2}</svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function speakText(text, onEnd) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.onend = onEnd; u.lang = 'en-US'; u.rate = 1; u.pitch = 1; window.speechSynthesis.speak(u);
}

// --- COMPONENTS ---
const Spinner = ({ size = 'h-12 w-12' }) => <Loader2 className={`${size} text-amber-500 animate-spin`} />;

const ResultSkeleton = () => (
  <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg space-y-4 animate-pulse">
    <div className="h-6 bg-slate-700 rounded-md w-3/4"></div>
    <div className="h-4 bg-slate-700 rounded-md w-full"></div>
    <div className="h-4 bg-slate-700 rounded-md w-5/6"></div>
  </div>
);

const ResultSection = ({ title, content }) => {
  if (!content) return null;
  const icons = { Spark: <Zap className='w-5 h-5 text-amber-400' />, Explanation: <AlignLeft className='w-5 h-5 text-amber-400' /> };
  return (
    <div>
      <div className='flex items-center space-x-2'>{icons[title] || <CheckCircle className='w-5 h-5 text-amber-400' />}<h4 className='text-sm text-slate-400 uppercase tracking-wide'>{title}</h4></div>
      <p className='text-slate-100 mt-2'>{content}</p>
    </div>
  );
};

const ResultCard = ({ data, onVerify, showToast }) => {
  const { topic, content } = data;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const text = [topic, content.one_line, content.explanation].filter(Boolean).join('. ');
  
  const handleSpeak = () => { 
    if (isSpeaking) { 
      window.speechSynthesis.cancel(); 
      setIsSpeaking(false); 
    } else { 
      setIsSpeaking(true); 
      speakText(text, () => setIsSpeaking(false)); 
    } 
  };
  
  const handleCopy = () => { 
    navigator.clipboard?.writeText(text); 
    showToast('Copied!'); 
  };
  
  const handleSave = () => { 
    setIsSaved(!isSaved); 
    showToast(isSaved ? 'Removed' : 'Saved'); 
  };

  return (
    <div className='bg-slate-800/70 p-6 rounded-2xl shadow-md'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='text-2xl font-bold text-white'>{topic}</h3>
          <p className='text-slate-400 mt-1'>{content.one_line}</p>
        </div>
        <div className='flex gap-2'>
          <button onClick={handleSpeak} className='text-slate-400 hover:text-amber-400'><Volume2 /></button>
          <button onClick={handleCopy} className='text-slate-400 hover:text-amber-400'><Copy /></button>
          <button onClick={handleSave} className='text-slate-400 hover:text-red-500'><Heart className={isSaved ? 'text-red-500' : ''} /></button>
        </div>
      </div>
      <div className='mt-4 space-y-4'>
        <ResultSection title='Explanation' content={content.explanation} />
        <ResultSection title='Analogy' content={content.analogy} />
        <ResultSection title='Example' content={content.example} />
      </div>
      {!content.verified && (
        <div className='mt-4'>
          <button onClick={onVerify} className='w-full bg-white text-slate-900 rounded-lg py-3'>Request Verified Answer</button>
        </div>
      )}
    </div>
  );
};

const ProfileModal = ({ user, onClose, onRegenerate, onSignOut, show }) => {
  if (!show || !user) return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
          <div className='bg-gray-800 p-6 rounded-2xl text-white relative'>
            <button onClick={onClose} className='absolute top-4 right-4 text-slate-400 hover:text-white'><X /></button>
            <div className='flex flex-col items-center'>
              <img src={avatarDataURI(user.avatarSeed)} alt='avatar' className='w-24 h-24 rounded-2xl mb-4' />
              <h3 className='text-xl font-semibold'>{user.nickname}</h3>
              <div className='flex gap-2 mt-4'>
                <button onClick={onRegenerate} className='px-3 py-2 bg-white/10 rounded flex items-center gap-2'><RefreshCw size={16}/> Regenerate</button>
                <button onClick={onSignOut} className='px-3 py-2 bg-red-500/20 text-red-400 rounded flex items-center gap-2'><LogOut size={16}/> Sign Out</button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const LoginScreen = ({ onLogin, isLoading }) => (
  <div className='min-h-screen flex items-center justify-center p-6'>
    <div className='max-w-md w-full text-center'>
      <div className='w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl mx-auto flex items-center justify-center shadow'>
        <Zap className='w-6 h-6 text-white' />
      </div>
      <h1 className='text-4xl text-white font-bold mt-6'>QuickLearn AI</h1>
      <p className='text-slate-400 mt-2'>Get 1-minute explanations for any topic. Instantly.</p>
      {isLoading ? <div className='mt-10 flex justify-center'><Spinner /></div> : <button onClick={onLogin} className='mt-10 w-full bg-white text-slate-700 py-3 rounded-lg font-semibold'>Sign in (mock)</button>}
    </div>
  </div>
);

const MainScreen = ({ user, onSignOut }) => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const showToast = (msg) => { console.log(msg); }; // Placeholder

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true); setExplanation(null);
    const data = await mockApi.explain(topic);
    setExplanation(data);
    setIsLoading(false);
  };

  const handleVerify = async () => { 
    if (!explanation) return; 
    await mockApi.verify(explanation.topic); 
    setExplanation(prev => ({ ...prev, content: { ...prev.content, verified: true } })); 
    showToast('Verified'); 
  };

  const handleRegenerate = () => {
    // In a real app, update user state
    console.log("Regenerate nickname");
  };

  return (
    <div className='max-w-3xl mx-auto p-4 sm:p-6'>
      <header className='flex items-center justify-between py-4'>
        <div className='flex items-center gap-2'>
          <div className='w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-400 rounded flex items-center justify-center'><Zap className='w-5 h-5 text-white' /></div>
          <span className='text-xl text-white font-bold'>QuickLearn</span>
        </div>
        <button onClick={() => setShowProfile(true)} className='rounded-full w-10 h-10 overflow-hidden border-2 border-transparent hover:border-amber-400 transition-colors'>
          <img src={avatarDataURI(user.avatarSeed)} className='w-full h-full' alt='avatar' />
        </button>
      </header>
      
      <h2 className='text-2xl text-white mt-6'>Welcome, <span className='text-amber-400'>{user.nickname}</span>!</h2>
      <p className='text-slate-400 mt-2'>What do you want to learn today?</p>
      
      <form onSubmit={handleSearch} className='mt-6 relative'>
        <input 
          value={topic} 
          onChange={(e) => setTopic(e.target.value)} 
          placeholder="e.g., Photosynthesis" 
          className='w-full h-14 rounded-xl bg-gray-800/50 px-4 pr-16 text-white border border-white/10 focus:border-amber-400 focus:outline-none' 
        />
        <button type='submit' className='absolute right-2 top-1/2 -translate-y-1/2 bg-amber-400 p-2 rounded-lg text-slate-900 hover:bg-amber-300 transition-colors'>
          <Search className='w-5 h-5' />
        </button>
      </form>
      
      <div className='mt-6'>
        {isLoading && <ResultSkeleton />}
        {explanation && <ResultCard data={explanation} onVerify={handleVerify} showToast={showToast} />}
      </div>
      
      <ProfileModal show={showProfile} user={user} onClose={() => setShowProfile(false)} onRegenerate={handleRegenerate} onSignOut={onSignOut} />
    </div>
  );
};

export default function App() {
  const [screen, setScreen] = useState('login');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    const u = await mockApi.login();
    setUser(u);
    setScreen('main');
    setIsLoading(false);
  }, []);

  const handleSignOut = useCallback(() => { 
    setUser(null); 
    setScreen('login'); 
  }, []);

  return (
    <div className="bg-gray-900 text-slate-100 min-h-screen antialiased relative overflow-hidden">
        <Head>
            <title>QuickLearn AI</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-900/20 to-gray-900/0 blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
            <AnimatePresence mode="wait">
                {screen === 'login' && (
                    <motion.div key="login" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <LoginScreen onLogin={handleLogin} isLoading={isLoading} />
                    </motion.div>
                )}
                {screen === 'main' && user && (
                    <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                        <MainScreen user={user} onSignOut={handleSignOut} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}
