import React, { useState, useEffect, useCallback } from 'react';
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
import { signInWithGoogle, signOut as handleSignOut } from '@/lib/auth';
import useStore from '@/lib/store';
import { explainAPI, verifyAPI, authAPI } from '@/lib/api';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// --- NICKNAME & AVATAR GENERATORS ---
const ADJS = ['Turbo','Silly','Cosmic','Nimble','Pixel','Mango','Zippy','Bouncy','Giga','Fuzzy','Clever','Bright','Quick','Wise'];
const NOUNS = ['Papaya','Otter','Noodle','Robot','Marshmallow','Penguin','Cactus','Comet','Waffle','Squirrel','Koala','Panda','Rocket'];

function hashToInt(str){
    let h = 5381;
    for (let i=0; i<str.length; i++) h = ((h<<5)+h) + str.charCodeAt(i);
    return Math.abs(h);
}

function makeNickname(seed){
    const h = hashToInt(seed);
    const a = ADJS[h % ADJS.length];
    const n = NOUNS[Math.floor(h / ADJS.length) % NOUNS.length];
    const num = (h % 1000).toString().padStart(3,'0');
    return `${a}-${n}-${num}`;
}

function avatarDataURI(seed){
    const h = hashToInt(seed.toString());
    const bg = ['#FFD966','#F28C8C','#9AD3BC','#C6B1E1','#FFD9A6', '#A0E7E5', '#FDACAC', '#B4E1FF'][h%8];
    const s1 = (h >> 3) % 360;
    const s2 = (h >> 7) % 360;
    const shapeType = h % 3;
    
    let shape1, shape2;

    switch(shapeType) {
        case 0:
            shape1 = `<circle cx='22' cy='22' r='10' fill='hsl(${s1},70%,60%)' opacity='0.9'/>`;
            shape2 = `<rect x='36' y='36' width='14' height='14' rx='3' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
            break;
        case 1:
            shape1 = `<rect x='16' y='16' width='14' height='14' rx='3' fill='hsl(${s1},70%,60%)' opacity='0.9' transform='rotate(15 23 23)'/>`;
            shape2 = `<path d='M 32 32 L 48 32 L 40 48 Z' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
            break;
        case 2:
        default:
            shape1 = `<path d='M 16 30 L 32 16 L 32 30 Z' fill='hsl(${s1},70%,60%)' opacity='0.9'/>`;
            shape2 = `<circle cx='40' cy='40' r='10' fill='hsl(${s2},70%,60%)' opacity='0.9'/>`;
            break;
    }

    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
        <rect width='64' height='64' rx='12' fill='${bg}'/>
        ${shape1}
        ${shape2}
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// --- TEXT-TO-SPEECH (TTS) ---
function speakText(text, onEnd) {
    if (!window.speechSynthesis) {
        alert('TTS not supported in your browser');
        return;
    }
    window.speechSynthesis.cancel();
    
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 1.0;
    u.pitch = 1.0;
    u.lang = 'en-US';
    u.onend = onEnd;
    
    window.speechSynthesis.speak(u);
}

// --- SUB-COMPONENTS ---

// Google Icon SVG
const GoogleIcon = () => (
    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.954 4 4 12.954 4 24s8.954 20 20 20s20-8.954 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="m24 44c5.166 0 9.86-1.977 13.437-5.43l-5.657-5.657C30.153 36.236 27.211 38 24 38c-5.22 0-9.655-3.108-11.127-7.491l-6.571 4.819C9.656 40.663 16.318 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.303 5.531l5.657 5.657C40.092 34.631 44 27.926 44 20c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

// Loading Spinner
const Spinner = ({ size = "h-12 w-12" }) => (
    <Loader2 className={`${size} text-amber-500 animate-spin`} />
);

// Skeleton Loader
const ResultSkeleton = () => (
    <div className="bg-slate-800/60 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-lg space-y-4 animate-pulse">
        <div className="h-6 bg-slate-700 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-700 rounded-md w-full"></div>
        <div className="h-4 bg-slate-700 rounded-md w-5/6"></div>
        <div className="h-10 bg-slate-700 rounded-lg w-1/3 mt-4"></div>
        <div className="h-4 bg-slate-700 rounded-md w-1/2 pt-4"></div>
        <div className="h-4 bg-slate-700 rounded-md w-full"></div>
    </div>
);

// Animated Toast Notification
const Toast = ({ message, show }) => (
    <AnimatePresence>
        {show && (
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50"
            >
                <span>{message}</span>
            </motion.div>
        )}
    </AnimatePresence>
);

// Section Component for Result Card
const ResultSection = ({ title, content }) => {
    if (!content) return null;

    const iconMap = {
        'Spark': <Zap className="w-5 h-5 text-amber-400" />,
        'Explanation': <AlignLeft className="w-5 h-5 text-amber-400" />,
        'Analogy': <GitPullRequest className="w-5 h-5 text-amber-400" />,
        'Example': <Eye className="w-5 h-5 text-amber-400" />,
        'Formula': <BarChart2 className="w-5 h-5 text-amber-400" />,
        '10s Revision': <Clock className="w-5 h-5 text-amber-400" />,
    };

    return (
        <div>
            <div className="flex items-center space-x-2">
                {iconMap[title] || <CheckCircle className="w-5 h-5 text-amber-400" />}
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">{title}</h4>
            </div>
            <p className="text-slate-100 text-base leading-relaxed mt-2">{content}</p>
        </div>
    );
};

// Result Card Component
const ResultCard = ({ data, onVerify, showToast }) => {
    const { topic, content } = data;
    const { one_line, explanation, analogy, example, formula, revision_note, verified } = content;
    const [isSpeaking, setIsSpeaking] = useState(false);
    const { favorites, addFavorite, removeFavorite } = useStore();
    const isSaved = favorites.some(f => f.topic === topic);

    const textToSpeak = [
        topic,
        `One-line definition: ${one_line}`,
        `Explanation: ${explanation}`,
        `Analogy: ${analogy}`,
        `Example: ${example}`,
        `Formula: ${formula}`,
        `Revision Note: ${revision_note}`
    ].filter(Boolean).join('. ');

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            setIsSpeaking(true);
            speakText(textToSpeak, () => setIsSpeaking(false));
        }
    };

    const handleCopy = () => {
        try {
            const tempInput = document.createElement('textarea');
            tempInput.value = textToSpeak;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast('Copied to clipboard!');
        } catch (err) {
            showToast('Failed to copy.');
        }
    };
    
    const handleSave = () => {
        if (isSaved) {
            removeFavorite(topic);
            showToast('Removed from favorites');
        } else {
            addFavorite(topic, content);
            showToast('Saved to favorites!');
        }
    };

    return (
        <div className="bg-slate-800/70 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white capitalize">{topic}</h3>
                        {verified ? (
                            <div className="mt-2 flex items-center space-x-1.5 text-green-400 font-medium">
                                <CheckCircle className="w-5 h-5" /><span>Verified</span>
                            </div>
                        ) : (
                            <div className="mt-2 flex items-center space-x-1.5 text-slate-400 font-medium">
                                <Bookmark className="w-5 h-5" /><span>Quick Draft</span>
                            </div>
                        )}
                    </div>
                    <div className="flex space-x-1">
                        <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={handleSpeak} 
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isSpeaking ? 'text-slate-900 bg-amber-400' : 'text-slate-400 hover:text-amber-400 hover:bg-white/10'}`} 
                            title="Read Aloud"
                        >
                            <Volume2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={handleCopy} 
                            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-white/10 rounded-full transition-colors" 
                            title="Copy Text"
                        >
                            <Copy className="w-5 h-5" />
                        </motion.button>
                        <motion.button 
                            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                            onClick={handleSave} 
                            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-white/10" 
                            title="Save to Favorites"
                        >
                            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current text-red-500' : 'text-slate-400 hover:text-red-500'}`} />
                        </motion.button>
                    </div>
                </div>

                <div className="mt-6 space-y-6">
                    <ResultSection title="Spark" content={one_line} />
                    <ResultSection title="Explanation" content={explanation} />
                    <ResultSection title="Analogy" content={analogy} />
                    <ResultSection title="Example" content={example} />
                    <ResultSection title="Formula" content={formula} />
                    <ResultSection title="10s Revision" content={revision_note} />
                </div>
            </div>
            
            {!verified && (
                <div className="bg-black/20 p-4 sm:px-6 sm:py-5 border-t border-white/10">
                    <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={onVerify} 
                        className="w-full sm:w-auto h-12 px-6 bg-white/90 text-slate-900 font-medium rounded-lg hover:bg-white transition-colors shadow-md flex items-center justify-center space-x-2"
                    >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span>Request Verified Answer</span>
                    </motion.button>
                </div>
            )}
        </div>
    );
};

// Profile Modal Component
const ProfileModal = ({ user, onClose, onRegenerate, onSignOut, show }) => {
    if (!user) return null;

    return (
        <AnimatePresence>
            {show && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 15 }}
                        className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-gray-800 rounded-2xl shadow-2xl p-6"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-white">Profile</h3>
                            <motion.button 
                                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                                onClick={onClose} 
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        
                        <div className="flex flex-col items-center mt-6">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white/10">
                                <img src={avatarDataURI(user.avatarSeed)} alt="User Avatar" className="w-full h-full object-cover" />
                            </div>
                            
                            <h2 className="mt-4 text-2xl font-bold text-amber-400">{user.nickname}</h2>
                            <p className="text-slate-400 mt-1">This is your anonymous nickname.</p>

                            <motion.button 
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={onRegenerate} 
                                className="mt-6 w-full h-12 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors flex items-center justify-center space-x-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Regenerate Nickname</span>
                            </motion.button>
                            
                            <motion.button 
                                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                onClick={onSignOut} 
                                className="mt-4 w-full h-12 bg-red-500/20 text-red-400 font-medium rounded-lg hover:bg-red-500/30 transition-colors flex items-center justify-center space-x-2"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sign Out</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// Login Screen Component
const LoginScreen = ({ onLogin, isLoading }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center min-h-screen p-8 text-center"
    >
        <div className="max-w-md w-full">
            <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="mx-auto w-20 h-20 bg-gradient-to-r from-amber-500 to-amber-400 rounded-3xl flex items-center justify-center shadow-lg"
            >
                <Zap className="w-10 h-10 text-white transform rotate-12" />
            </motion.div>
            
            <h1 className="mt-8 text-4xl font-bold text-white">QuickLearn AI</h1>
            <p className="mt-4 text-lg text-slate-400">Get 1-minute explanations for any topic. Instantly.</p>
            
            {isLoading ? (
                <div className="mt-12 flex justify-center">
                    <Spinner size="w-14 h-14" />
                </div>
            ) : (
                <motion.button 
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onLogin} 
                    className="mt-12 w-full max-w-sm h-14 bg-white text-slate-700 font-medium text-lg rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-3"
                >
                    <GoogleIcon />
                    <span>Sign in with Google</span>
                </motion.button>
            )}
        </div>
    </motion.div>
);

// Main Application Screen Component
const MainScreen = ({ user, onSignOut }) => {
    const [topic, setTopic] = useState('');
    const [explanation, setExplanation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [currentUser, setCurrentUser] = useState(user);
    const [toast, setToast] = useState({ show: false, message: '' });

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => {
            setToast({ show: false, message: '' });
        }, 2500);
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!topic.trim()) return;

        window.speechSynthesis.cancel();
        setIsLoading(true);
        setExplanation(null);

        try {
            const response = await explainAPI.explain(topic, currentUser.uid);
            setExplanation({
                topic: topic,
                source: response.data.source || "mini",
                content: {
                    one_line: response.data.one_line,
                    explanation: response.data.explanation,
                    analogy: response.data.analogy,
                    example: response.data.example,
                    formula: response.data.formula || '',
                    revision_note: response.data.revision_note,
                    verified: response.data.verified || false
                },
                cached: response.data.cached || false
            });
        } catch (err) {
            console.error('Explanation error:', err);
            showToast('Failed to fetch explanation. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setTopic(suggestion);
        (async () => {
            window.speechSynthesis.cancel();
            setIsLoading(true);
            setExplanation(null);
            try {
                const response = await explainAPI.explain(suggestion, currentUser.uid);
                setExplanation({
                    topic: suggestion,
                    source: response.data.source || "mini",
                    content: {
                        one_line: response.data.one_line,
                        explanation: response.data.explanation,
                        analogy: response.data.analogy,
                        example: response.data.example,
                        formula: response.data.formula || '',
                        revision_note: response.data.revision_note,
                        verified: response.data.verified || false
                    },
                    cached: response.data.cached || false
                });
            } catch (err) {
                console.error('Explanation error:', err);
                showToast('Failed to fetch explanation. Please try again.');
            } finally {
                setIsLoading(false);
            }
        })();
    };

    const handleVerifyRequest = async () => {
        if (!explanation) return;
        
        showToast('Verification requested...');
        try {
            await verifyAPI.verify(explanation.topic, currentUser.uid);
            showToast('Verification queued! Check back soon.');
        } catch (err) {
            console.error('Verify error:', err);
            showToast('Verification request failed.');
        }
    };

    const handleRegenerate = async () => {
        try {
            const response = await authAPI.regenerateNickname(currentUser.uid);
            const { nickname, avatarSeed } = response.data;
            const updatedUser = { ...currentUser, nickname, avatarSeed };
            setCurrentUser(updatedUser);
            useStore.getState().setNickname(nickname);
            useStore.getState().setAvatarSeed(avatarSeed);
            showToast('Nickname regenerated!');
        } catch (err) {
            console.error('Regenerate error:', err);
            showToast('Failed to regenerate nickname.');
        }
    };

    const suggestions = ['Photosynthesis', 'Ohm\'s Law', 'GDP', 'Python Loops', 'Mitochondria'];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto p-4 sm:p-6 pb-24"
        >
            <Head>
                <title>QuickLearn AI - Master Any Topic in 60 Seconds</title>
                <meta name="description" content="AI-powered learning platform. Get instant, concise explanations for any topic in under 1 minute." />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            </Head>

            <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-gray-900/50 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-400 rounded-lg flex items-center justify-center shadow">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white">QuickLearn</span>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => setShowProfile(true)} 
                        className="rounded-full w-10 h-10 flex items-center justify-center overflow-hidden shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
                    >
                        <img src={avatarDataURI(currentUser.avatarSeed)} alt="User Avatar" className="w-full h-full object-cover" />
                    </motion.button>
                </div>
            </header>

            <h2 className="text-2xl sm:text-3xl font-semibold text-white mt-8">
                Welcome, <span className="text-amber-400">{currentUser.nickname}</span>!
            </h2>
            <p className="text-lg text-slate-400 mt-1">What do you want to learn today?</p>

            <form onSubmit={handleSearch} className="mt-8 relative">
                <input 
                    type="text" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Photosynthesis, Ohm's Law, GDP..." 
                    className="w-full h-16 pl-6 pr-16 text-lg bg-gray-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-2xl shadow-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" 
                    required 
                />
                <motion.button 
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    type="submit" 
                    className="absolute right-3 top-3 w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-300 shadow"
                >
                    <Search className="w-6 h-6" />
                </motion.button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
                {suggestions.map(s => (
                    <motion.button 
                        whileHover={{ y: -2 }}
                        key={s} 
                        onClick={() => handleSuggestionClick(s)} 
                        className="suggestion-chip px-4 py-2 bg-white/10 backdrop-blur-sm text-amber-300 font-medium rounded-full shadow-sm border border-white/10 hover:bg-white/20 hover:text-amber-200 transition-colors"
                    >
                        {s}
                    </motion.button>
                ))}
            </div>

            <div className="mt-8">
                {isLoading && <ResultSkeleton />}
                <AnimatePresence>
                    {!isLoading && explanation && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            <ResultCard data={explanation} onVerify={handleVerifyRequest} showToast={showToast} />
                        </motion.div>
                    )}
                </AnimatePresence>
                {!isLoading && !explanation && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 text-center"
                    >
                        <Compass className="w-16 h-16 text-slate-600 mx-auto" strokeWidth={1} />
                        <p className="mt-4 text-slate-500 text-lg">Your 1-minute lesson will appear here.</p>
                    </motion.div>
                )}
            </div>
            
            <ProfileModal 
                show={showProfile}
                user={currentUser}
                onClose={() => setShowProfile(false)}
                onRegenerate={handleRegenerate}
                onSignOut={onSignOut}
            />
            
            <Toast message={toast.message} show={toast.show} />
        </motion.div>
    );
};

// --- MAIN APP COMPONENT ---
export default function App() {
    const [screen, setScreen] = useState('login');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user: storeUser, nickname, avatarSeed, setUser: setStoreUser } = useStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser && nickname && avatarSeed) {
                setUser({
                    uid: firebaseUser.uid,
                    nickname: nickname,
                    avatarSeed: avatarSeed
                });
                setScreen('main');
            } else if (!firebaseUser) {
                setUser(null);
                setScreen('login');
            }
        });

        return () => unsubscribe();
    }, [nickname, avatarSeed]);

    const handleLogin = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result.success) {
                const { nickname, avatarSeed } = useStore.getState();
                setUser({
                    uid: result.user.uid,
                    nickname: nickname,
                    avatarSeed: avatarSeed
                });
                setScreen('main');
            }
        } catch (err) {
            console.error('Login failed:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSignOutClick = useCallback(async () => {
        await handleSignOut();
        setUser(null);
        setScreen('login');
    }, []);

    return (
        <div className="bg-gray-900 text-slate-100 min-h-screen antialiased">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-amber-900/30 to-gray-900/0 blur-3xl opacity-50 -z-0" />
            
            <div className="relative z-10">
                <AnimatePresence mode="wait">
                    {screen === 'login' && (
                        <LoginScreen key="login" onLogin={handleLogin} isLoading={isLoading} />
                    )}
                    {screen === 'main' && user && (
                        <MainScreen key="main" user={user} onSignOut={handleSignOutClick} />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
